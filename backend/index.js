if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const multer = require('multer');
const { createClient } = require("@deepgram/sdk"); // Import Deepgram
const Groq = require('groq-sdk'); 
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' }); 
const port = process.env.PORT || 3000; // Use Render's port or 3000 locally

// Allow requests from anywhere (simplest for Hackathon)
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST']
}));
app.use(express.json());

// Initialize Clients
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

app.post('/api/process-interview', upload.single('audio'), async (req, res) => {
  try {
    const audioFile = req.file; 
    const { history } = req.body; 
    const chatHistory = JSON.parse(history || '[]'); 

    console.log("1. Audio received:", audioFile.path);

    // ---------------------------------------------------------
    // A. TRANSCRIBE AUDIO (DEEPGRAM) - THE NEW PART
    // ---------------------------------------------------------
    // We read the file from the hard drive and send it to Deepgram
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
        fs.readFileSync(audioFile.path),
        {
            model: "nova-2", // Their fastest/smartest model
            smart_format: true,
            mimetype: audioFile.mimetype,
        }
    );

    if (error) throw error;

    // Extract the text from the messy JSON response
    const userText = result.results.channels[0].alternatives[0].transcript;
    
    // Fallback if audio was silent
    if (!userText) {
        return res.json({ 
            userText: "(Silence)", 
            aiText: "I didn't hear anything. Could you please repeat that?", 
            audio: null 
        });
    }

    console.log("2. Transcription:", userText);

    // ---------------------------------------------------------
    // B. GET AI RESPONSE (GROQ)
    // ---------------------------------------------------------
    const messages = [
      { role: "system", content: "You are a strict interviewer. Keep answers concise (max 2 sentences)." },
      ...chatHistory,
      { role: "user", content: userText }
    ];

    const completion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.1-8b-instant", // The fast model
      temperature: 0.5,
      max_tokens: 100, 
    });

    const aiText = completion.choices[0].message.content;
    console.log("3. AI Response:", aiText);

    // ---------------------------------------------------------
    // C. GENERATE VOICE (MURF)
    // ---------------------------------------------------------
    const murfResponse = await axios.post('https://api.murf.ai/v1/speech/generate', {
      voiceId: 'en-US-natalie', 
      text: aiText,
      format: 'MP3'
    }, {
      headers: { 'api-key': process.env.MURF_API_KEY }
    });

    // ---------------------------------------------------------
    // D. SEND RESPONSE
    // ---------------------------------------------------------
    res.json({
      userText: userText,
      aiText: aiText,
      audio: murfResponse.data.audioFile 
    });

    // Cleanup: Delete the temp file to save space
    fs.unlinkSync(audioFile.path);

  } catch (error) {
    console.error("Error processing interview:", error);
    res.status(500).send("Error processing interview");
  }
});

// Route to Grade the Interview
app.post('/api/generate-score', async (req, res) => {
  try {
    const { history } = req.body;
    const chatHistory = JSON.parse(history || '[]');

    // System Prompt to force Groq to be a Grader
    const systemPrompt = `
      You are an expert interviewer. Analyze the following interview conversation.
      Return a JSON object (NO MARKDOWN, ONLY JSON) with this exact structure:
      {
        "technical": (score out of 10),
        "communication": (score out of 10),
        "clarity": (score out of 10),
        "feedback": "A short summary (max 2 sentences) of the candidate's performance."
      }
    `;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Here is the conversation history: ${JSON.stringify(chatHistory)}` }
    ];

    const completion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.1-8b-instant",
      temperature: 0.2, // Low temp for consistent JSON
      response_format: { type: "json_object" } // Force JSON mode
    });

    const scoreData = JSON.parse(completion.choices[0].message.content);
    res.json(scoreData);

  } catch (error) {
    console.error("Scoring Error:", error);
    res.status(500).json({ error: "Failed to generate score" });
  }
});

app.listen(port, () => {
  console.log(`MockMate Server started on port ${port}`);
});