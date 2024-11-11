import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';



function CategoryGrid({ user }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [types, setTypes] = useState([]);
    const [loadingTypes, setLoadingTypes] = useState(true);
    const [errorTypes, setErrorTypes] = useState(null);
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token'); // Supposons que vous stockez le jeton dans le local storage


        axios.get('/api/categories')
            .then(response => {
                setCategories(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
                setError('An error occurred while fetching categories.');
                setLoading(false);
            });

        axios.get('/api/types')
            .then(response => {
                setTypes(response.data);
                setLoadingTypes(false);
            })
            .catch(error => {
                console.error('Error fetching types:', error);
                setErrorTypes('An error occurred while fetching types.');
                setLoadingTypes(false);
            });

    }, []);

    const handleTypeChange = (event) => {
        const typeId = event.target.value;
        if (typeId) {
            navigate(`/type/${typeId}`);
        }
    };


    if (loading) return <p>Loading categories...</p>;
    if (error) return <p>{error}</p>;
    if (loadingTypes) return <p>Loading types...</p>;
    if (errorTypes) return <p>{errorTypes}</p>;

    return (
        <div>

            {/* Affiche les boutons uniquement si l'utilisateur est administrateur */}
            {user?.roles.includes('ROLE_ADMIN') && (
                <>
                    <Link to="/create-category" className="btn btn">Add Category</Link>
                </>
            )}
            <div className="row">
                {categories.map(category => (
                    <div className="col-md-6 mb-4" key={category.id}>
                        <div className="card h-100">
                            <Link
                                to={{
                                    pathname: `/category/${category.id}`,
                                    state: { name: category.name } // Passer le nom de la catégorie
                                }}
                            >
                                <img
                                    src={category.picture}
                                    className="card-img-top"
                                    alt={category.name}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{category.name}</h5>
                                </div>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
            <div className="types-list mt-5">
                <h4>Espèces</h4>
                <select onChange={handleTypeChange} className="form-select">
                    <option value="">Select a type</option>
                    {types.map(type => (
                        <option key={type.id} value={type.id}>
                            {type.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default CategoryGrid;


