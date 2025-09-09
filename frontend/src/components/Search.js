// File: src/components/Search.js

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa'; // Import an icon for the clear button
import './Search.css'; // We will use the same CSS file

const Search = () => {
    // --- STATE MANAGEMENT ---
    const [allBooks, setAllBooks] = useState([]); // Stores the original, complete list of books
    const [filteredBooks, setFilteredBooks] = useState([]); // Stores the books to be displayed
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true); // Start in loading state
    const [error, setError] = useState('');

    // --- DATA FETCHING ---
    // This effect runs only once when the component is first mounted
    useEffect(() => {
        const fetchAllBooks = async () => {
            setError('');
            try {
                const url = `${process.env.REACT_APP_API_URL}/api/books`;
                const response = await axios.get(url);
                setAllBooks(response.data); // Save the master list
                setFilteredBooks(response.data); // Set the initial list to display
            } catch (err) {
                setError('Could not fetch books. The server might be down.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllBooks();
    }, []); // The empty array [] means this effect never runs again

    // --- INSTANT SEARCH LOGIC WITH DEBOUNCING ---
    // This effect runs every time the 'searchQuery' changes
    useEffect(() => {
        // This is a common technique to prevent making too many requests while typing.
        // We wait 300ms after the user stops typing before filtering.
        const debounceTimer = setTimeout(() => {
            if (searchQuery === '') {
                // If the search bar is empty, show all books
                setFilteredBooks(allBooks);
            } else {
                // Otherwise, filter the master list of books locally
                const lowercasedQuery = searchQuery.toLowerCase();
                const results = allBooks.filter(book => 
                    book.title.toLowerCase().includes(lowercasedQuery) ||
                    book.author.toLowerCase().includes(lowercasedQuery)
                );
                setFilteredBooks(results);
            }
        }, 300); // 300 millisecond delay

        // This is a cleanup function. It clears the timer if the user types again.
        return () => clearTimeout(debounceTimer);

    }, [searchQuery, allBooks]); // Re-run this effect if the query or the master book list changes

    const clearSearch = () => {
        setSearchQuery('');
    };

    // --- RENDER LOGIC ---
    return (
        <div className="search-container">
            <h1>Search for Books</h1>
            <div className="search-form">
                <div className="search-input-wrapper">
                    <input 
                        type="text"
                        className="search-bar"
                        placeholder="Search instantly by title or author..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button onClick={clearSearch} className="clear-search-btn">
                            <FaTimes />
                        </button>
                    )}
                </div>
            </div>

            {isLoading && <p>Loading library...</p>}
            {error && <p className="error-message">{error}</p>}

            <div className="book-results">
                {!isLoading && filteredBooks.length > 0 && (
                    filteredBooks.map((book) => (
                        <div key={book.bookId} className="book-card">
                            <img src={book.coverImage} alt={`${book.title} cover`} className="book-cover" />
                            <div className="book-info">
                                <h3 className="book-title">{book.title}</h3>
                                <p className="book-author">by {book.author}</p>
                                <p className="book-description">{book.description}</p>
                                <div className="book-meta">
                                    <span className="book-id">ID: {book.bookId}</span>
                                    <span className={book.isAvailable ? 'status-available' : 'status-borrowed'}>
                                        {book.isAvailable ? 'Available' : 'Borrowed'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
                
                {!isLoading && !error && filteredBooks.length === 0 && (
                    <p>No books found. Try a different search term or add books in the admin panel.</p>
                )}
            </div>
        </div>
    );
};

export default Search;