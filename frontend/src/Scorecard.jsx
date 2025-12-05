import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Scorecard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scoreData, setScoreData] = useState(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (location.state) {
      setScoreData(location.state);
      // Trigger animation after a brief delay
      setTimeout(() => setAnimate(true), 100);
    } else {
      console.warn("⚠️ No score data found.");
    }
  }, [location]);

  // --- FALLBACK UI (No Data) ---
  if (!scoreData) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center p-6 font-display">
        <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center shadow-2xl">
          <div className="text-6xl mb-4">📉</div>
          <h1 className="text-2xl font-bold text-white mb-2">
            No Report Found
          </h1>
          <p className="text-gray-400 mb-8">
            Complete an interview session to generate your personalized AI
            feedback.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 px-6 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]"
          >
            Start New Session
          </button>
        </div>
      </div>
    );
  }

  // --- MAIN SCORECARD UI ---
  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center p-6 font-display overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-3xl w-full bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block p-3 rounded-full bg-white/5 border border-white/10 mb-4 shadow-inner">
            <span className="text-4xl">📊</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Performance Report
          </h1>
          <p className="text-gray-400 mt-2">
            AI-Generated Analysis of your Interview
          </p>
        </div>

        {/* Scores Section */}
        <div className="space-y-8 mb-12">
          <ScoreBar
            label="Technical Accuracy"
            score={scoreData.technical}
            color="bg-green-500"
            animate={animate}
          />
          <ScoreBar
            label="Communication"
            score={scoreData.communication}
            color="bg-blue-500"
            animate={animate}
          />
          <ScoreBar
            label="Clarity & Pace"
            score={scoreData.clarity}
            color="bg-amber"
            animate={animate}
          />
        </div>

        {/* Feedback Section */}
        <div className="bg-black/30 border-l-4 border-primary rounded-r-xl p-6 mb-10">
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary"></span>
            AI Feedback
          </h3>
          <p className="text-gray-300 leading-relaxed italic">
            "{scoreData.feedback}"
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/interview")}
            className="flex-1 py-4 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 transition-all shadow-[0_4px_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined"></span>
            Try Again
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex-1 py-4 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined"></span>
            Back Home
          </button>
        </div>
      </div>
    </div>
  );
};

// Reusable Bar Component
const ScoreBar = ({ label, score, color, animate }) => {
  return (
    <div className="group">
      <div className="flex justify-between mb-2">
        <span className="text-gray-300 font-medium group-hover:text-white transition-colors">
          {label}
        </span>
        <span className="text-white font-bold">{score}/10</span>
      </div>
      <div className="h-4 w-full bg-gray-800 rounded-full overflow-hidden border border-white/5">
        <div
          className={`h-full rounded-full ${color} shadow-[0_0_10px_currentColor] transition-all duration-1000 ease-out`}
          style={{ width: animate ? `${score * 10}%` : "0%" }}
        ></div>
      </div>
    </div>
  );
};

export default Scorecard;
