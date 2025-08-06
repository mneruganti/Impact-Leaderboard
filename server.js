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
  { name: "Greta Thunberg", rippleScore: 95 },
  { name: "Malala Yousafzai", rippleScore: 90 },
  { name: "Elon Musk", rippleScore: 85 },
  { name: "Bill Gates", rippleScore: 80 },
  { name: "Jane Goodall", rippleScore: 75 },
  { name: "David Attenborough", rippleScore: 70 },
  { name: "Angela Merkel", rippleScore: 65 },
  { name: "Barack Obama", rippleScore: 60 },
  { name: "Jacinda Ardern", rippleScore: 55 },
  { name: "Oprah Winfrey", rippleScore: 50 },
  { name: "Neil deGrasse Tyson", rippleScore: 45 },
  { name: "Emma Watson", rippleScore: 40 }
];

app.get('/api/leaderboard', (req, res) => {
    const topTen = leaderboardData
      .sort((a, b) => b.rippleScore - a.rippleScore)
      .slice(0, 10);
    res.json(topTen);
  });
  
  // Start server
  const PORT = 5001;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  