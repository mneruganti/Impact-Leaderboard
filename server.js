const express = require('express');
//const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./server/routes/users');

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 5000;

// mongoose.connect('mongodb://localhost:27017/impact-os', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

app.get('/api/leaderboard', (req, res) => {
    const topTen = leaderboardData
      .sort((a, b) => b.rippleScore - a.rippleScore)
      .slice(0, 10);
    res.json(topTen);
  });
  
  // Start server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });