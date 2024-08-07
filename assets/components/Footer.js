import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';

function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <span>&copy; 2024 Abysses</span>
                <div className="social-links">
                    <a href="https://www.facebook.com/yourpage" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faFacebook} /> Facebook
                    </a>
                    <a href="https://www.twitter.com/yourprofile" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faTwitter} /> Twitter
                    </a>
                    <a href="https://www.instagram.com/yourprofile" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faInstagram} /> Instagram
                    </a>
                    <a href="https://www.linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faLinkedin} /> LinkedIn
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;



