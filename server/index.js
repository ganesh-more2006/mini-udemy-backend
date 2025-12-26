require('dotenv').config({ path: './backend/.env' }); 
const express = require('express');
const cors = require('cors');
const connectDB = require('./backend/server/db');
const authRoutes = require('./backend/routes/authRoutes'); 

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);

// Database Connect
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));