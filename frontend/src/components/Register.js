/*// File: src/components/Register.js

import React, { useState } from 'react';
import axios from 'axios'; // Make sure axios is imported
import './Auth.css';

const Register = ({ onSwitchToLogin }) => {
    const [step, setStep] = useState(1);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // --- Step 1: Handle Initial Registration ---
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!username || !email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            // --- THIS IS THE REAL API CALL ---
            // It sends a POST request to your running backend server.
            const response = await axios.post('http://localhost:5001/api/auth/register', {
                username,
                email,
                password,
            });
            // ------------------------------------
            
            // Get the success message from the backend response
            setMessage(response.data.msg);
            setStep(2); // Move to the OTP verification step

        } catch (err) {
            // Get the error message from the backend if it sends one
            const errorMessage = err.response ? err.response.data.msg : 'Registration failed. Please try again.';
            setError(errorMessage);
        }
    };

    // --- Step 2: Handle OTP Verification (We will build this backend part next) ---
    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!otp) {
            setError('Please enter the OTP.');
            return;
        }

        try {
            // TODO: This is where we will make the API call to verify the OTP
            console.log('Verifying OTP:', { email, otp });
            // const response = await axios.post('http://localhost:5001/api/auth/verify-otp', { email, otp });

            // For now, we'll simulate a successful verification
            alert('Email verified successfully! You can now log in.');
            onSwitchToLogin();

        } catch (err) {
            setError('Invalid or expired OTP. Please try again.');
        }
    };

    // ... (The rest of the component's JSX remains the same)
    return (
        <div className="auth-box">
            {step === 1 && (
                <form onSubmit={handleRegisterSubmit}>
                    <h2>Create Account</h2>
                    <div className="input-group">
                        <label>Username</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="auth-button">Register</button>
                    <p className="switch-form-text">
                        Already have an account? <span onClick={onSwitchToLogin}>Login here</span>
                    </p>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handleOtpSubmit}>
                    <h2>Verify Your Email</h2>
                    <p>Enter the 6-digit OTP sent to {email}</p>
                    <div className="input-group">
                        <label>OTP</label>
                        <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength="6" />
                    </div>
                    <button type="submit" className="auth-button">Verify</button>
                </form>
            )}
            
            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}
        </div>
    );
};

export default Register;*/