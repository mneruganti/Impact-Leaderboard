const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/top', async (req, res) => {
  try {
    const topUsers = await User.find().sort({ rippleScore: -1 }).limit(10);
    res.json(topUsers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
