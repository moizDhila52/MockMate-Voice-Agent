import React from "react";
import "./AIOrb.css";

const AIOrb = ({ isSpeaking }) => {
  return (
    <div className="orb-container">
      {/* The Outer Ring (The "Waveform" bars) */}
      <div
        className={`orb-ring ${isSpeaking ? "fast-spin" : "slow-spin"}`}
      ></div>

      {/* The Outer Glow (Soft blue haze) */}
      <div
        className={`orb-glow ${isSpeaking ? "pulse-fast" : "pulse-slow"}`}
      ></div>

      {/* The Core (The solid blue sphere) */}
      <div className="orb-core"></div>
    </div>
  );
};

export default AIOrb;
