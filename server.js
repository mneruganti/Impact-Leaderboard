const express = require('express');
//const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./server/routes/users');

const app = express();
app.use(cors());
app.use(express.json());

// mongoose.connect('mongodb://localhost:27017/impact-os', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

app.use('/api/users', userRoutes);

app.listen(5000, () => {
  console.log('Server running on port 5000');
});