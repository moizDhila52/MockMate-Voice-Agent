import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./Landing";
import Interview from "./Interview";
import Scorecard from "./Scorecard"; // Make sure this file exists, or remove this line if you haven't created it yet

function App() {
  return (
    // The Router MUST be the top-level parent for navigation to work
    <Router>
      <div className="App">
        <Routes>
          {/* Page 1: Landing Page (The "/" path) */}
          <Route path="/" element={<Landing />} />

          {/* Page 2: The Interview Room */}
          <Route path="/interview" element={<Interview />} />

          {/* Page 3: The Scorecard */}
          <Route path="/score" element={<Scorecard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
