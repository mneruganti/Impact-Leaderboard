import React, { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5001/api/leaderboard')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (data.length === 0) return <p>Loading...</p>;

  return (
    <div>
      <h1>Impact Leaderboard</h1>
      <ul>
        {data.map((entry, idx) => (
          <li key={idx}>{entry.name}: {entry.rippleScore}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
