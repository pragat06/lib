// File: src/App.js

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import Sidebar from './components/sidebar'; // Import the Sidebar component
import Search from './components/Search';
import Borrow from './components/Borrow'; 
import { FaBars } from 'react-icons/fa';      // Import the hamburger menu icon
import './App.css';

// --- Placeholder Components for Different Views ---
// In a larger application, these would be in their own files.
const DashboardContent = ({ username }) => (
    <div>
        <h1>Welcome, {username}!</h1>
        <p>Use the menu on the left to navigate the library application.</p>
    </div>
);
//const SearchContent = () => <div><h1>Search for Books</h1><p>The book search interface will be built here.</p></div>;
const BorrowContent = () => <div><h1>Borrow a Book</h1><p>The book borrowing interface will be built here.</p></div>;
const ReturnContent = () => <div><h1>Return a Book</h1><p>The book returning interface will be built here.</p></div>;


function App() {
    // --- STATE MANAGEMENT ---
    const [view, setView] = useState('login');
    const [token, setToken] = useState(localStorage.getItem('token'));
    
    // Form states
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginIdentifier, setLoginIdentifier] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Feedback and user data states
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

    // State for Sidebar and the active content view
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [activeView, setActiveView] = useState('dashboard');

    // Effect to check for an existing session token on app load
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            // In a real app, you would verify the token with the backend here.
            // For now, we'll just restore the session.
            setToken(storedToken);
            // You would normally fetch user info here, but we'll use placeholder data
            setUserInfo(JSON.parse(localStorage.getItem('userInfo')));
        }
    }, []);

    // --- HANDLER FUNCTIONS ---

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!username || !email || !password) {
            setError('Please fill in all fields.'); return;
        }
        if (!window.ethereum || !window.ethereum.isMetaMask) {
            setError('MetaMask is required for registration.'); return;
        }
        setIsLoading(true);
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            const walletAddress = accounts[0];
            const signer = await provider.getSigner();
            const messageToSign = `I am registering for the DLMS with wallet: ${walletAddress}`;
            const signature = await signer.signMessage(messageToSign);
            const registrationPayload = { username, email, password, walletAddress, signature, message: messageToSign };
            
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register-with-wallet`, registrationPayload);
            
            alert(response.data.msg); // Show success message
            setView('login'); // Switch to login view

        } catch (err) {
            const errorMessage = err.response ? err.response.data.msg : (err.message || 'An error occurred.');
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        if (!loginIdentifier || !loginPassword) {
            setError('Please provide your credentials.');
            setIsLoading(false);
            return;
        }
        try {
            const loginPayload = { identifier: loginIdentifier, password: loginPassword };
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, loginPayload);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('userInfo', JSON.stringify(user)); // Store user info
            setToken(token);
            setUserInfo(user);
        } catch (err) {
            const errorMessage = err.response ? err.response.data.msg : 'Login failed.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        setToken(null);
        setUserInfo(null);
        setView('login');
        setSidebarOpen(false); // Close sidebar on logout
        setLoginIdentifier('');
        setLoginPassword('');
    };

    const truncateAddress = (address) => {
        if (!address) return "";
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    // --- Helper function to render the correct view inside the dashboard ---
     const renderActiveView = () => {
        switch (activeView) {
            case 'search':
                return <Search />; // <-- USE THE REAL SEARCH COMPONENT
            case 'borrow':
                 return <Borrow />;
            case 'return':
                return <ReturnContent />;
            case 'dashboard':
            default:
                return <DashboardContent username={userInfo?.username} />;
        }
    };

    // --- JSX RENDERING LOGIC ---

    if (token) {
        // --- LOGGED-IN VIEW (WITH SIDEBAR) ---
        return (
            <div className="app-container">
                {isSidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)}></div>}
                <Sidebar 
                    isOpen={isSidebarOpen} 
                    onToggle={() => setSidebarOpen(!isSidebarOpen)}
                    onItemClick={(view) => setActiveView(view)}
                />
                <header className="app-header">
                    <div className="header-left">
                        <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
                            <FaBars />
                        </button>
                        <h2>DLMS</h2>
                    </div>
                    <div className="header-user-info">
                        <div className="info-box"><p className="info-label">Email</p><p className="info-value">{userInfo?.email}</p></div>
                        <div className="info-box"><p className="info-label">Wallet</p><p className="info-value">{truncateAddress(userInfo?.walletAddress)}</p></div>
                        <button className="logout-button" onClick={handleLogout}>Logout</button>
                    </div>
                </header>
                <main className={isSidebarOpen ? "main-content shifted" : "main-content"}>
                    {renderActiveView()}
                </main>
            </div>
        );
    }

    // --- LOGGED-OUT VIEW (LOGIN/REGISTER FORMS) ---
    return (
        <div className="auth-container">
            <div className="auth-box">
                {view === 'login' ? (
                    <form onSubmit={handleLoginSubmit}>
                        <h2>Login</h2>
                        {error && <p className="error-message">{error}</p>}
                        <div className="input-group">
                            <label>Username or Email</label>
                            <input type="text" value={loginIdentifier} onChange={(e) => setLoginIdentifier(e.target.value)} disabled={isLoading} />
                        </div>
                        <div className="input-group">
                            <label>Password</label>
                            <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} disabled={isLoading} />
                        </div>
                        <button type="submit" className="auth-button" disabled={isLoading}>
                         {isLoading ? (
                        <div className="loader"></div>
                        ) : (
                        'Login'
                        )}
                        </button>
                        <p className="switch-form-text">
                            Don't have an account? <span onClick={() => { setView('register'); setError(''); }}>Register here</span>
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleRegisterSubmit}>
                        <h2>Create Account</h2>
                        {error && <p className="error-message">{error}</p>}
                        <div className="input-group">
                            <label>Username</label>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} disabled={isLoading} />
                        </div>
                        <div className="input-group">
                            <label>Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
                        </div>
                        <div className="input-group">
                            <label>Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
                        </div>
                        <button type="submit" className="auth-button" disabled={isLoading}>
                            {isLoading ? 'Processing...' : 'Register & Link Wallet'}
                        </button>
                        <p className="switch-form-text">
                            Already have an account? <span onClick={() => { setView('login'); setError(''); }}>Login here</span>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}

export default App;