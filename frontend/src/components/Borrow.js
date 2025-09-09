// File: src/components/Borrow.js

import React, { useState } from 'react';
import { ethers } from 'ethers';
import './Borrow.css';
import React, { useState, useEffect } from 'react'; 

// --- 1. PASTE YOUR DEPLOYED BSC TESTNET ADDRESS HERE ---
// This is the new address you got after re-deploying the contract that accepts payments.
const contractAddress = "0xC3D065d1cb3C2ee7F578E6B22F0e0BAFeb03CeED"; 

// --- 2. CORRECTED ABI ---
// The extra pair of [] brackets has been removed. This is now a valid ABI.
const contractABI = [
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "uint256", "name": "loanId", "type": "uint256" },
        { "indexed": true, "internalType": "uint256", "name": "bookId", "type": "uint256" },
        { "indexed": true, "internalType": "address", "name": "borrower", "type": "address" },
        { "indexed": false, "internalType": "uint256", "name": "dueDate", "type": "uint256" }
      ],
      "name": "BookBorrowed", "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "uint256", "name": "bookId", "type": "uint256" },
        { "indexed": true, "internalType": "address", "name": "borrower", "type": "address" }
      ],
      "name": "BookReturned", "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" },
        { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }
      ],
      "name": "OwnershipTransferred", "type": "event"
    },
    {
      "inputs": [], "name": "BORROW_FEE", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view", "type": "function"
    },
    {
      "inputs": [{ "internalType": "uint256", "name": "bookId", "type": "uint256" }],
      "name": "borrowBook", "outputs": [], "stateMutability": "payable", "type": "function"
    },
    {
      "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "name": "borrowedBy", "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view", "type": "function"
    },
    {
      "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view", "type": "function"
    },
    { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    {
      "inputs": [{ "internalType": "uint256", "name": "bookId", "type": "uint256" }],
      "name": "returnBook", "outputs": [], "stateMutability": "nonpayable", "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }],
      "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function"
    },
    { "inputs": [], "name": "withdrawFees", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
];

const Borrow = () => {
    const [bookId, setBookId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

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

            if (network.chainId !== 97n) { // 97 is the Chain ID for BSC Testnet
                 setError('Please switch MetaMask to the BNB Smart Chain Testnet.');
                 setIsLoading(false);
                 return;
            }
            
            // This is the more robust way to create a contract instance that avoids ENS errors.
            const libraryContract = new ethers.Contract(contractAddress, contractABI, signer);

            const borrowFee = ethers.parseEther("0.01"); 

            console.log(`Attempting to borrow book ID: ${bookId} for 0.01 tBNB`);
            const tx = await libraryContract.borrowBook(bookId, {
                value: borrowFee 
            });

            console.log('Transaction sent, waiting for it to be mined...');
            await tx.wait();

            setMessage(`Successfully borrowed Book ID: ${bookId}. Transaction hash: ${tx.hash}`);

        } catch (err) {
            const errorMessage = err.reason || err.data?.message || err.message || "An unknown error occurred.";
            setError(`Failed to borrow book. Reason: ${errorMessage}`);
            console.error(err);
        } finally {
            setIsLoading(false);
            setBookId('');
        }
    };

    return (
        <div className="borrow-container">
            <h1>Borrow a Book (Fee: 0.01 tBNB)</h1>
            <p>Enter the 4-digit ID of the book you wish to borrow. You can find the ID on the "Search Books" page.</p>
            <form className="borrow-form" onSubmit={handleBorrow}>
                <input 
                    type="number"
                    className="book-id-input"
                    placeholder="Enter Book ID (e.g., 1001)"
                    value={bookId}
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