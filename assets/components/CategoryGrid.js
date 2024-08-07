import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function CategoryGrid() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [types, setTypes] = useState([]);
    const [loadingTypes, setLoadingTypes] = useState(true);
    const [errorTypes, setErrorTypes] = useState(null);

    useEffect(() => {
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

    if (loading) return <p>Loading...</p>;

    if (error) return <p>{error}</p>;

    return (
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
            <div className="types-list mt-5">
                <h2>Types</h2>
                <div className="list-group">
                    {types.map(type => (
                        <Link to={`/type/${type.id}`} key={type.id} className="list-group-item list-group-item-action">
                            {type.name}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );

}

export default CategoryGrid;


