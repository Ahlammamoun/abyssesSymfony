import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AvisForm from './FormAvis';
import axios from 'axios';

function SpeciesDetail({ user }) {
    const { id } = useParams();
    const [species, setSpecies] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchSpeciesDetails = () => {
        setLoading(true);
        axios.get(`/api/species/${id}`, { params: { page: currentPage, limit: 3 } })
            .then(response => {
                setSpecies(response.data);
                setTotalPages(response.data.totalPages);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des détails de l'espèce :", error);
                setError("Une erreur est survenue lors de la récupération des données.");
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchSpeciesDetails();
    }, [id, currentPage]);

    console.log('User in SpeciesDetail:', user); 

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const calculateAverageRating = () => {
        if (!species || !species.avis || species.avis.length === 0) {
            return "Pas encore noté";
        }
        const total = species.avis.reduce((sum, avis) => sum + (avis.rating || 0), 0);
        return (total / species.avis.length).toFixed(1);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
  
    return (
        <div className="species-detail">
            {species ? (
                <>
                    <h1 className='species_detail'>{species.name}</h1>
                    <p>Note moyenne : {calculateAverageRating()} ★</p>
                    <img
                        src={species.picture}
                        alt={species.name}
                        className="species-picture"
                        onLoad={() => document.querySelector('.species-picture').classList.add('visible')}
                    />
                    <table style={{ border: '1px solid blue', borderCollapse: 'collapse' }} >
                        <tbody>
                            <tr>
                                <td className='table-specie'><strong>Description</strong></td>
                                <td className='table-specie'>{species.description}</td>
                            </tr>
                            <tr>
                                <td className='table-specie'><strong>Avis</strong></td>
                                <td className='table-specie'>
                                    {species.avis.length > 0 ? (
                                        <>
                                            {species.avis.map((avi, index) => (
                                                <div className="avis" key={index}>
                                                    <p>
                                                        <strong>{avi.author || "Anonyme"}</strong> ({new Date(avi.date).toLocaleDateString()}):
                                                        <span> Note : {avi.rating} ★</span>
                                                    </p>
                                                    <p>{avi.content}</p>
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <p>Aucun avis disponible.</p>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td className='table-specie'><strong>Date</strong></td>
                                <td className='table-specie'>{new Date(species.date).toLocaleDateString()}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="pagination">
                        <button 
                            onClick={() => handlePageChange(currentPage - 1)} 
                            disabled={currentPage === 1}
                            className="btn btn-primary"
                        >
                            &lt;
                        </button>
                        <span>Page {currentPage} sur {totalPages}</span>
                        <button 
                            onClick={() => handlePageChange(currentPage + 1)} 
                            disabled={currentPage === totalPages}
                            className="btn btn-primary"
                        >
                            &gt;
                        </button>
                    </div>
                    {user && ( // Afficher le formulaire seulement si l'utilisateur est connecté
                        <AvisForm 
                            speciesId={id} 
                            onAvisSubmitted={() => fetchSpeciesDetails(currentPage)} 
                            user={user} 
                        />
                    )}
                </>
            ) : (
                <p>Aucune information disponible pour cette espèce.</p>
            )}
        </div>
    );
}

export default SpeciesDetail;
