import React from 'react';
import { FaSearch, FaBook, FaUndo, FaList, FaTimes, FaUserShield } from 'react-icons/fa';
import './sidebar.css';

const Sidebar = ({ isOpen, onToggle, onItemClick, userInfo }) => {
    
    const handleClick = (view) => {
        onItemClick(view);
        onToggle();
    };

    // --- THIS IS THE ADMIN CHECK ---
    const isAdmin = userInfo?.email === process.env.REACT_APP_ADMIN_EMAIL;

    return (
        <div className={isOpen ? 'sidebar open' : 'sidebar'}>
            <div className="sidebar-header">
                <h3>Menu</h3>
                <button onClick={onToggle} className="close-btn"><FaTimes /></button>
            </div>
            <ul className="nav-list">
                <li onClick={() => handleClick('dashboard')}><FaList className="nav-icon" /> Dashboard</li>
                <li onClick={() => handleClick('search')}><FaSearch className="nav-icon" /> Search Books</li>
                <li onClick={() => handleClick('borrow')}><FaBook className="nav-icon" /> Borrow a Book</li>
                <li onClick={() => handleClick('return')}><FaUndo className="nav-icon" /> Return a Book</li>
                
                {/* This link only appears if the check above is true */}
                {isAdmin && (
                    <li onClick={() => handleClick('admin')}>
                        <FaUserShield className="nav-icon" /> Admin Panel
                    </li>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;