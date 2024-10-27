// src/components/FormAvis.js

import React, { useState } from 'react';
import axios from 'axios';

function AvisForm({ speciesId, onAvisSubmitted }) {
    const [author, setAuthor] = useState('');
    const [email, setEmail] = useState('');
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(0);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (author && email && content && rating) {
            axios.post(`/api/species/${speciesId}/avis`, {
                author,
                email,
                content,
                rating,
            })
            .then((response) => {
                setSuccess("Votre avis a été soumis avec succès.");
                setAuthor('');
                setEmail('');
                setContent('');
                setRating(0);
                onAvisSubmitted(); // Pour rafraîchir la liste des avis après soumission
            })
            .catch((error) => {
                console.error("Erreur lors de l'envoi de l'avis :", error);
                setError("Une erreur est survenue lors de l'envoi de votre avis. Veuillez réessayer.");
            });
        } else {
            setError("Veuillez remplir tous les champs.");
        }
    };


    console.log('user in AvisForm');
    return (
        <div className="avis-form-container">
            <button 
                className="btn btn-primary"
                onClick={() => setIsFormVisible(!isFormVisible)}
            >
                {isFormVisible ? 'Fermer le formulaire' : 'Laissez un avis'}
            </button>

            {isFormVisible && (
                <div className="avis-form">
                    <h3>Laissez un avis</h3>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {success && <p style={{ color: 'green' }}>{success}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                placeholder="Votre nom"
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Votre email"
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Laissez un commentaire..."
                                className="form-control"
                                rows="4"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Note :</label>
                            {[1, 2, 3, 4, 5].map(value => (
                                <label key={value} className="rating-label">
                                    <input
                                        type="radio"
                                        value={value}
                                        checked={rating === value}
                                        onChange={() => setRating(value)}
                                    />
                                    {value} ★
                                </label>
                            ))}
                        </div>
                        <button type="submit" className="btn btn-success">
                            Envoyer
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default AvisForm;
