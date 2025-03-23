const dotenv = require('dotenv');
require('colors');
dotenv.config({ path: __dirname + '/.env' }); // 👈 Absolute path use karo

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
app.use(express.json());
app.use(cors());

const thumbnailRoutes = require('./routes/thumbnailRoutes');

app.use('/api/thumbnails', thumbnailRoutes);


const PORT = process.env.PORT || 5000;

// Connect MongoDB
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const path = require('path');

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/admin.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});


const authRoutes = require('./routes/authRoutes');

app.use('/api/auth', authRoutes);




