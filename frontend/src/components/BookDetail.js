// File: src/components/BookDetail.js

import React from 'react';
import './BookDetail.css'; // We will create this

const BookDetail = ({ book, onBorrowClick }) => {
    // If no book is selected, don't render anything
    if (!book) return null;

    // This function will be called when the borrow button is clicked
    const handleBorrow = () => {
        // We pass the book's ID up to the App component
        onBorrowClick(book.bookId);
    };

    return (
        <div className="book-detail-container">
            <div className="book-detail-card">
                <img src={book.coverImage} alt={`${book.title} cover`} className="book-detail-cover" />
                <div className="book-detail-info">
                    <h1 className="book-detail-title">{book.title}</h1>
                    <h3 className="book-detail-author">by {book.author}</h3>
                    <p className="book-detail-description">{book.description}</p>
                    
                    {/* --- Borrow Button Logic --- */}
                    {book.isAvailable ? (
                        <button onClick={handleBorrow} className="borrow-now-btn">
                            Borrow Now
                        </button>
                    ) : (
                        <div className="status-unavailable">
                            Unavailable
                        </div>
                    )}
                </div>
            </div>

            <div className="reviews-section">
                <h2>Reviews</h2>
                {/* We can add a simple message for now. This can be built out later. */}
                <p>No reviews yet for this book.</p>
            </div>
        </div>
    );
};

export default BookDetail;