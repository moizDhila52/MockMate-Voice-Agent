import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Vortex } from "./components/ui/vortex";
import { CardSpotlight } from "./components/ui/card-spotlight";
import { AnimatePresence, motion } from "framer-motion";

const Landing = () => {
  const navigate = useNavigate();
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div className="w-full bg-black overflow-x-hidden font-display relative">
      {/* --- HERO SECTION WITH VORTEX --- */}
      <div className="w-full h-screen relative overflow-hidden">
        <Vortex
          backgroundColor="black"
          className="flex items-center flex-col justify-center px-4 md:px-10 py-4 w-full h-full"
        >
          {/* Navbar (Overlay) */}
          <nav className="absolute top-0 w-full flex justify-between items-center p-6 z-50">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🤖</span>
              <h2 className="text-white text-xl font-bold">MockMate</h2>
            </div>
            <div className="hidden md:flex gap-6 text-gray-300">
              <a href="#features" className="hover:text-white transition">
                Features
              </a>
              <a href="#how-it-works" className="hover:text-white transition">
                How it Works
              </a>
            </div>
            <button
              onClick={() => setShowSignUp(true)}
              className="bg-white text-black px-4 py-2 rounded-full font-bold hover:bg-gray-200 transition"
            >
              Sign Up
            </button>
          </nav>

          <h2 className="text-white text-4xl md:text-7xl font-bold text-center mt-20">
            Master Your Interview <br />
            <span className="text-blue-500">With AI Voice Coaching</span>
          </h2>

          <p className="text-gray-300 text-sm md:text-xl max-w-xl mt-6 text-center">
            Practice with an AI that listens, thinks, and speaks like a real
            human. Get instant feedback and improve your confidence.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
            <button
              onClick={() => navigate("/interview")}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-full text-white shadow-[0px_0px_20px_0px_#2563EB80] font-bold text-lg"
            >
              Start Mock Interview
            </button>
            <button
              onClick={() => setShowSignUp(true)}
              className="px-8 py-4 text-white border border-gray-600 rounded-full hover:bg-gray-900 transition font-bold"
            >
              Upload Resume
            </button>
          </div>
        </Vortex>
      </div>

      {/* --- HOW IT WORKS --- */}
      <section id="how-it-works" className="py-20 px-4 md:px-20 bg-black">
        <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-16">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="group bg-neutral-900 border border-neutral-800 p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300 cursor-default">
            <div className="text-blue-500 text-4xl mb-4"></div>
            <h3 className="text-xl font-bold text-white mb-2">
              1. Start a Session
            </h3>
            <p className="text-gray-400">
              Choose your desired role and start a mock interview in seconds. No
              setup required.
            </p>
          </div>

          <div className="group bg-neutral-900 border border-neutral-800 p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300 cursor-default">
            <div className="text-blue-500 text-4xl mb-4"></div>
            <h3 className="text-xl font-bold text-white mb-2">
              2. Speak Naturally
            </h3>
            <p className="text-gray-400">
              Our AI handles interruptions and understands context, just like a
              real interviewer.
            </p>
          </div>

          <div className="group bg-neutral-900 border border-neutral-800 p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300 cursor-default">
            <div className="text-blue-500 text-4xl mb-4"></div>
            <h3 className="text-xl font-bold text-white mb-2">
              3. Get Feedback
            </h3>
            <p className="text-gray-400">
              Receive a detailed analysis of your answers, pacing, and filler
              words immediately.
            </p>
          </div>
        </div>
      </section>

      {/* --- FEATURES --- */}
      <section id="features" className="py-20 px-4 md:px-20 bg-neutral-950">
        <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-6">
          Powered by Tech
        </h2>
        <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
          MockMate leverages the best AI technologies to provide a
          hyper-realistic interview experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          <CardSpotlight className="h-64">
            <p className="text-2xl font-bold text-blue-400 relative z-20 mt-2">
              Groq Llama 3
            </p>
            <div className="text-neutral-200 mt-4 relative z-20 text-sm">
              Experience blazing-fast responses and intelligent feedback from a
              top-tier language model.
            </div>
          </CardSpotlight>
          <CardSpotlight className="h-64">
            <p className="text-2xl font-bold text-green-400 relative z-20 mt-2">
              Deepgram
            </p>
            <div className="text-neutral-200 mt-4 relative z-20 text-sm">
              Benefit from industry-leading Speech-to-Text for accurate
              transcription of your answers.
            </div>
          </CardSpotlight>
          <CardSpotlight className="h-64">
            <p className="text-2xl font-bold text-purple-400 relative z-20 mt-2">
              Murf AI
            </p>
            <div className="text-neutral-200 mt-4 relative z-20 text-sm">
              Hear realistic and natural-sounding questions with high-quality
              Text-to-Speech voices.
            </div>
          </CardSpotlight>
          <CardSpotlight className="h-64">
            <p className="text-2xl font-bold text-orange-400 relative z-20 mt-2">
              Real-Time
            </p>
            <div className="text-neutral-200 mt-4 relative z-20 text-sm">
              Engineered for low latency interactions (less than 500ms) to feel
              like a real conversation.
            </div>
          </CardSpotlight>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-24 px-4 bg-gradient-to-b from-black to-blue-900/20 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to land your dream job?
        </h2>
        <p className="text-gray-300 mb-8 max-w-xl mx-auto">
          Stop practicing in front of a mirror. Get the edge you need with
          AI-powered mock interviews that feel real.
        </p>
        <button
          onClick={() => setShowSignUp(true)}
          className="px-8 py-3 bg-white text-blue-900 font-bold rounded-lg hover:bg-gray-100 transition shadow-lg"
        >
          Get Started with MockMate
        </button>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-neutral-800 bg-black py-8 text-center text-gray-500 text-sm">
        <p>© 2025 MockMate. Built for Techfest 2025.</p>
      </footer>

      {/* --- SIGN UP MODAL (POPUP) --- */}
      <AnimatePresence>
        {showSignUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowSignUp(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} // Prevent clicking inside from closing
              className="bg-neutral-900 border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl relative"
            >
              <div className="text-5xl mb-4">🚧</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Prototype Version
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Authentication and Resume Upload are currently disabled in this
                hackathon demo.
              </p>
              <button
                onClick={() => setShowSignUp(false)}
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Landing;
