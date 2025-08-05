const mongoose = require('mongoose');
const User = require('./models/User');

const users = [
  { name: 'Greta Thunberg', rippleScore: 96 },
  { name: 'Malala Yousafzai', rippleScore: 94 },
  { name: 'Elon Musk', rippleScore: 81 },
  { name: 'Jimmy Wales', rippleScore: 89 },
  { name: 'Boyan Slat', rippleScore: 91 },
  { name: 'Jose Andres', rippleScore: 92 },
  { name: 'Tim Berners-Lee', rippleScore: 87 },
  { name: 'Dolly Parton', rippleScore: 90 },
  { name: 'Mariana Mazzucato', rippleScore: 86 },
  { name: 'Jacinda Ardern', rippleScore: 88 },
  // Add 40 more if you want
];

mongoose.connect('mongodb://localhost:27017/Impact-Leaderboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  await User.deleteMany({});
  await User.insertMany(users);
  console.log('Dummy data inserted');
  mongoose.disconnect();
});
