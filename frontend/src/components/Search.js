// File: src/components/Search.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';
import './Search.css';

// --- CHANGE 1: Accept the 'onBookSelect' function as a prop ---
const Search = ({ onBookSelect }) => {
    const [allBooks, setAllBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAllBooks = async () => {
            setError('');
            try {
                const url = `${process.env.REACT_APP_API_URL}/api/books`;
                const response = await axios.get(url);
                setAllBooks(response.data);
                setFilteredBooks(response.data);
            } catch (err) {
                setError('Could not fetch books. The server might be down.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllBooks();
    }, []);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (searchQuery === '') {
                setFilteredBooks(allBooks);
            } else {
                const lowercasedQuery = searchQuery.toLowerCase();
                const results = allBooks.filter(book => 
                    book.title.toLowerCase().includes(lowercasedQuery) ||
                    book.author.toLowerCase().includes(lowercasedQuery)
                );
                setFilteredBooks(results);
            }
        }, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery, allBooks]);

    const clearSearch = () => {
        setSearchQuery('');
    };

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
                        // --- CHANGE 2: The entire card is now wrapped in a clickable div ---
                        // When this div is clicked, it calls the onBookSelect function
                        // and passes the specific 'book' object up to App.js.
                        <div key={book.bookId} onClick={() => onBookSelect(book)} className="book-card-clickable">
                            <div className="book-card">
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