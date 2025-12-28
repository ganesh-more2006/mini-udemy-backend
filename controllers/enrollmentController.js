const Enrollment = require('../models/Enrollment');

// ✅ 1. Enroll with Payment Logic
exports.enrollInCourse = async (req, res) => {
    try {
        const { courseId, paymentMethod } = req.body; // paymentMethod frontend se aayega
        const studentId = req.user._id;

        // Check if already enrolled
        const alreadyEnrolled = await Enrollment.findOne({ student: studentId, course: courseId });
        if (alreadyEnrolled) {
            return res.status(400).json({ message: "You are already enrolled in this course!" });
        }

        // Agar payment PhonePe/UPI hai, toh hum status 'pending' rakhenge (Real integration ke liye)
        // Abhi ke liye hum ise 'completed' kar rahe hain taaki aap test kar sakein
        const enrollment = new Enrollment({ 
            student: studentId, 
            course: courseId,
            paymentStatus: 'completed', // Real API mein ye 'pending' hoga jab tak PhonePe signal na de
            paymentId: `PAY-${Date.now()}` // Dummy Payment ID
        });

        await enrollment.save();
        res.status(201).json({ 
            message: `Enrolled via ${paymentMethod || 'UPI'} Successfully!`, 
            enrollment 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ 2. Get My Courses
exports.getUserEnrollments = async (req, res) => {
    try {
        const studentId = req.user._id;
        // Sirf wahi enrollments dikhao jinka payment 'completed' hai
        const enrollments = await Enrollment.find({ 
            student: studentId, 
            paymentStatus: 'completed' 
        }).populate('course');
        
        res.status(200).json(enrollments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};