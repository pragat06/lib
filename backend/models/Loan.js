// File: backend/models/Loan.js

const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
    bookId: {
        type: Number,
        required: true,
        unique: true // A book can only be on loan once
    },
    borrowerWallet: {
        type: String,
        required: true,
        lowercase: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    // This allows us to easily get the book's title, author, etc.
    bookDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }
}, { timestamps: true });

const Loan = mongoose.model('Loan', LoanSchema);
module.exports = Loan;