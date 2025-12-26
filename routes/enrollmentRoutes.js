const express = require('express');
const router = express.Router();

const { enrollInCourse, getUserEnrollments } = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');

// Route 1: For enrolling (POST)
router.post('/enroll', protect, enrollInCourse);

// Route 2: For fetching user courses (GET)
router.get('/my-courses', protect, getUserEnrollments);

module.exports = router;