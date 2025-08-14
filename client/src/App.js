import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5001/api/leaderboard')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <div className="app">
      <h1 className="title gradient-text">Impact Leaderboard</h1>

      <div className="leaderboard">
        <div className="leaderboard-header entry">
          <span>Name</span>
          <span>Ripple Score</span>
        </div>

        {data.length > 0 && data.map((entry, idx) => (
          <div className="leaderboard-entry entry" key={idx}>
            <span className="gradient-text">{entry.name}</span>
            <span className="score-with-tooltip">
  <span className="gradient-text">{entry.rippleScore}</span>
  <div className="tooltip">
    <strong>Breakdown:</strong><br />
    Mentions: {entry.metrics?.mentions}<br />
    Sentiment: {entry.metrics?.sentiment}<br />
    Reach: {entry.metrics?.reach.toLocaleString()}<br />
    Velocity: {entry.metrics?.velocity}
  </div>
</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
