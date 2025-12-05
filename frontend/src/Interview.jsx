import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useReactMediaRecorder } from "react-media-recorder";
import VoiceWave from "./VoiceWave";

const Interview = () => {
  const navigate = useNavigate();
  const [questionCount, setQuestionCount] = useState(0);

  const [chatHistory, setChatHistory] = useState([
    {
      role: "assistant",
      content:
        "Welcome to your mock interview. I'm here to help you practice. Let's begin when you're ready. Tell me about yourself.",
    },
  ]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isProcessing]);

  const uploadAudio = async (audioBlob) => {
    setIsProcessing(true);

    try {
      if (audioBlob.size < 500) {
        console.warn("Audio too short");
        setIsProcessing(false);
        return;
      }

      const formData = new FormData();
      formData.append("audio", audioBlob, "response.webm");
      formData.append("history", JSON.stringify(chatHistory));

      const response = await axios.post(
        "http://localhost:3000/api/process-interview",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const data = response.data;

      setChatHistory((prev) => [
        ...prev,
        { role: "user", content: data.userText },
        { role: "assistant", content: data.aiText },
      ]);

      setQuestionCount((prev) => prev + 1);

      if (data.audio) {
        audioRef.current.src = data.audio;
        audioRef.current.play();
        setIsSpeaking(true);
      }
    } catch (error) {
      console.error(error);
      alert("Error connecting to server.");
    } finally {
      setIsProcessing(false);
    }
  };

  const {
    status: recordStatus,
    startRecording: beginRecording,
    stopRecording: stopRecord,
  } = useReactMediaRecorder({
    audio: true,
    onStop: (blobUrl, blob) => uploadAudio(blob),
  });

  const handleFinish = async () => {
    if (chatHistory.length <= 1) {
      alert("Please answer at least one question!");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/generate-score",
        { history: JSON.stringify(chatHistory) }
      );
      navigate("/score", { state: response.data });
    } catch (error) {
      console.error(error);
      alert("Failed to generate score");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMicClick = () => {
    if (isSpeaking) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsSpeaking(false);
    }

    if (recordStatus === "recording") {
      stopRecord();
    } else {
      beginRecording();
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-dark font-display overflow-hidden">
      {/* HEADER */}
      <header className="flex items-center justify-between px-8 py-5 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="text-3xl filter drop-shadow-lg">🤖</div>
          <h2 className="text-white text-xl font-bold tracking-tight">
            MockMate
          </h2>
        </div>
        <div className="flex items-center gap-6">
          <p className="text-gray-400 text-sm font-medium hidden sm:block tracking-wide">
            Behavioral Interview
          </p>
          <button
            onClick={handleFinish}
            className="rounded-full h-10 px-6 bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition shadow-[0_0_15px_rgba(37,99,235,0.5)] border border-blue-400/30"
          >
            End Session
          </button>
        </div>
      </header>

      {/* MAIN CONTENT GRID */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 pt-2 h-full min-h-0">
        {/* LEFT SIDEBAR (Controls & Avatar) */}
        {/* Added: border-white/10 and bg-slate-grey to create the card look */}
        <aside className="lg:col-span-4 bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-3xl flex flex-col items-center justify-center p-8 space-y-8 h-full shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none"></div>

          {/* Avatar Animation */}
          <div className="relative flex items-center justify-center z-10">
            {isSpeaking && (
              <div className="absolute size-52 bg-blue-500/20 rounded-full animate-ping"></div>
            )}
            <div className="bg-gradient-to-br from-gray-800 to-black text-gray-300 rounded-full flex items-center justify-center size-40 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <span className="text-7xl filter drop-shadow-md">🧠</span>
            </div>
          </div>

          <div className="text-center z-10">
            <h3 className="text-white font-bold text-2xl tracking-tight">
              AI Interviewer
            </h3>
            <p
              className={`text-sm font-medium mt-2 transition-colors duration-300 ${
                isSpeaking ? "text-blue-400" : "text-gray-500"
              }`}
            >
              {isSpeaking ? "Speaking..." : "Listening..."}
            </p>
          </div>

          {/* Waveform Visualizer */}
          <div className="w-full h-20 flex items-center justify-center z-10">
            <VoiceWave isSpeaking={isSpeaking} />
          </div>

          {/* Big Mic Button */}
          <div className="flex flex-col items-center gap-4 w-full z-10">
            <button
              onClick={handleMicClick}
              className={`flex items-center justify-center rounded-full size-24 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl border-4 ${
                recordStatus === "recording"
                  ? "bg-red-500 border-red-400 text-white animate-pulse shadow-red-500/40"
                  : "bg-white border-gray-200 text-black shadow-white/20 hover:shadow-white/40"
              }`}
            >
              <span className="text-4xl material-symbols-outlined">
                {recordStatus === "recording" ? "stop" : "mic"}
              </span>
            </button>
            <span className="text-gray-400 font-medium text-sm tracking-wide">
              {recordStatus === "recording" ? "Tap to Send" : "Tap to Speak"}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="flex flex-col gap-2 w-full max-w-xs mt-auto z-10">
            <div className="flex justify-between text-gray-400 text-xs font-bold uppercase tracking-wider">
              <span>Progress</span>
              <span>{Math.min((questionCount / 5) * 100, 100)}%</span>
            </div>
            <div className="rounded-full bg-gray-800 h-2 w-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                style={{ width: `${(questionCount / 5) * 100}%` }}
              ></div>
            </div>
            <p className="text-gray-500 text-xs text-right mt-1">
              Question {questionCount} of 5
            </p>
          </div>
        </aside>

        {/* RIGHT SECTION (Chat Interface) */}
        {/* Added: enclosed look with border and background */}
        <section className="lg:col-span-8 bg-black/40 backdrop-blur-sm border border-white/10 rounded-3xl flex flex-col overflow-hidden h-full relative shadow-inner">
          {/* Top Fade for smooth scrolling look */}
          <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-black/40 to-transparent z-10 pointer-events-none"></div>

          <div
            className="flex-1 p-8 space-y-8 overflow-y-auto scroll-smooth custom-scrollbar"
            ref={chatContainerRef}
          >
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-5 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                } group`}
              >
                {/* Avatar Icon */}
                <div
                  className={`rounded-full flex items-center justify-center size-12 shrink-0 text-xl border border-white/10 shadow-lg ${
                    msg.role === "user"
                      ? "bg-blue-600/20 text-blue-400"
                      : "bg-gray-800 text-gray-400"
                  }`}
                >
                  {msg.role === "user" ? "👤" : "🤖"}
                </div>

                <div
                  className={`flex flex-col gap-2 max-w-[80%] ${
                    msg.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 ${
                      msg.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-wider opacity-70 group-hover:opacity-100 transition-opacity">
                      {msg.role === "user" ? "You" : "AI Interviewer"}
                    </span>
                  </div>

                  {/* THE CHAT BUBBLE - Refined Borders */}
                  <div
                    className={`p-5 rounded-3xl text-[15px] leading-relaxed shadow-md border ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-tr-none border-blue-500/50 shadow-blue-900/20"
                        : "bg-[#1A202C] text-gray-200 rounded-tl-none border-white/10 shadow-black/40"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}

            {/* Thinking Bubble */}
            {isProcessing && (
              <div className="flex items-start gap-5 animate-pulse">
                <div className="bg-gray-800 rounded-full flex items-center justify-center size-12 shrink-0 border border-white/10">
                  🤖
                </div>
                <div className="bg-[#1A202C] p-5 rounded-3xl rounded-tl-none border border-white/10 flex items-center gap-3">
                  <span className="text-gray-400 text-sm font-medium">
                    Thinking
                  </span>
                  <div className="flex gap-1.5">
                    <div
                      className="size-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0s" }}
                    ></div>
                    <div
                      className="size-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="size-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Fade */}
          <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
        </section>
      </main>

      {/* Hidden Audio Player */}
      <audio
        ref={audioRef}
        className="hidden"
        onEnded={() => setIsSpeaking(false)}
      />
    </div>
  );
};

export default Interview;
