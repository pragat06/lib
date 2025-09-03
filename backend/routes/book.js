// File: backend/routes/books.js

const express = require('express');
const Book = require('../models/book'); // Import the Book model
// We might add auth middleware later for the POST route
// const auth = require('../middleware/auth'); 

const router = express.Router();

// --- ROUTE 1: Add a New Book (Admin Only) ---
// Method: POST /api/books
// Note: We'll make this an open route for now for easy testing.
router.post('/', async (req, res) => {
    const { title, author, description, coverImage } = req.body;

    if (!title || !author) {
        return res.status(400).json({ msg: 'Please provide a title and author.' });
    }

    try {
        const newBook = new Book({
            title,
            author,
            description,
            coverImage
        });

        // The pre-save middleware in Book.js will automatically assign the bookId
        const savedBook = await newBook.save();

        res.status(201).json(savedBook);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// --- ROUTE 2: Get All Books (with Search) ---
// Method: GET /api/books?search=...
router.get('/', async (req, res) => {
    try {
        const { search } = req.query; // Get the search term from the query parameter
        let query = {};

        if (search) {
            // Create a case-insensitive regex search for title or author
            query = {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { author: { $regex: search, $options: 'i' } }
                ]
            };
        }

        // Find all books that match the query
        const books = await Book.find(query).sort({ createdAt: -1 }); // Sort by newest first

        res.json(books);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;