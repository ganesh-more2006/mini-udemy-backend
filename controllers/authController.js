const User = require('../models/usermodel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// 1. REGISTER USER
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        user = new User({
            name,
            email,
            password,
            role: role || 'student'
        });

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 2. LOGIN USER
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });

        res.status(200).json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 3. FORGOT PASSWORD - Send OTP
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User nahi mila!" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOTP = otp;
        user.otpExpires = Date.now() + 600000; // 10 minute valid
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // ✅ `.env` se email uthayega
                pass: process.env.EMAIL_PASS  // ✅ `.env` se App Password uthayega
            }
        });

        await transporter.sendMail({
            from: '"Mini Udemy" <support@miniudemy.com>',
            to: email,
            subject: 'Password Reset OTP',
            text: `Aapka Password Reset OTP hai: ${otp}. Ye 10 minute ke liye valid hai.`
        });

        res.status(200).json({ message: "OTP email par bhej diya gaya hai" });
    } catch (error) {
        console.error("Forgot Pass Error:", error);
        res.status(500).json({ error: error.message });
    }
};

// 4. RESET PASSWORD - Verify OTP & Update Password
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        // Check if OTP matches and hasn't expired
        const user = await User.findOne({ 
            email, 
            resetOTP: otp, 
            otpExpires: { $gt: Date.now() } 
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid OTP ya Expired!" });
        }

        // Set new password (pre-save hook will hash it automatically)
        user.password = newPassword;
        
        // Clear OTP fields
        user.resetOTP = undefined;
        user.otpExpires = undefined;
        
        await user.save();
        res.status(200).json({ message: "Password successfully update ho gaya!" });
    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};