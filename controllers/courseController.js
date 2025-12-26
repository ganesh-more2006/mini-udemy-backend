const Course = require('../models/courseModel');

// 1. CREATE Course (With Validation and Auth)

exports.createCourse = async (req, res) => {
    try {
       
        const { title, description, price, category, sections } = req.body;

        if (!title || !description || !price || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newCourse = new Course({
            title,
            description,
            price,
            category,
            sections,
            instructor: req.user._id 
        });

        await newCourse.save();
        res.status(201).json({ message: "Course added successfully", newCourse });
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 2. GET ALL Courses
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('instructor', 'name'); 
        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. GET SINGLE COURSE by ID
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('instructor', 'name');
        if (!course) return res.status(404).json({ message: "Course not found" });
        res.status(200).json(course);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. UPDATE COURSE
exports.updateCourse = async (req, res) => {
    try {
        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true } 
        );
        res.status(200).json({ message: "Course updated!", course: updatedCourse });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 5. DELETE Course
exports.deleteCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        console.log("Deleting course with ID:", courseId);

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        if (course.instructor.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "You can only delete your own course." });
        }

        await Course.findByIdAndDelete(courseId);
        res.status(200).json({ message: "Course deleted successfully" });
    } catch (err) {
        console.error("Delete Controller Error:", err.message);
        res.status(500).json({ error: err.message });
    }
};


exports.addCourse = async (req, res) => {
    try {
    
        const { title, description, price, category, sections } = req.body; 

        const newCourse = new Course({
            title,
            description,
            price,
            category,
            sections, 
            instructor: req.user._id
        });

        await newCourse.save();
        res.status(201).json(newCourse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};