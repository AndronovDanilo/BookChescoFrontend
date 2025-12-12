import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../widgets/PageShell/PageShell';
import Button from '../shared/ui/Button/Button';
import Modal from '../shared/ui/Modal/Modal';
import Input from '../shared/ui/Input/Input';
import { useAuth } from '../shared/context/AuthContext';
import apiService from '../shared/api/apiService';
import './MyHotelsPage.css';

const defaultImage = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80";

function MyHotelsPage({ onOpenAuth }) {
    const { user, isAuthenticated } = useAuth();
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [hotelForm, setHotelForm] = useState({
        name: '',
        city: '',
        address: '',
        describe: '',
        rate: '',
    });

    useEffect(() => {
        if (isAuthenticated) {
            fetchMyHotels();
        }
    }, [isAuthenticated]);

    const fetchMyHotels = async () => {
        try {
            setLoading(true);
            const data = await apiService.getMyHotels();
            setHotels(data);
        } catch (error) {
            console.error('Failed to fetch hotels:', error);
            setMessage({ type: 'error', text: 'Failed to load your hotels' });
        } finally {
            setLoading(false);
        }
    };

    const handleFormChange = (e) => {
        setHotelForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const hotelData = {
                ...hotelForm,
                rate: hotelForm.rate ? parseFloat(hotelForm.rate) : undefined,
            };
            const newHotel = await apiService.createHotel(hotelData);
            setHotels(prev => [...prev, newHotel]);
            setIsModalOpen(false);
            setHotelForm({ name: '', city: '', address: '', describe: '', rate: '' });
            setMessage({ type: 'success', text: 'Hotel created successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to create hotel' });
        }
    };

    const handleDeleteHotel = async (hotelId) => {
        if (!window.confirm('Are you sure you want to delete this hotel?')) return;

        try {
            await apiService.deleteHotel(hotelId);
            setHotels(prev => prev.filter(h => h.id !== hotelId));
            setMessage({ type: 'success', text: 'Hotel deleted successfully' });
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to delete hotel' });
        }
    };

    if (!isAuthenticated) {
        return (
            <PageShell onOpenAuth={onOpenAuth}>
                <div className="my-hotels-page container">
                    <div className="hotels-not-auth">
                        <div className="not-auth-icon">🏨</div>
                        <h2>Please log in to manage your hotels</h2>
                        <p>Access your hotel dashboard and manage your properties</p>
                        <Button variant="action" onClick={() => onOpenAuth('login')}>
                            Log In
                        </Button>
                    </div>
                </div>
            </PageShell>
        );
    }

    const canCreateHotel = user?.role === 'admin' || user?.role === 'hotel_owner';

    return (
        <PageShell onOpenAuth={onOpenAuth}>
            <div className="my-hotels-page container">
                <div className="page-header">
                    <div className="header-content">
                        <h1>🏨 My Hotels</h1>
                        <p>Manage your hotel properties</p>
                    </div>
                    {canCreateHotel && (
                        <Button variant="action" onClick={() => setIsModalOpen(true)}>
                            + Add New Hotel
                        </Button>
                    )}
                </div>

                {message.text && (
                    <div className={`page-message ${message.type}`}>
                        {message.type === 'success' ? '✅' : '❌'} {message.text}
                    </div>
                )}

                {loading ? (
                    <div className="hotels-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading your hotels...</p>
                    </div>
                ) : hotels.length === 0 ? (
                    <div className="hotels-empty">
                        <div className="empty-icon">🏨</div>
                        <h3>No hotels yet</h3>
                        <p>Start by adding your first hotel property</p>
                        {canCreateHotel && (
                            <Button variant="action" onClick={() => setIsModalOpen(true)}>
                                Add Your First Hotel
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="hotels-grid">
                        {hotels.map(hotel => (
                            <div key={hotel.id} className="hotel-card">
                                <div className="hotel-image">
                                    <img 
                                        src={hotel.photos?.[0]?.url || defaultImage} 
                                        alt={hotel.name} 
                                    />
                                    {hotel.rate && (
                                        <div className="hotel-badge">
                                            ⭐ {hotel.rate.toFixed(1)}
                                        </div>
                                    )}
                                </div>
                                <div className="hotel-content">
                                    <h3>{hotel.name}</h3>
                                    <p className="hotel-location">📍 {hotel.city}</p>
                                    {hotel.address && (
                                        <p className="hotel-address">{hotel.address}</p>
                                    )}
                                    <div className="hotel-stats">
                                        <span>{hotel.rooms?.length || 0} rooms</span>
                                    </div>
                                    <div className="hotel-actions">
                                        <Link to={`/manage-hotel/${hotel.id}`}>
                                            <Button variant="action">Manage</Button>
                                        </Link>
                                        <Link to={`/hotel/${hotel.id}`}>
                                            <Button variant="secondary">View</Button>
                                        </Link>
                                        <Button 
                                            variant="link" 
                                            onClick={() => handleDeleteHotel(hotel.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {isModalOpen && (
                    <Modal onClose={() => setIsModalOpen(false)}>
                        <form onSubmit={handleSubmit} className="hotel-form">
                            <h3>Add New Hotel</h3>
                            
                            <div className="form-group">
                                <label>Hotel Name *</label>
                                <Input
                                    name="name"
                                    value={hotelForm.name}
                                    onChange={handleFormChange}
                                    placeholder="Enter hotel name"
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>City *</label>
                                <Input
                                    name="city"
                                    value={hotelForm.city}
                                    onChange={handleFormChange}
                                    placeholder="Enter city"
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Address</label>
                                <Input
                                    name="address"
                                    value={hotelForm.address}
                                    onChange={handleFormChange}
                                    placeholder="Enter full address"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Rating (0-10)</label>
                                <Input
                                    name="rate"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="10"
                                    value={hotelForm.rate}
                                    onChange={handleFormChange}
                                    placeholder="Enter rating"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="describe"
                                    value={hotelForm.describe}
                                    onChange={handleFormChange}
                                    placeholder="Describe your hotel..."
                                    rows="4"
                                />
                            </div>
                            
                            <div className="form-actions">
                                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="action">
                                    Create Hotel
                                </Button>
                            </div>
                        </form>
                    </Modal>
                )}
            </div>
        </PageShell>
    );
}

export default MyHotelsPage;


