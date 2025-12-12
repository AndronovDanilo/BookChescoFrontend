import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../shared/ui/Card/Card';
import apiService from '../../shared/api/apiService';
import './RecommendedHotels.css';

// Default placeholder image
const defaultImage = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80";

// Rating text based on score
const getRatingText = (rating) => {
    if (rating >= 9) return 'Exceptional';
    if (rating >= 8) return 'Excellent';
    if (rating >= 7) return 'Very Good';
    if (rating >= 6) return 'Good';
    return 'Pleasant';
};

function RecommendedHotels() {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const data = await apiService.getHotels();
                setHotels(data);
            } catch (err) {
                setError(err.message);
                console.error('Failed to fetch hotels:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, []);

    if (loading) {
        return (
            <section className="recommendations container">
                <h2>Homes guests love</h2>
                <div className="loading-grid">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="loading-card">
                            <div className="loading-image"></div>
                            <div className="loading-content">
                                <div className="loading-line"></div>
                                <div className="loading-line short"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="recommendations container">
                <h2>Homes guests love</h2>
                <div className="error-message">
                    <p>Failed to load hotels. Please try again later.</p>
                </div>
            </section>
        );
    }

    if (hotels.length === 0) {
        return (
            <section className="recommendations container">
                <h2>Homes guests love</h2>
                <div className="empty-message">
                    <p>No hotels available at the moment. Check back soon!</p>
                </div>
            </section>
        );
    }

    return (
        <section className="recommendations container">
            <h2>Homes guests love</h2>
            <p className="section-subtitle">Hand-picked properties for your perfect getaway</p>
            
            <div className="hotels-grid">
                {hotels.slice(0, 8).map((hotel) => (
                    <Link to={`/hotel/${hotel.id}`} key={hotel.id} className="hotel-card-link">
                        <Card
                            imageUrl={hotel.photos?.[0]?.url || defaultImage}
                            title={hotel.name || 'Unnamed Hotel'}
                            location={hotel.city}
                            rating={hotel.rate?.toFixed(1) || '8.0'}
                            ratingText={getRatingText(hotel.rate || 8)}
                        />
                    </Link>
                ))}
            </div>
            
            {hotels.length > 8 && (
                <div className="view-all">
                    <Link to="/hotels" className="btn btn--secondary">
                        View all {hotels.length} hotels
                    </Link>
                </div>
            )}
        </section>
    );
}

export default RecommendedHotels;
