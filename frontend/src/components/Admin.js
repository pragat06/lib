// File: src/components/Admin.js

import React, { useState } from 'react';
import axios from 'axios';
import './Admin.css'; // <-- 1. IMPORT the new CSS file

const Admin = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAddBook = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsLoading(true);

        const newBook = { title, author, description, coverImage };

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                }
            };
            
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/books`, newBook, config);
            
            setMessage(`Successfully added book: "${response.data.title}" (ID: ${response.data.bookId})`);
            setTitle(''); setAuthor(''); setDescription(''); setCoverImage('');

        } catch (err) {
            const errorMessage = err.response ? err.response.data.msg : 'Failed to add book.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // 2. USE the new container class
        <div className="admin-container"> 
            <h1>Admin Panel - Add New Book</h1>
            <form className="book-form" onSubmit={handleAddBook}>
                {/* 3. The inputs are now stacked vertically, which is better for forms */}
                <input type="text" placeholder="Book Title" value={title} onChange={e => setTitle(e.target.value)} required />
                <input type="text" placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} required />
                <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
                <input type="text" placeholder="Cover Image URL (optional)" value={coverImage} onChange={e => setCoverImage(e.target.value)} />
                <button type="submit" className="search-button" disabled={isLoading}>
                    {isLoading ? 'Adding...' : 'Add Book'}
                </button>
            </form>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default Admin;