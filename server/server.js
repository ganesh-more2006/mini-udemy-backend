const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const path = require('path');

// .env file ka sahi path (agar backend folder ke root mein hai)
require('dotenv').config({ path: path.join(__dirname, '../.env') }); 

const app = express();

// CORS ko poora allow karein debugging ke liye
app.use(cors({
    origin: "origin:http://localhost:3000", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', require('../routes/authRoutes'));
app.use('/api/courses', require('../routes/courseRoutes'));
app.use('/api/enrollments', require('../routes/enrollmentRoutes'));

// Database Connection
connectDB();

// Railway ke liye Port dynamic hona chahiye
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));