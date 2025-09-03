// File: backend/models/Book.js

const mongoose = require('mongoose');
const Counter = require('./counter'); // Import the counter model

const BookSchema = new mongoose.Schema({
    bookId: { // Our custom, user-friendly ID
        type: Number,
        unique: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: 'No description available.'
    },
    coverImage: { // URL to an image
        type: String,
        default: 'https://via.placeholder.com/150x220.png?text=No+Cover'
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });


// --- Mongoose Middleware to Auto-Increment bookId ---
// This function will run BEFORE a new document is saved
BookSchema.pre('save', async function(next) {
    // We only want to run this if the document is new
    if (this.isNew) {
        try {
            // Find the 'bookId' counter and increment its 'seq' value by 1
            // The { new: true } option ensures we get the updated document back
            const counter = await Counter.findByIdAndUpdate(
                { _id: 'bookId' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true } // upsert: true creates the counter if it doesn't exist
            );

            // Assign the new sequence number to our book's bookId
            this.bookId = counter.seq;
            next(); // Proceed with the save operation
        } catch (error) {
            next(error); // Pass any errors to the next middleware
        }
    } else {
        next(); // If the document is not new, just proceed
    }
});


const Book = mongoose.model('Book', BookSchema);
module.exports = Book;