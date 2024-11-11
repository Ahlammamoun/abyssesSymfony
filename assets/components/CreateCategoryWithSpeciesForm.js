import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function CreateCategoryWithSpeciesForm() {
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [categoryPicture, setCategoryPicture] = useState('');
    const [speciesName, setSpeciesName] = useState('');
    const [speciesDescription, setSpeciesDescription] = useState('');
    const [speciesPicture, setSpeciesPicture] = useState('');
    const [typeId, setTypeId] = useState(''); // État pour stocker l'ID du type
    const [types, setTypes] = useState([]); // Stockage des types
    const navigate = useNavigate();

    // Récupération des types pour le champ de sélection
    useEffect(() => {
        axios.get('/api/types')
            .then(response => {
                console.log('Types fetched:', response.data); // Vérifiez les types ici
                setTypes(response.data);
            })
            .catch(error => console.error('Erreur lors de la récupération des types:', error));
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const payload = {
            category: {
                name: categoryName,
                description: categoryDescription,
                picture: categoryPicture,
            },
            species: {
                name: speciesName,
                description: speciesDescription,
                picture: speciesPicture,
                type_id: typeId, // Vérification de l'ID du type
            },
        };
        console.log('Payload envoyé:', payload); // Vérification du payload
        
        try {
            const response = await axios.post('/api/categories-with-species', payload);
            if (response.status === 201) { // Si la création est réussie
                console.log('Catégorie et espèce créées avec succès');
                navigate('/abysses'); // Redirection immédiate
            
            }
        } catch (error) {
            console.error('Erreur lors de la création de la catégorie et de l\'espèce:', error.response ? error.response.data : error.message);
        }
    };
    

    return (
        <div className="form-container">
            <h2 className="form-title">Create Category</h2>
            <form onSubmit={handleSubmit} className="styled-form">
                <div className="form-group">
                    <label className="form-label">Category Name:</label>
                    <input
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Category Description:</label>
                    <input
                        value={categoryDescription}
                        onChange={(e) => setCategoryDescription(e.target.value)}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Category Picture URL:</label>
                    <input
                        value={categoryPicture}
                        onChange={(e) => setCategoryPicture(e.target.value)}
                        className="form-input"
                    />
                </div>

                <h2 className="form-section-title">Create Species</h2>
                <div className="form-group">
                    <label className="form-label">Species Name:</label>
                    <input
                        value={speciesName}
                        onChange={(e) => setSpeciesName(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Species Description:</label>
                    <input
                        value={speciesDescription}
                        onChange={(e) => setSpeciesDescription(e.target.value)}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Species Picture URL:</label>
                    <input
                        value={speciesPicture}
                        onChange={(e) => setSpeciesPicture(e.target.value)}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Species Type:</label>
                    <select
                        value={typeId}
                        onChange={(e) => setTypeId(e.target.value)}
                        required
                        className="form-select"
                    >
                        <option value="">Select Type</option>
                        {types.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="submit-button">
                    Create Category and Species
                </button>
            </form>
        </div>
    );
}

export default CreateCategoryWithSpeciesForm;
