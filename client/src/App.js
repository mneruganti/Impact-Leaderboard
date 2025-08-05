import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/users/top')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>🌍 Ripple Score Leaderboard</h1>
      <ul>
        {users.map((user, index) => (
          <li key={user.name}>
            #{index + 1} — <strong>{user.name}</strong> (Ripple Score: {user.rippleScore})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
