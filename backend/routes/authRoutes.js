const express = require('express');
const router = express.Router();

const ADMIN_USER = 'shiv';
const ADMIN_PASS = 'shivmanu';

// Login Route
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    res.status(200).json({ message: 'Login successful', token: 'test-token' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Logout Route
router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
