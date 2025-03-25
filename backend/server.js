const dotenv = require('dotenv');
require('colors');
dotenv.config({ path: __dirname + '/.env' }); // 👈 Absolute path use karo

const express = require('express');

const connectDB = require('./config/db');

const app = express();
app.use(express.json());
const cors = require('cors');

app.use(cors({
  origin: '*', // Allow requests from anywhere (for testing)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


const thumbnailRoutes = require('./routes/thumbnailRoutes');

app.use('/api/thumbnails', thumbnailRoutes);


const PORT = process.env.PORT || 5000;

// Connect MongoDB
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const path = require('path');

app.use(express.static(path.join(__dirname, '../docs')));

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../docs/admin.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../docs/index.html'));
});


const authRoutes = require('./routes/authRoutes');

app.use('/api/auth', authRoutes);




