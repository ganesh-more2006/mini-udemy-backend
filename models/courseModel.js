const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sections: [{
        title: { type: String, required: true },
        videoUrl: { type: String, required: true }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Course || mongoose.model('Course', courseSchema);