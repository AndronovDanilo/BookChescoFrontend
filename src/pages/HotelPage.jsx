import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageShell from '../widgets/PageShell/PageShell';
import PhotoGallery from '../features/gallery/PhotoGallery';
import BookingWidget from '../features/booking/BookingWidget';
import apiService from '../shared/api/apiService';
import './HotelPage.css';

const defaultImage = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80";

const getRatingText = (rating) => {
    if (rating >= 9) return 'Exceptional';
    if (rating >= 8) return 'Excellent';
    if (rating >= 7) return 'Very Good';
    if (rating >= 6) return 'Good';
    return 'Pleasant';
};

function HotelPage({ onOpenAuth }) {
    const { id } = useParams();
    const [hotel, setHotel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [hotelData, roomsData] = await Promise.all([
                    apiService.getHotel(id),
                    apiService.getRoomsByHotel(id)
                ]);
                setHotel(hotelData);
                setRooms(roomsData);
            } catch (err) {
                console.error('Failed to fetch hotel:', err);
                setError(err.message || 'Failed to load hotel');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <PageShell onOpenAuth={onOpenAuth}>
                <div className="hotel-loading container">
                    <div className="loading-spinner"></div>
                    <p>Loading hotel details...</p>
                </div>
            </PageShell>
        );
    }

    if (error || !hotel) {
        return (
            <PageShell onOpenAuth={onOpenAuth}>
                <div className="hotel-error container">
                    <div className="error-icon">🏨</div>
                    <h1>Hotel not found</h1>
                    <p>{error || 'The hotel you are looking for does not exist.'}</p>
                </div>
            </PageShell>
        );
    }

    const photos = hotel.photos?.length > 0 
        ? hotel.photos 
        : [{ url: defaultImage, alt: hotel.name }];

    const minPrice = rooms.length > 0 
        ? Math.min(...rooms.map(r => r.price || Infinity))
        : null;

    return (
        <PageShell onOpenAuth={onOpenAuth}>
            <div className="hotel-page container">
                {/* Hotel Header */}
                <div className="hotel-header">
                    <div className="hotel-header-main">
                        <h1>{hotel.name}</h1>
                        <p className="hotel-location">
                            📍 {hotel.city}{hotel.address && `, ${hotel.address}`}
                        </p>
                    </div>
                    {hotel.rate && (
                        <div className="hotel-rating-block">
                            <div className="rating-info">
                                <span className="rating-text">{getRatingText(hotel.rate)}</span>
                                <span className="rating-reviews">{Math.floor(Math.random() * 500) + 100} reviews</span>
                            </div>
                            <span className="rating-score">{hotel.rate.toFixed(1)}</span>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="hotel-main-grid">
                    <div className="hotel-left-column">
                        {/* Photo Gallery */}
                        <PhotoGallery photos={photos} />

                        {/* Tabs */}
                        <div className="hotel-tabs">
                            <button 
                                className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                                onClick={() => setActiveTab('description')}
                            >
                                Description
                            </button>
                            <button 
                                className={`tab-btn ${activeTab === 'rooms' ? 'active' : ''}`}
                                onClick={() => setActiveTab('rooms')}
                            >
                                Rooms & Prices
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="hotel-tab-content">
                            {activeTab === 'description' && (
                                <div className="hotel-description">
                                    <h2>About this hotel</h2>
                                    <p>{hotel.describe || 'No description available for this hotel.'}</p>
                                    
                                    <div className="hotel-features">
                                        <h3>Popular amenities</h3>
                                        <div className="features-grid">
                                            <div className="feature-item">🏊 Swimming Pool</div>
                                            <div className="feature-item">📶 Free WiFi</div>
                                            <div className="feature-item">🅿️ Free Parking</div>
                                            <div className="feature-item">🍳 Restaurant</div>
                                            <div className="feature-item">💪 Fitness Center</div>
                                            <div className="feature-item">🛎️ 24h Reception</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'rooms' && (
                                <div className="hotel-rooms">
                                    <h2>Available Rooms</h2>
                                    {rooms.length === 0 ? (
                                        <div className="no-rooms">
                                            <p>No rooms available at the moment.</p>
                                        </div>
                                    ) : (
                                        <div className="rooms-list">
                                            {rooms.map(room => (
                                                <div 
                                                    key={room.id} 
                                                    className={`room-card ${room.isFree ? '' : 'unavailable'}`}
                                                >
                                                    <div className="room-info">
                                                        <h4>{room.type || `Room #${room.number}`}</h4>
                                                        <div className="room-details">
                                                            <span>👥 {room.capacity || 2} guests</span>
                                                            <span>🛏️ Room #{room.number}</span>
                                                        </div>
                                                    </div>
                                                    <div className="room-price-block">
                                                        <div className="room-price">
                                                            <span className="price-amount">{room.price} ₴</span>
                                                            <span className="price-period">per night</span>
                                                        </div>
                                                        <span className={`room-status ${room.isFree ? 'available' : 'occupied'}`}>
                                                            {room.isFree ? 'Available' : 'Occupied'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar - Booking Widget */}
                    <div className="hotel-right-sidebar">
                        <BookingWidget 
                            hotel={hotel} 
                            rooms={rooms} 
                            minPrice={minPrice}
                            onOpenAuth={onOpenAuth}
                        />
                    </div>
                </div>
            </div>
        </PageShell>
    );
}

export default HotelPage;
