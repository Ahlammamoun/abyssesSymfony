import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function TypeSpeciesList() {
    const { id } = useParams();
    const [types, setTypes] = useState([]);
    const [species, setSpecies] = useState([]);
    const [selectedType, setSelectedType] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        // Récupération de tous les types
        axios.get(`/api/types`)
            .then(response => {
                setTypes(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des types", error);
                setError("Une erreur est survenue lors de la récupération des types.");
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (id) {
            // Récupération des espèces pour un type sélectionné avec pagination
            axios.get(`/api/types/${id}/species`, {
                params: {
                    page: currentPage,
                    limit: 6
                }
            })
                .then(response => {
                    if (Array.isArray(response.data.data)) {
                        setSpecies(response.data.data);
                        setTotalPages(response.data.totalPages);
                        setSelectedType(types.find(type => type.id === parseInt(id)));
                    } else {
                        console.error("Unexpected response format:", response.data);
                        setError("Unexpected response format.");
                    }
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Erreur lors de la récupération des espèces", error);
                    setError("Une erreur est survenue lors de la récupération des données.");
                    setLoading(false);
                });
        }
    }, [id, types, currentPage]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            {selectedType && (
                <div className="species-list">
                    <div className="category-header">
                        <h1>{selectedType.name}</h1>
                    </div>
                    <div className="species-container">
                        {species.length === 0 ? (
                            <p>No species found for this type.</p>
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
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>&lt;</button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>&gt;</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TypeSpeciesList;

