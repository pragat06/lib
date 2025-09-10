// File: src/components/Borrow.js

import React, { useState, useEffect } from 'react'; // <-- 1. Make sure useEffect is imported
import { ethers } from 'ethers';
import './Borrow.css';

// ... (Your contractAddress and contractABI should be here)
const contractAddress = "YOUR_BSC_TESTNET_ADDRESS";
const contractABI = [ /* ... your ABI ... */ ];

// 2. The component now accepts 'initialBookId' as a prop
const Borrow = ({ initialBookId }) => {
    // 3. The state is initialized with the prop value
    const [bookId, setBookId] = useState(initialBookId || '');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // --- 4. THIS IS THE CRITICAL FIX ---
    // This 'useEffect' hook will run every time the 'initialBookId' prop changes.
    // This ensures that if the user clicks "Borrow Now" from the detail page,
    // this component will update its state with the new ID.
    useEffect(() => {
        if (initialBookId) {
            setBookId(initialBookId);
        }
    }, [initialBookId]);
    // ------------------------------------

    const handleBorrow = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!bookId) {
            setError('Please enter a Book ID.');
            return;
        }
        if (!window.ethereum) {
            setError('MetaMask is required to borrow books.');
            return;
        }

        setIsLoading(true);
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const network = await provider.getNetwork();
            if (network.chainId !== 97n) {
                 setError('Please switch MetaMask to the BNB Smart Chain Testnet.');
                 setIsLoading(false);
                 return;
            }
            
            const libraryContract = new ethers.Contract(contractAddress, contractABI, signer);
            const borrowFee = ethers.parseEther("0.01"); 

            const tx = await libraryContract.borrowBook(bookId, { value: borrowFee });
            await tx.wait();
            setMessage(`Successfully borrowed Book ID: ${bookId}. Transaction hash: ${tx.hash}`);

        } catch (err) {
            const errorMessage = err.reason || err.data?.message || err.message || "An unknown error occurred.";
            setError(`Failed to borrow book. Reason: ${errorMessage}`);
            console.error(err);
        } finally {
            setIsLoading(false);
            // We don't clear the bookId here anymore, in case the user wants to see it
        }
    };

    return (
        <div className="borrow-container">
            <h1>Borrow a Book (Fee: 0.01 tBNB)</h1>
            <p>Enter the 4-digit ID of the book you wish to borrow or click a book from the Search page.</p>
            <form className="borrow-form" onSubmit={handleBorrow}>
                <input 
                    type="number"
                    className="book-id-input"
                    placeholder="Enter Book ID (e.g., 1001)"
                    value={bookId} // The input's value is controlled by our state
                    onChange={(e) => setBookId(e.target.value)}
                />
                <button type="submit" className="borrow-button" disabled={isLoading}>
                    {isLoading ? <div className="loader-small"></div> : 'Borrow Book'}
                </button>
            </form>

            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default Borrow;