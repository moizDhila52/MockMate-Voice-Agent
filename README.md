# 🤖 MockMate — AI Voice Interview Coach

**MockMate** is a real-time, voice-interactive AI interviewer that simulates human-like conversations with ultra-low latency voice AI, handles interruptions naturally, visualizes audio in real time, and generates a detailed performance scorecard after each mock interview.

---

## 🚀 Key Features
- **🎤 Real-time Voice Interaction** — Sub-100ms voice responses using streaming TTS + STT.  
- **⛔ Smart Interruption Handling** — Interrupt mid-sentence; it instantly adapts.  
- **📈 Live Waveform Visualizer** — Smooth audio visualization for immersive feedback.  
- **📊 Performance Scorecard** — Evaluates Technical Accuracy, Communication, and Clarity.

---

## 🛠️ Tech Stack & APIs
- **Frontend:** React (Vite), Tailwind CSS, Framer Motion  
- **Backend:** Node.js, Express  
- **TTS:** Murf AI (Falcon Streaming API with fallback to Gen-2)  
- **STT:** Deepgram Nova-2  
- **LLM:** Groq — Llama 3 8B  

> **Murf Falcon Architecture Note:**  
> The system always tries **Falcon (`en-US-ken`)** first.  
> If the API key doesn’t have Falcon access (**403 Forbidden**), it automatically switches to **Gen-2 (`en-US-natalie`)** without breaking continuity.

---

## 🎥 Demo Video • 🌐 Live Deployment • 🏷️ Tags

- **Demo Video:** https://youtu.be/4d8T_v8KDY8  
- **Live Deployment:** https://mock-mate-voice-agent.vercel.app/  
- **Tags:** `murf-ai`, `voice-agent`, `react`, `ai-interview`, `groq`, `deepgram`, `streaming-audio`, `stt`, `tts`

---

## ⚙️ Setup & Run (Single Unified Instructions)

```bash
# Clone repository
git clone https://github.com/moizDhila52/MockMate-Voice-Agent.git
cd MockMate-Voice-Agent

# Install all dependencies
cd backend && npm install
cd ../frontend && npm install

# Add environment variables (create .env in BOTH frontend & backend)
MURF_API_KEY=your_murf_key_here
GROQ_API_KEY=your_groq_key_here
DEEPGRAM_API_KEY=your_deepgram_key_here

# Start backend (http://localhost:3000)
cd ../backend
node index.js

# Start frontend (http://localhost:5173)
cd ../frontend
npm run dev
