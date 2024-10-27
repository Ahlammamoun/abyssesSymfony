import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserProfile({ setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Email and password are required');
            return;
        }

        axios.post('/api/login', { email, password })
            .then(response => {
                console.log('Login successful:', response.data); 
                setUser(response.data); // Mettre à jour l'état utilisateur
                setError(null);
                navigate('/abysses'); // Rediriger vers la page d'accueil
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    setError(error.response.data.error);
                } else {
                    setError('An unexpected error occurred');
                }
            });
    };

    return (
        <div className="user-profile-container">
            <form onSubmit={handleSubmit} className="user-profile-form">
                <h2 className="form-title">Login</h2>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                {error && <div className="form-error">{error}</div>}
                <button type="submit" className="form-button">Login</button>
            </form>
        </div>
    );
}

export default UserProfile;
