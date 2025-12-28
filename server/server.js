const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const path = require('path');

// Env file path check
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = express();

// ✅ CORS Fix: origin '*' karne se mobile aur laptop dono par payment/login errors nahi aayenge
app.use(cors({
    origin: "*", 
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

const PORT = process.env.PORT || 5000;


app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));