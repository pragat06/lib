// File: backend/models/User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    walletAddress: { type: String, required: true, unique: true },

    // We can keep this for future use, but we'll default it to true now.
    isVerified: { type: Boolean, default: true },

    // REMOVED: otp: { type: String },
    // REMOVED: otpExpires: { type: Date }
}, { 
    timestamps: true 
});

const User = mongoose.model('User', UserSchema);
module.exports = User;