/*import React, { useState } from 'react';
import axios from 'axios'; // We will use this later
import './Auth.css';

const Login = ({ onSwitchToRegister, onLoginSuccess }) => {
    // 'identifier' can be a username or an email
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!identifier || !password) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            // TODO: This is where we will make the API call to our backend
            console.log('Logging in with:', { identifier, password });
            // const response = await axios.post('/api/auth/login', { identifier, password });
            // const token = response.data.token;
            
            // For now, we'll simulate a successful login and pass up a fake token
            const fakeToken = 'this_is_a_fake_jwt_token';
            onLoginSuccess(fakeToken);

        } catch (err) {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="auth-box">
            <form onSubmit={handleLoginSubmit}>
                <h2>Login to Your Account</h2>
                <div className="input-group">
                    <label>Username or Email</label>
                    <input type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit" className="auth-button">Login</button>
                <p className="switch-form-text">
                    Don't have an account? <span onClick={onSwitchToRegister}>Register here</span>
                </p>
            </form>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default Login;*/