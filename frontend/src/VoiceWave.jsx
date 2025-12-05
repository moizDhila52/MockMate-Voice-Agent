import React from "react";

const VoiceWave = ({ isSpeaking }) => {
  if (!isSpeaking) return null; // Don't show anything if silent

  return (
    <div style={styles.waveContainer}>
      <div style={{ ...styles.bar, animationDelay: "0s" }}></div>
      <div style={{ ...styles.bar, animationDelay: "0.1s" }}></div>
      <div style={{ ...styles.bar, animationDelay: "0.2s" }}></div>
      <div style={{ ...styles.bar, animationDelay: "0.3s" }}></div>
      <div style={{ ...styles.bar, animationDelay: "0.4s" }}></div>
    </div>
  );
};

const styles = {
  waveContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "40px",
    gap: "6px",
    marginTop: "20px",
  },
  bar: {
    width: "6px",
    height: "100%",
    backgroundColor: "#007bff",
    borderRadius: "10px",
    animation: "wave 1s infinite ease-in-out",
  },
};

// We need to inject the keyframes for the animation globally or inline
// For simplicity in React without an external CSS file, we can add a style tag
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes wave {
    0%, 100% { height: 10px; opacity: 0.5; }
    50% { height: 40px; opacity: 1; }
  }
`;
document.head.appendChild(styleSheet);

export default VoiceWave;
