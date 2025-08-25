// File: backend/routes/auth.js

const express = require('express');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { ethers } = require('ethers');
const User = require('../models/User');

const router = express.Router();

// --- 1. REGISTRATION WITH WALLET VERIFICATION ---
// Endpoint: POST /api/auth/register-with-wallet
router.post('/register-with-wallet', async (req, res) => {
    const { username, email, password, walletAddress, signature, message } = req.body;

    if (!username || !email || !password || !walletAddress || !signature || !message) {
        return res.status(400).json({ msg: 'Please provide all required fields.' });
    }

    try {
        // Verify the signature to prove wallet ownership
        const recoveredAddress = ethers.verifyMessage(message, signature);
        if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
            return res.status(401).json({ msg: 'Signature verification failed. Wallet not owned.' });
        }

        // Check if user or wallet already exists and is verified
        let user = await User.findOne({ $or: [{ email }, { username }, { walletAddress }] });
        if (user && user.isVerified) {
            return res.status(400).json({ msg: 'A user with these details already exists.' });
        }

        // Generate OTP and hash password
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // If user exists but is not verified, update them. Otherwise, create new.
        if (user) {
            user.password = hashedPassword;
            user.otp = otp;
            user.otpExpires = otpExpires;
            user.walletAddress = walletAddress; // Ensure wallet is correct
            await user.save();
        } else {
            user = new User({ username, email, password: hashedPassword, walletAddress, otp, otpExpires });
            await user.save();
        }

        // Configure email transport (using credentials from .env)
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });

        // Send the OTP email
        await transporter.sendMail({
            from: `"DLMS No Reply" <${process.env.EMAIL_FROM}>`,
            to: user.email,
            subject: 'Your Verification Code for DLMS',
            text: `Your One-Time Password (OTP) is: ${otp}`,
            html: `<b>Your One-Time Password (OTP) is: ${otp}</b><p>This code will expire in 10 minutes.</p>`,
        });

        res.status(201).json({ msg: 'Registration successful! An OTP has been sent to your email.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// --- 2. OTP VERIFICATION ---
// Endpoint: POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ msg: 'Please provide email and OTP.' });
    }

    try {
        const user = await User.findOne({ email });
        
        if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ msg: 'OTP is invalid or has expired.' });
        }

        user.isVerified = true;
        user.otp = undefined; // Clear OTP for security
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ msg: 'Email verified successfully. You can now log in.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// --- 3. LOGIN AND JWT (SESSION) CREATION ---
// Endpoint: POST /api/auth/login
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
        if (!user.isVerified) {
            return res.status(400).json({ msg: 'Please verify your email before logging in.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials.' });
        }

        const payload = {
            user: { id: user.id, username: user.username, walletAddress: user.walletAddress }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '3h' }, // Session lasts for 3 hours
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