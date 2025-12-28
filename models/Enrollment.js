const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    student: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    course: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Course', 
        required: true 
    },
    // ✅ Naya Field: Payment kis status par hai (pending/completed/failed)
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    // ✅ Naya Field: Konsa method use kiya (PhonePe/GPay/UPI)
    paymentMethod: {
        type: String,
        default: 'UPI'
    },
    // ✅ Naya Field: Transaction ID track karne ke liye
    paymentId: {
        type: String
    },
    enrolledAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);