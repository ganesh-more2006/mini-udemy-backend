const express = require('express');
const router = express.Router();
const { 
    createCourse, 
    getAllCourses, 
    getCourseById, 
    updateCourse, 
    deleteCourse 
} = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

router.get('/all', getAllCourses);
router.post('/add', protect, createCourse);

router.get('/:id', getCourseById); 
router.put('/:id', protect, updateCourse);    
router.delete('/:id', protect, deleteCourse); 
module.exports = router;