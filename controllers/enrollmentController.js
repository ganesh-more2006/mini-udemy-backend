const Enrollment = require('../models/Enrollment');

// Exporting the first function
exports.enrollInCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const studentId = req.user._id;

        const alreadyEnrolled = await Enrollment.findOne({ student: studentId, course: courseId });
        if (alreadyEnrolled) {
    return res.status(400).json({ message: "You are already enrolled in this course!" });
}

        const enrollment = new Enrollment({ student: studentId, course: courseId });
        await enrollment.save();
        res.status(201).json({ message: "Enrolled Successfully!", enrollment });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//Exporting the second function for My Courses
exports.getUserEnrollments = async (req, res) => {
    try {
        const studentId = req.user._id;
        // Populate 'course' ensures we get course details like title/price
        const enrollments = await Enrollment.find({ student: studentId }).populate('course');
        res.status(200).json(enrollments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
