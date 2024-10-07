const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

router.post('/update', authenticateToken, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    await User.findByIdAndUpdate(req.user.userId, {
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      }
    });
    res.sendStatus(200);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/users', authenticateToken, async (req, res) => {
  try {
    const users = await User.find({}, 'username location');
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;