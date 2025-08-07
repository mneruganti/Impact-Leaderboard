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
      <h1 className="title">Impact Leaderboard</h1>

      <div className="leaderboard">
        <div className="leaderboard-header">
          <span>Name</span>
          <span>Ripple Score</span>
        </div>

        {data.map((entry, idx) => (
          <div className="leaderboard-entry" key={idx}>
            <span>{entry.name}</span>
            <span>{entry.rippleScore}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
