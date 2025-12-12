import React, { useState, useEffect } from 'react';
import Card from '../../shared/ui/Card/Card';
import apiService from '../../shared/api/apiService';
import './LocationSearchList.css';

// Default destinations with images
const defaultDestinations = [
    { 
        city: "Kyiv", 
        country: "Ukraine",
        image: "https://images.unsplash.com/photo-1561542320-9a18cd340469?w=600&q=80",
        hotels: 0
    },
    { 
        city: "Lviv", 
        country: "Ukraine",
        image: "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=600&q=80",
        hotels: 0
    },
    { 
        city: "Odesa", 
        country: "Ukraine",
        image: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&q=80",
        hotels: 0
    },
    { 
        city: "Paris", 
        country: "France",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80",
        hotels: 0
    },
];

function LocationSearchList() {
    const [destinations, setDestinations] = useState(defaultDestinations);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const hotels = await apiService.getHotels();
                
                // Count hotels per city
                const cityCount = {};
                hotels.forEach(hotel => {
                    if (hotel.city) {
                        cityCount[hotel.city] = (cityCount[hotel.city] || 0) + 1;
                    }
                });

                // Update destinations with real counts
                setDestinations(prev => prev.map(dest => ({
                    ...dest,
                    hotels: cityCount[dest.city] || 0
                })));
            } catch (error) {
                console.error('Failed to fetch hotels:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, []);

    return (
        <section className="destinations container">
            <h2>Explore Ukraine</h2>
            <p className="section-subtitle">These popular destinations have a lot to offer</p>
            
            <div className="destinations-grid">
                {destinations.map((dest, index) => (
                    <div key={index} className="destination-card">
                        <div className="destination-image">
                            <img src={dest.image} alt={dest.city} />
                        </div>
                        <div className="destination-info">
                            <h3>{dest.city}</h3>
                            <p>{dest.hotels} {dest.hotels === 1 ? 'property' : 'properties'}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default LocationSearchList;
