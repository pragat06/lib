// File: backend/models/User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    
    // The user's verified MetaMask address
    walletAddress: { type: String, required: true, unique: true },

    // Fields for email verification
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date }
}, { 
    // Automatically add 'createdAt' and 'updatedAt' fields
    timestamps: true 
});

const User = mongoose.model('User', UserSchema);
module.exports = User;