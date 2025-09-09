// File: backend/routes/auth.js

const express = require('express');
const bcrypt = require('bcryptjs');
// REMOVED: const nodemailer = require('nodemailer'); // No longer needed
const jwt = require('jsonwebtoken');
const { ethers } = require('ethers');
const User = require('../models/User');

const router = express.Router();

// --- SIMPLIFIED REGISTRATION ROUTE ---
router.post('/register-with-wallet', async (req, res) => {
    const { username, email, password, walletAddress, signature, message } = req.body;

    if (!username || !email || !password || !walletAddress || !signature || !message) {
        return res.status(400).json({ msg: 'Please provide all required fields.' });
    }

    try {
        const recoveredAddress = ethers.verifyMessage(message, signature);
        if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
            return res.status(401).json({ msg: 'Signature verification failed.' });
        }

        let user = await User.findOne({ $or: [{ email }, { username }, { walletAddress }] });
        if (user) {
            return res.status(400).json({ msg: 'A user with these details already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user (already verified by default)
        user = new User({
            username,
            email,
            password: hashedPassword,
            walletAddress,
        });
        await user.save();

        // NO OTP EMAIL IS SENT

        res.status(201).json({ msg: 'Registration successful! You can now log in.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// --- REMOVED THE /verify-otp ROUTE ---


// --- SIMPLIFIED LOGIN ROUTE ---
router.post('/login', async (req, res) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({ msg: 'Please provide all fields.' });
    }

    try {
        const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials.' });
        }

        // REMOVED: The check for user.isVerified is no longer needed

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials.' });
        }

        const payload = {
            user: { id: user.id, username: user.username, walletAddress: user.walletAddress,email: user.email }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '3h' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: { username: user.username, email: user.email, walletAddress: user.walletAddress }
                });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;