import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UpdateCategoryForm({ user }) {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [category, setCategory] = useState({ name: '', description: '', picture: '' });
    const [speciesList, setSpeciesList] = useState([]);
    const [types, setTypes] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`/api/categories/${id}`)
            .then(response => setCategory(response.data))
            .catch(error => console.error('Erreur lors de la récupération de la catégorie:', error));

        axios.get(`/api/categories/${id}/species`)
            .then(response => setSpeciesList(response.data.data))
            .catch(error => console.error('Erreur lors de la récupération des espèces:', error));

        axios.get('/api/types')
            .then(response => setTypes(response.data))
            .catch(error => console.error('Erreur lors de la récupération des types:', error));
    }, [id]);

    const handleCategoryChange = (e) => {
        const { name, value } = e.target;
        setCategory(prevCategory => ({ ...prevCategory, [name]: value }));
    };

    const handleSpeciesChange = (index, e) => {
        const { name, value } = e.target;
        setSpeciesList(prevSpeciesList => {
            const newSpeciesList = [...prevSpeciesList];
            newSpeciesList[index] = { ...newSpeciesList[index], [name]: value };
            return newSpeciesList;
        });
    };

    const handleTypeChange = (index, typeId) => {
        setSpeciesList(prevSpeciesList => {
            const newSpeciesList = [...prevSpeciesList];
            newSpeciesList[index] = { ...newSpeciesList[index], type_id: typeId };
            return newSpeciesList;
        });
    };

    const handleAddSpecies = () => {
        setSpeciesList(prevSpeciesList => [
            ...prevSpeciesList,
            { name: '', description: '', picture: '', type_id: '', date: new Date().toISOString() }
        ]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            category: { ...category },
            species: speciesList.map(species => ({
                id: species.id,
                name: species.name,
                description: species.description,
                picture: species.picture,
                type_id: species.type_id,
                date: species.date || new Date().toISOString(), // Définit une date si elle est absente
            })),
        };
    
        try {
            await axios.put(`/api/categories-with-species/${id}`, payload);
            navigate(`/category/${id}`);
        } catch (error) {
            setError("Erreur lors de la mise à jour de la catégorie et des espèces.");
            console.error("Erreur lors de la mise à jour de la catégorie et des espèces:", error);
        }
    };

     // Affiche le formulaire uniquement si l'utilisateur est administrateur
     if (!user?.roles.includes('ROLE_ADMIN')) {
        return <p>Accès refusé : vous n'avez pas les autorisations nécessaires pour mettre à jour cette catégorie.</p>;
    }

    return (
        <div className="form-container">
            <h2 className="form-title">Update Category and Species</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="styled-form">
                <h3 className="form-section-title">Category</h3>
                <div className="form-group">
                    <label className="form-label">Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={category.name}
                        onChange={handleCategoryChange}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Description:</label>
                    <textarea
                        name="description"
                        value={category.description}
                        onChange={handleCategoryChange}
                        className="form-textarea"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Picture URL:</label>
                    <input
                        type="text"
                        name="picture"
                        value={category.picture}
                        onChange={handleCategoryChange}
                        className="form-input"
                    />
                </div>

                <h3 className="form-section-title">Species</h3>
                {speciesList.map((species, index) => (
                    <div key={species.id || `new-${index}`} className="species-section">
                        <div className="form-group">
                            <label className="form-label">Species Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={species.name}
                                onChange={(e) => handleSpeciesChange(index, e)}
                                required
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description:</label>
                            <textarea
                                name="description"
                                value={species.description}
                                onChange={(e) => handleSpeciesChange(index, e)}
                                className="form-textarea"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Picture URL:</label>
                            <input
                                type="text"
                                name="picture"
                                value={species.picture}
                                onChange={(e) => handleSpeciesChange(index, e)}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Type:</label>
                            <select
                                value={species.type_id}
                                onChange={(e) => handleTypeChange(index, e.target.value)}
                                className="form-select"
                            >
                                <option value="">Select Type</option>
                                {types.map(type => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                ))}

                <div className="button-group">
                    <button
                        type="button"
                        onClick={handleAddSpecies}
                        className="add-button"
                    >
                        Add New Species
                    </button>
                    <button
                        type="submit"
                        className="submit-button"
                    >
                        Update Category and Species
                    </button>
                </div>
            </form>
        </div>
    );

}

export default UpdateCategoryForm;

