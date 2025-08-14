const express = require('express');
// const mongoose = require('mongoose');
const cors = require('cors');
// const userRoutes = require('./server/routes/users');

const app = express();
app.use(cors());
app.use(express.json());
// const PORT = 5000;

// mongoose.connect('mongodb://localhost:27017/impact-os', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });


app.get('/', (req, res) => {
  res.send('API is working!');
});

const leaderboardData = [
  { name: "Greta Thunberg", mentions: 120, sentiment: 0.9, reach: 5000000, velocity: 25 },
  { name: "Malala Yousafzai", mentions: 95, sentiment: 0.85, reach: 3000000, velocity: 18 },
  { name: "Elon Musk", mentions: 300, sentiment: 0.65, reach: 120000000, velocity: 50 },
  { name: "Bill Gates", mentions: 150, sentiment: 0.8, reach: 80000000, velocity: 22 },
  { name: "Jane Goodall", mentions: 60, sentiment: 0.95, reach: 1000000, velocity: 10 },
  { name: "David Attenborough", mentions: 80, sentiment: 0.92, reach: 2000000, velocity: 12 },
  { name: "Angela Merkel", mentions: 70, sentiment: 0.7, reach: 5000000, velocity: 8 },
  { name: "Barack Obama", mentions: 110, sentiment: 0.85, reach: 60000000, velocity: 15 },
  { name: "Jacinda Ardern", mentions: 50, sentiment: 0.9, reach: 3000000, velocity: 9 },
  { name: "Oprah Winfrey", mentions: 90, sentiment: 0.75, reach: 40000000, velocity: 11 },
  { name: "Neil deGrasse Tyson", mentions: 45, sentiment: 0.8, reach: 5000000, velocity: 7 },
  { name: "Emma Watson", mentions: 65, sentiment: 0.85, reach: 10000000, velocity: 14 }
];

function calculateRippleScore({ mentions, sentiment, reach, velocity }) {
  return Math.round((
    (mentions * 0.4) +
    (sentiment * 100 * 0.3) +
    (Math.log10(reach || 1) * 20 * 0.2) +
    (velocity * 0.1)
  ) * 100) / 100;
}

app.get('/api/leaderboard', (req, res) => {

    const leaderboardWithScores = leaderboardData.map(person => ({
      name: person.name,
      rippleScore: calculateRippleScore(person),
      metrics: {
        mentions: person.mentions,
        sentiment: person.sentiment,
        reach: person.reach,
        velocity: person.velocity
      }
    }));

    const topTen = leaderboardWithScores
      .sort((a, b) => b.rippleScore - a.rippleScore)
      .slice(0, 10);
    res.json(topTen);
  });
  
  // Start server
  const PORT = 5001;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  