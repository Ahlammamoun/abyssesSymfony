import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';


function SpeciesList() {
    const { id } = useParams();
    const location = useLocation();
    const [species, setSpecies] = useState([]);
    const [category, setCategory] = useState({ name: 'Unknown Category', picture: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        if (location.state && location.state.name && location.state.picture) {
            setCategory({ name: location.state.name, picture: location.state.picture });
        } else {
            axios.get(`/api/categories/${id}`)
                .then(response => {
                    setCategory(response.data);
                })
                .catch(error => {
                    console.error("Erreur lors de la récupération des détails de la catégorie", error);
                    setCategory({ name: 'Unknown Category', picture: '' });
                });
        }
    }, [location.state, id]);

    useEffect(() => {
        setLoading(true);
        axios.get(`/api/categories/${id}/species`, {
            params: {
                page: currentPage,
                limit: 6
            }
        })
            .then(response => {
                setSpecies(response.data.data);
                setTotalPages(response.data.totalPages);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des espèces", error);
                setError("Une erreur est survenue lors de la récupération des données.");
                setLoading(false);
            });
    }, [id, currentPage]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (loading) return <p>Loading...</p>;

    if (error) return <p>{error}</p>;

    return (
        <div className="species-list">
            <div className="category-header">
                <h1>{category.name}</h1>
                {category.picture && (
                    <img src={category.picture} alt={category.name} className="category-picture" />
                )}
            </div>
            <div className="species-container">
                {species.length === 0 ? (
                    <p>No species found for this category.</p>
                ) : (
                    <div className="species-grid">
                        {species.map(specie => (
                            <Link to={`/species/${specie.id}`} key={specie.id} className="species-item">
                                <h3>{specie.name}</h3>
                                {specie.picture && (
                                    <img src={specie.picture} alt={specie.name} className="species-picture" />
                                )}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
            <div className="pagination">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
            </div>
        </div>
    );
}

export default SpeciesList;