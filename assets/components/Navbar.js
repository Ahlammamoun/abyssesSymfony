import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { useState } from 'react';

function Navbar({ user, setUser }) {

    const [theme, setTheme] = useState('dark');
    
    const toggleTheme = () => {
        fetch('http://127.0.0.1:8000/theme/toggle', { method: 'POST' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            setTheme(data.theme);
            console.log(data.theme);
            document.body.className = data.theme;
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    };



    console.log('User in Navbar:', user); // Ajoutez ceci pour vérifier l'état de user
    const navigate = useNavigate();

    const handleLogout = () => {
        axios.post('/api/logout')
            .then(() => {
                setUser(null); // Réinitialiser l'utilisateur
                navigate('/'); // Rediriger vers la page d'accueil
            })
            .catch(error => {
                console.error('There was an error logging out!', error);
            });
    };

    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container">
                <a className="navbar-brand logo" href="/abysses"></a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ml-auto">
                        {user && (
                            <li className="nav-item">
                                <p className="nav-link">
                                    Bonjour {user.username} ({user.roles})
                                </p>
                            </li>
                        )}
                        <li className="nav-item">
                            <Link className="nav-link" to="/abysses">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/category">Categories</Link>
                        </li>
                        {user ? (
                            <li className="nav-item">
                                <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
                            </li>
                        ) : (
                            <li className="nav-item">
                                <Link className="nav-link" to="/profile">Login</Link>
                            </li>
                        )}
                        <li className="nav-item">
                            <button className="btn btn-outline" onClick={toggleTheme}>
                                Toggle Theme
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
