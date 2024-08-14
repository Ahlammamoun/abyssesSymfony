import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
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
            document.body.className = data.theme;
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    };

    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container">
                <a className="navbar-brand" href="/">Abysses</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/category">Categories</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/profile">Se connecter</Link>
                        </li>
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
