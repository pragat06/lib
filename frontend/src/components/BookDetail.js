
import React from 'react';
import './BookDetail.css';

const BookDetail = ({ book, onBorrowClick, onBack }) => {
    if (!book) return null;

    return (
        <div className="book-detail-container">
            <button onClick={onBack} className="back-button">← Back to Search</button>
            <div className="book-detail-card">
                <img src={book.coverImage} alt={`${book.title} cover`} className="book-detail-cover" />
                <div className="book-detail-info">
                    <h1 className="book-detail-title">{book.title}</h1>
                    <h3 className="book-detail-author">by {book.author}</h3>
                    <p className="book-detail-description">{book.description}</p>
                    
                    {/* --- ADD THIS LINE TO DISPLAY THE BOOK ID --- */}
                    <p className="book-detail-id">Book ID: <strong>{book.bookId}</strong></p>
                    {/* ------------------------------------------- */}

                    {book.isAvailable ? (
                        <button onClick={() => onBorrowClick(book.bookId)} className="borrow-now-btn">
                            Borrow Now (0.01 tBNB)
                        </button>
                    ) : (
                        <div className="status-unavailable">Unavailable</div>
                    )}
                </div>
            </div>

            <div className="reviews-section">
                <h2>Reviews</h2>
                <p>No reviews for this book yet.</p>
            </div>
        </div>
    );
};

export default BookDetail;