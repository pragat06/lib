// File: src/components/Search.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Search.css'; // We will create this CSS file

const Search = () => {
    const [books, setBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Function to fetch all books when the component first loads
    const fetchAllBooks = async () => {
        setIsLoading(true);
        setError('');
        try {
            // Make a GET request to our backend's book endpoint
            const response = await axios.get('http://localhost:5001/api/books');
            setBooks(response.data);
        } catch (err) {
            setError('Could not fetch books. Please try again later.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Use useEffect to call fetchAllBooks once when the component mounts
    useEffect(() => {
        fetchAllBooks();
    }, []);

    // Function to handle the search form submission
    const handleSearch = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            // Make a GET request with the search query as a URL parameter
            const response = await axios.get(`http://localhost:5001/api/books?search=${searchQuery}`);
            setBooks(response.data);
        } catch (err) {
            setError('Search failed. Please try again later.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="search-container">
            <h1>Search for Books</h1>
            <form className="search-form" onSubmit={handleSearch}>
                <input 
                    type="text"
                    className="search-bar"
                    placeholder="Search by title or author..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-button">Search</button>
            </form>

            {isLoading && <p>Loading books...</p>}
            {error && <p className="error-message">{error}</p>}

            <div className="book-results">
                {books.length > 0 ? (
                    books.map((book) => (
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
                ) : (
                    !isLoading && <p>No books found.</p>
                )}
            </div>
        </div>
    );
};

export default Search;