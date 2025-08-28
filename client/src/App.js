import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/api/leaderboard")
      .then((res) => res.json())
      .then((data) => setLeaderboard(data))
      .catch((err) => console.error("Error fetching leaderboard:", err));
  }, []);

  return (
    <div className="app">
      <h1 className="title gradient-text">Impact Leaderboard</h1>
      <div className="leaderboard">
        <div className="leaderboard-header">
          <span>Name</span>
          <span>Ripple Score</span>
        </div>
        {leaderboard.map((entry, idx) => (
          <div className="leaderboard-entry entry" key={idx}>
            <span className="gradient-text">{entry.name}</span>
            <span className="score-with-tooltip">
              <span className="gradient-text">{entry.rippleScore}</span>
              <div className="tooltip">
                <strong>Metrics Breakdown:</strong>
                <br />
                📈 <b>Reach</b>: {entry.reach.toLocaleString()} pageviews
                <br />
                📚 <b>Depth</b>: {entry.depth} references
                <br />
                ⏳ <b>Duration</b>: {entry.duration} days since first edit
              </div>
            </span>
          </div>

        ))}
      </div>
    </div>
  );
}

export default App;
