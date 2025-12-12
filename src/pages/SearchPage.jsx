import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import PageShell from '../widgets/PageShell/PageShell';
import Card from '../shared/ui/Card/Card';
import apiService from '../shared/api/apiService';
import './SearchPage.css';

const defaultImage = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80";

const getRatingText = (rating) => {
    if (rating >= 9) return 'Exceptional';
    if (rating >= 8) return 'Excellent';
    if (rating >= 7) return 'Very Good';
    if (rating >= 6) return 'Good';
    return 'Pleasant';
};

function SearchPage({ onOpenAuth }) {
    const [searchParams] = useSearchParams();
    const [hotels, setHotels] = useState([]);
    const [filteredHotels, setFilteredHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        city: searchParams.get('city') || '',
        checkIn: searchParams.get('checkIn') || '',
        checkOut: searchParams.get('checkOut') || '',
        minPrice: '',
        maxPrice: '',
        minRating: ''
    });

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const data = await apiService.getHotels();
                setHotels(data);
                setFilteredHotels(data);
            } catch (error) {
                console.error('Failed to fetch hotels:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHotels();
    }, []);

    useEffect(() => {
        let result = [...hotels];

        if (filters.city) {
            result = result.filter(h => 
                h.city?.toLowerCase().includes(filters.city.toLowerCase()) ||
                h.name?.toLowerCase().includes(filters.city.toLowerCase())
            );
        }

        if (filters.minRating) {
            result = result.filter(h => h.rate >= parseFloat(filters.minRating));
        }

        setFilteredHotels(result);
    }, [filters, hotels]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <PageShell onOpenAuth={onOpenAuth}>
            <div className="search-page container">
                <div className="search-sidebar">
                    <div className="filter-section">
                        <h3>Search</h3>
                        <div className="filter-group">
                            <label>Destination</label>
                            <input
                                type="text"
                                value={filters.city}
                                onChange={(e) => handleFilterChange('city', e.target.value)}
                                placeholder="City or hotel name"
                            />
                        </div>
                        <div className="filter-group">
                            <label>Check-in</label>
                            <input
                                type="date"
                                value={filters.checkIn}
                                onChange={(e) => handleFilterChange('checkIn', e.target.value)}
                            />
                        </div>
                        <div className="filter-group">
                            <label>Check-out</label>
                            <input
                                type="date"
                                value={filters.checkOut}
                                onChange={(e) => handleFilterChange('checkOut', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="filter-section">
                        <h3>Filters</h3>
                        <div className="filter-group">
                            <label>Minimum Rating</label>
                            <select 
                                value={filters.minRating}
                                onChange={(e) => handleFilterChange('minRating', e.target.value)}
                            >
                                <option value="">Any rating</option>
                                <option value="9">9+ Exceptional</option>
                                <option value="8">8+ Excellent</option>
                                <option value="7">7+ Very Good</option>
                                <option value="6">6+ Good</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="search-results">
                    <div className="search-header">
                        <h1>
                            {filters.city ? `Hotels in ${filters.city}` : 'All Hotels'}
                        </h1>
                        <p>{filteredHotels.length} properties found</p>
                    </div>

                    {loading ? (
                        <div className="search-loading">
                            <div className="loading-spinner"></div>
                            <p>Searching for hotels...</p>
                        </div>
                    ) : filteredHotels.length === 0 ? (
                        <div className="search-empty">
                            <div className="empty-icon">🔍</div>
                            <h3>No hotels found</h3>
                            <p>Try adjusting your search criteria</p>
                        </div>
                    ) : (
                        <div className="results-list">
                            {filteredHotels.map(hotel => (
                                <Link to={`/hotel/${hotel.id}`} key={hotel.id} className="result-card">
                                    <div className="result-image">
                                        <img 
                                            src={hotel.photos?.[0]?.url || defaultImage} 
                                            alt={hotel.name} 
                                        />
                                    </div>
                                    <div className="result-content">
                                        <div className="result-main">
                                            <h3>{hotel.name}</h3>
                                            <p className="result-location">📍 {hotel.city}</p>
                                            {hotel.address && (
                                                <p className="result-address">{hotel.address}</p>
                                            )}
                                            {hotel.describe && (
                                                <p className="result-description">{hotel.describe}</p>
                                            )}
                                        </div>
                                        <div className="result-side">
                                            {hotel.rate && (
                                                <div className="result-rating">
                                                    <span className="rating-score">{hotel.rate.toFixed(1)}</span>
                                                    <span className="rating-text">{getRatingText(hotel.rate)}</span>
                                                </div>
                                            )}
                                            <button className="btn btn--action">View Details</button>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PageShell>
    );
}

export default SearchPage;


