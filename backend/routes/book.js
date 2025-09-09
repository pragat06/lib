// File: backend/routes/books.js

const express = require('express');
const Book = require('../models/b0ook');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// --- ROUTE 1: Add a New Book (Admin Only) ---
// This route is already working, no changes needed.
router.post('/', authMiddleware, async (req, res) => {
    // ... your existing code for adding a book
    const { title, author, description, coverImage } = req.body;
    if (!title || !author) { return res.status(400).json({ msg: 'Please provide a title and author.' });}
    try {
        const newBook = new Book({ title, author, description, coverImage });
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// --- CORRECTED ROUTE 2: Get All Books (with Search) ---
// This version is more robust and handles the search logic cleanly.
router.get('/', async (req, res) => {
    try {
        // Get the 'search' query parameter from the URL, if it exists.
        const { search } = req.query;
        
        let query = {}; // Start with an empty query to find all books

        // If a search term was provided, build a regex query
        if (search) {
            // This creates a "case-insensitive" search pattern
            const searchRegex = new RegExp(search, 'i');

            // This will search for the pattern in both the 'title' and 'author' fields
            query = {
                $or: [
                    { title: searchRegex },
                    { author: searchRegex }
                ]
            };
        }

        // Execute the query against the 'books' collection and sort by newest first
        const books = await Book.find(query).sort({ createdAt: -1 });

        // Send the found books back as a JSON response
        res.json(books);

    } catch (err) {
        // If anything goes wrong with the database query, send a server error.
        console.error("Error fetching books:", err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;