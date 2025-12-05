if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const multer = require('multer');
const { createClient } = require("@deepgram/sdk"); 
const Groq = require('groq-sdk'); 
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' }); 
const port = process.env.PORT || 3000; 

// Allow requests from anywhere
app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));
app.use(express.json());

// Initialize Clients
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

// --- MAIN ROUTE: PROCESS INTERVIEW ---
app.post('/api/process-interview', upload.single('audio'), async (req, res) => {
  try {
    const audioFile = req.file; 
    const { history } = req.body; 
    const chatHistory = JSON.parse(history || '[]'); 

    console.log("1. Audio received:", audioFile.path);

    // 1. TRANSCRIBE AUDIO (DEEPGRAM)
    const fileBuffer = fs.readFileSync(audioFile.path);
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
        fileBuffer,
        { model: "nova-2", smart_format: true, mimetype: "audio/webm" }
    );

    if (error) throw error;
    const userText = result?.results?.channels[0]?.alternatives[0]?.transcript;
    
    if (!userText || userText.trim().length === 0) {
        return res.json({ 
            userText: "(Silence)", 
            aiText: "I couldn't hear any audio. Please try speaking louder.", 
            audio: null 
        });
    }
    console.log("2. Transcription:", userText);

    // 2. GET AI RESPONSE (GROQ)
    const messages = [
      { role: "system", content: "You are a strict interviewer. Keep answers concise (max 2 sentences)." },
      ...chatHistory,
      { role: "user", content: userText }
    ];

    const completion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.1-8b-instant",
      temperature: 0.5,
      max_tokens: 100, 
    });

    const aiText = completion.choices[0].message.content;
    console.log("3. AI Response:", aiText);

    // ---------------------------------------------------------
    // 3. GENERATE VOICE (MURF FALCON STREAMING - EXACT SNIPPET INTEGRATION)
    // ---------------------------------------------------------
    console.log("🔊 Generating Audio with Falcon Stream (Natalie)...");

    const murfUrl = 'https://global.api.murf.ai/v1/speech/stream'; // The Streaming Endpoint
    
    // Configuration from your provided snippet
    const streamData = {
      voiceId: "en-US-natalie", // Using Natalie as requested
      style: "Promo",           // Required for Natalie on Falcon
      text: aiText,
      multiNativeLocale: "en-US",
      model: "FALCON",
      format: "MP3",
      sampleRate: 24000,
      channelType: "MONO"
    };

    const streamConfig = {
      method: 'post',
      url: murfUrl,
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.MURF_API_KEY
      },
      data: streamData,
      responseType: 'stream', // Critical for receiving chunks
      validateStatus: () => true // Prevent immediate crash on 4xx/5xx
    };

    // We wrap the stream logic in a Promise to await the full Base64 string
    const audioDataURI = await new Promise((resolve, reject) => {
        axios(streamConfig)
            .then((response) => {
                // If the API returns an error (like 403), reject immediately
                if (response.status >= 400) {
                    console.error(`Murf API Error: ${response.status} ${response.statusText}`);
                    // We try to read the error message from the stream
                    response.data.on('data', (chunk) => console.error("Error Details:", chunk.toString()));
                    return reject(new Error(`Murf API Error: ${response.status}`));
                }

                const chunks = [];
                
                // Collect audio chunks as they arrive
                response.data.on('data', (chunk) => {
                    chunks.push(chunk);
                });

                // When stream ends, combine chunks and convert to Base64
                response.data.on('end', () => {
                    console.log('Stream ended. Audio ready.');
                    const audioBuffer = Buffer.concat(chunks);
                    const base64Audio = audioBuffer.toString('base64');
                    // Create a Data URI that the frontend can play immediately
                    resolve(`data:audio/mp3;base64,${base64Audio}`);
                });

                response.data.on('error', (err) => reject(err));
            })
            .catch((error) => {
                console.error("Axios Request Failed:", error.message);
                reject(error);
            });
    });

    // 4. SEND RESPONSE
    res.json({
      userText: userText,
      aiText: aiText,
      audio: audioDataURI
    });

    if (fs.existsSync(audioFile.path)) fs.unlinkSync(audioFile.path);

  } catch (error) {
    console.error("❌ Error processing interview:", error.message);
    res.status(500).send("Error processing interview");
  }
});

// --- ROUTE: GENERATE SCORE ---
app.post('/api/generate-score', async (req, res) => {
  try {
    const { history } = req.body;
    const chatHistory = JSON.parse(history || '[]');
    const systemPrompt = `You are an expert interviewer. Analyze the conversation. Return JSON: { "technical": (0-10), "communication": (0-10), "clarity": (0-10), "feedback": "Short summary." }`;
    
    const completion = await groq.chat.completions.create({
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: JSON.stringify(chatHistory) }],
      model: "llama-3.1-8b-instant",
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    res.json(JSON.parse(completion.choices[0].message.content));
  } catch (error) {
    console.error("Scoring Error:", error);
    res.status(500).json({ error: "Failed to generate score" });
  }
});

app.listen(port, () => {
  console.log(`MockMate Server started on port ${port}`);
});