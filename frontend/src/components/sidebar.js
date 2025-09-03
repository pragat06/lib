// File: src/components/Sidebar.js

import React from 'react';
import { FaSearch, FaBook, FaUndo, FaList, FaTimes } from 'react-icons/fa';
import './sidebar.css';

const Sidebar = ({ isOpen, onToggle, onItemClick }) => {
    
    // Helper function to handle clicks
    const handleClick = (view) => {
        onItemClick(view); // Tell App.js which view to show
        onToggle();        // Close the sidebar
    };

    return (
        <div className={isOpen ? 'sidebar open' : 'sidebar'}>
            <div className="sidebar-header">
                <h3>Menu</h3>
                <button onClick={onToggle} className="close-btn">
                    <FaTimes />
                </button>
            </div>
            <ul className="nav-list">
                <li onClick={() => handleClick('dashboard')}>
                    <FaList className="nav-icon" /> Dashboard
                </li>
                <li onClick={() => handleClick('search')}>
                    <FaSearch className="nav-icon" /> Search Books
                </li>
                <li onClick={() => handleClick('borrow')}>
                    <FaBook className="nav-icon" /> Borrow a Book
                </li>
                <li onClick={() => handleClick('return')}>
                    <FaUndo className="nav-icon" /> Return a Book
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;