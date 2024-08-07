import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function SpeciesDetail() {
    const { id } = useParams();
    const [species, setSpecies] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`/api/species/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setSpecies(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des détails de l'espèce :", error);
                setError("Une erreur est survenue lors de la récupération des données.");
                setLoading(false);
            });
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
<div className="species-detail">
    {species ? (
        <>
            <h1 className='species_detail'>{species.name}</h1>
            <img
                src={species.picture}
                alt={species.name}
                className="species-picture"
                onLoad={() => document.querySelector('.species-picture').classList.add('visible')}
            />
            <table style={{ border: '1px solid blue', borderCollapse: 'collapse' }} >
                <tbody >
                    <tr>
                        <td className='table-specie'><strong>Description</strong></td>
                        <td className='table-specie'>{species.description}</td>
                    </tr>
                    <tr>
                        <td className='table-specie'><strong>Avis</strong></td>
                        <td className='table-specie'>{species.avis}</td>
                    </tr>
                    <tr>
                        <td className='table-specie'><strong>Date</strong></td>
                        <td className='table-specie'>{species.date}</td>
                    </tr>
                </tbody>
            </table>
        </>
    ) : (
        <p>Aucune information disponible pour cette espèce.</p>
    )}
</div>

    
    );
}

export default SpeciesDetail;
