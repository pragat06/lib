// File: backend/routes/loans.js

const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');
const authMiddleware = require('../middleware/authMiddleware'); // Our JWT auth middleware

// --- GET /api/loans/my-books ---
// @desc    Get all books currently borrowed by the logged-in user
// @access  Private
router.get('/my-books', authMiddleware, async (req, res) => {
    try {
        // req.user is attached by the authMiddleware from the JWT
        const userWalletAddress = req.user.walletAddress.toLowerCase();

        // Find all loans belonging to the user and populate the book details
        const loans = await Loan.find({ borrowerWallet: userWalletAddress })
            .populate('bookDetails', 'title author coverImage') // Only get these fields from the Book model
            .sort({ dueDate: 1 }); // Sort by the soonest due date first

        res.json(loans);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;