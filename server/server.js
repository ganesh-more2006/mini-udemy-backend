const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') }); 

const cors = require('cors');
const connectDB = require('./db');

const authRoutes = require('../routes/authRoutes');
const courseRoutes = require('../routes/courseRoutes');
const enrollmentRoutes = require('../routes/enrollmentRoutes'); 


require('../models/usermodel'); 

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);

connectDB();

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
