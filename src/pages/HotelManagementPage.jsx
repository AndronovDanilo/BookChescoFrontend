import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageShell from '../widgets/PageShell/PageShell';
import Button from '../shared/ui/Button/Button';
import Modal from '../shared/ui/Modal/Modal';
import Input from '../shared/ui/Input/Input';
import { PhotoGallery } from '../shared/ui/PhotoUpload';
import { useAuth } from '../shared/context/AuthContext';
import apiService from '../shared/api/apiService';
import './HotelManagementPage.css';

const getStatusBadge = (status) => {
    const badges = {
        pending: { label: 'Pending', class: 'status--pending' },
        confirmed: { label: 'Confirmed', class: 'status--confirmed' },
        cancelled: { label: 'Cancelled', class: 'status--cancelled' },
        completed: { label: 'Completed', class: 'status--completed' },
    };
    return badges[status] || badges.pending;
};

function HotelManagementPage({ onOpenAuth }) {
    const { id } = useParams();
    const { user, isAuthenticated } = useAuth();
    const [hotel, setHotel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [roomForm, setRoomForm] = useState({
        number: '',
        price: '',
        type: '',
        capacity: '',
        isFree: true,
    });

    const [hotelPhotos, setHotelPhotos] = useState([]);
    const [selectedRoomForPhotos, setSelectedRoomForPhotos] = useState(null);
    const [roomPhotos, setRoomPhotos] = useState([]);

    useEffect(() => {
        if (id) {
            fetchHotelData();
        }
    }, [id]);

    const fetchHotelData = async () => {
        try {
            setLoading(true);
            const [hotelData, roomsData] = await Promise.all([
                apiService.getHotel(id),
                apiService.getRoomsByHotel(id),
            ]);
            setHotel(hotelData);
            setRooms(roomsData);
            
            // Set hotel photos from the loaded hotel data
            if (hotelData.photos) {
                setHotelPhotos(hotelData.photos);
            }

            // Fetch bookings for all rooms of this hotel
            const allBookings = [];
            for (const room of roomsData) {
                try {
                    const roomBookings = await apiService.getBookingsByRoom(room.id);
                    allBookings.push(...roomBookings);
                } catch (e) {
                    // Room might not have bookings
                }
            }
            setBookings(allBookings);
        } catch (error) {
            console.error('Failed to fetch hotel data:', error);
            setMessage({ type: 'error', text: 'Failed to load hotel data' });
        } finally {
            setLoading(false);
        }
    };

    const handleRoomFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setRoomForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAddRoom = () => {
        setEditingRoom(null);
        setRoomForm({
            number: '',
            price: '',
            type: '',
            capacity: '',
            isFree: true,
        });
        setIsRoomModalOpen(true);
    };

    const handleEditRoom = (room) => {
        setEditingRoom(room);
        setRoomForm({
            number: room.number || '',
            price: room.price || '',
            type: room.type || '',
            capacity: room.capacity || '',
            isFree: room.isFree ?? true,
        });
        setIsRoomModalOpen(true);
    };

    const handleRoomSubmit = async (e) => {
        e.preventDefault();
        try {
            const roomData = {
                ...roomForm,
                number: parseInt(roomForm.number),
                price: parseFloat(roomForm.price),
                capacity: parseInt(roomForm.capacity),
                hotelId: parseInt(id),
            };

            if (editingRoom) {
                await apiService.updateRoom(editingRoom.id, roomData);
                setRooms(prev => prev.map(r => r.id === editingRoom.id ? { ...r, ...roomData } : r));
                setMessage({ type: 'success', text: 'Room updated successfully' });
            } else {
                const newRoom = await apiService.createRoom(roomData);
                setRooms(prev => [...prev, newRoom]);
                setMessage({ type: 'success', text: 'Room added successfully' });
            }
            setIsRoomModalOpen(false);
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to save room' });
        }
    };

    const handleDeleteRoom = async (roomId) => {
        if (!window.confirm('Are you sure you want to delete this room?')) return;
        
        try {
            await apiService.deleteRoom(roomId);
            setRooms(prev => prev.filter(r => r.id !== roomId));
            setMessage({ type: 'success', text: 'Room deleted successfully' });
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to delete room' });
        }
    };

    const handleUpdateBookingStatus = async (bookingId, newStatus) => {
        try {
            await apiService.updateBooking(bookingId, { status: newStatus });
            setBookings(prev => prev.map(b => 
                b.id === bookingId ? { ...b, status: newStatus } : b
            ));
            setMessage({ type: 'success', text: 'Booking status updated' });
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to update booking' });
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('uk-UA', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Photo handlers
    const handleHotelPhotoUpload = async (file) => {
        try {
            const photo = await apiService.uploadHotelPhoto(id, file);
            setHotelPhotos(prev => [...prev, photo]);
            setMessage({ type: 'success', text: 'Photo uploaded successfully' });
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to upload photo' });
            throw error;
        }
    };

    const handleHotelPhotoDelete = async (photoId) => {
        try {
            await apiService.deletePhoto(photoId);
            setHotelPhotos(prev => prev.filter(p => p.id !== photoId));
            setMessage({ type: 'success', text: 'Photo deleted successfully' });
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to delete photo' });
            throw error;
        }
    };

    const handleRoomPhotoUpload = async (file) => {
        if (!selectedRoomForPhotos) return;
        try {
            const photo = await apiService.uploadRoomPhoto(selectedRoomForPhotos.id, file);
            setRoomPhotos(prev => [...prev, photo]);
            setMessage({ type: 'success', text: 'Room photo uploaded successfully' });
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to upload photo' });
            throw error;
        }
    };

    const handleRoomPhotoDelete = async (photoId) => {
        try {
            await apiService.deletePhoto(photoId);
            setRoomPhotos(prev => prev.filter(p => p.id !== photoId));
            setMessage({ type: 'success', text: 'Photo deleted successfully' });
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to delete photo' });
            throw error;
        }
    };

    const openRoomPhotosModal = async (room) => {
        setSelectedRoomForPhotos(room);
        try {
            const photos = await apiService.getRoomPhotos(room.id);
            setRoomPhotos(photos);
        } catch (e) {
            setRoomPhotos([]);
        }
    };

    if (!isAuthenticated) {
        return (
            <PageShell onOpenAuth={onOpenAuth}>
                <div className="management-page container">
                    <div className="management-not-auth">
                        <div className="not-auth-icon">🔐</div>
                        <h2>Please log in to manage hotels</h2>
                        <Button variant="action" onClick={() => onOpenAuth('login')}>
                            Log In
                        </Button>
                    </div>
                </div>
            </PageShell>
        );
    }

    if (loading) {
        return (
            <PageShell onOpenAuth={onOpenAuth}>
                <div className="management-page container">
                    <div className="management-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading hotel data...</p>
                    </div>
                </div>
            </PageShell>
        );
    }

    if (!hotel) {
        return (
            <PageShell onOpenAuth={onOpenAuth}>
                <div className="management-page container">
                    <div className="management-error">
                        <h2>Hotel not found</h2>
                        <Link to="/my-hotels">
                            <Button variant="action">Back to My Hotels</Button>
                        </Link>
                    </div>
                </div>
            </PageShell>
        );
    }

    const canManage = user?.role === 'admin' || user?.role === 'hotel_owner' || user?.role === 'manager';

    return (
        <PageShell onOpenAuth={onOpenAuth}>
            <div className="management-page container">
                <div className="management-header">
                    <div className="header-info">
                        <Link to="/my-hotels" className="back-link">← Back to My Hotels</Link>
                        <h1>{hotel.name}</h1>
                        <p className="hotel-location">📍 {hotel.city}{hotel.address && `, ${hotel.address}`}</p>
                    </div>
                    {hotel.rate && (
                        <div className="hotel-rating">
                            <span className="rating-score">{hotel.rate.toFixed(1)}</span>
                        </div>
                    )}
                </div>

                {message.text && (
                    <div className={`management-message ${message.type}`}>
                        {message.type === 'success' ? '✅' : '❌'} {message.text}
                    </div>
                )}

                <div className="management-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        📊 Overview
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'photos' ? 'active' : ''}`}
                        onClick={() => setActiveTab('photos')}
                    >
                        📷 Photos ({hotelPhotos.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'rooms' ? 'active' : ''}`}
                        onClick={() => setActiveTab('rooms')}
                    >
                        🛏️ Rooms ({rooms.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bookings')}
                    >
                        📅 Bookings ({bookings.length})
                    </button>
                </div>

                <div className="management-content">
                    {activeTab === 'photos' && (
                        <div className="photos-section">
                            <div className="section-header">
                                <h3>Hotel Photos</h3>
                                <p className="section-description">Add photos to showcase your hotel</p>
                            </div>
                            
                            <PhotoGallery
                                photos={hotelPhotos}
                                onUpload={handleHotelPhotoUpload}
                                onDelete={handleHotelPhotoDelete}
                                maxPhotos={10}
                                disabled={!canManage}
                            />
                        </div>
                    )}

                    {activeTab === 'overview' && (
                        <div className="overview-section">
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-icon">🛏️</div>
                                    <div className="stat-value">{rooms.length}</div>
                                    <div className="stat-label">Total Rooms</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">✅</div>
                                    <div className="stat-value">{rooms.filter(r => r.isFree).length}</div>
                                    <div className="stat-label">Available</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">📅</div>
                                    <div className="stat-value">{bookings.filter(b => b.status === 'pending').length}</div>
                                    <div className="stat-label">Pending Bookings</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">✔️</div>
                                    <div className="stat-value">{bookings.filter(b => b.status === 'confirmed').length}</div>
                                    <div className="stat-label">Confirmed</div>
                                </div>
                            </div>

                            <div className="hotel-details-section">
                                <h3>Hotel Information</h3>
                                <div className="detail-row">
                                    <span className="detail-label">Description:</span>
                                    <p>{hotel.describe || 'No description'}</p>
                                </div>
                                {hotel.owner && (
                                    <div className="detail-row">
                                        <span className="detail-label">Owner:</span>
                                        <span>{hotel.owner.login} ({hotel.owner.email})</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'rooms' && (
                        <div className="rooms-section">
                            <div className="section-header">
                                <h3>Rooms Management</h3>
                                {canManage && (
                                    <Button variant="action" onClick={handleAddRoom}>
                                        + Add Room
                                    </Button>
                                )}
                            </div>

                            {rooms.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-icon">🛏️</div>
                                    <p>No rooms yet. Add your first room!</p>
                                </div>
                            ) : (
                                <div className="rooms-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Room #</th>
                                                <th>Type</th>
                                                <th>Capacity</th>
                                                <th>Price</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rooms.map(room => (
                                                <tr key={room.id}>
                                                    <td><strong>{room.number}</strong></td>
                                                    <td>{room.type || '-'}</td>
                                                    <td>{room.capacity || '-'} guests</td>
                                                    <td>{room.price} ₴/night</td>
                                                    <td>
                                                        <span className={`room-status ${room.isFree ? 'available' : 'occupied'}`}>
                                                            {room.isFree ? 'Available' : 'Occupied'}
                                                        </span>
                                                    </td>
                                                    <td className="actions">
                                                        <Button variant="link" onClick={() => openRoomPhotosModal(room)}>
                                                            📷
                                                        </Button>
                                                        <Button variant="link" onClick={() => handleEditRoom(room)}>
                                                            Edit
                                                        </Button>
                                                        <Button variant="link" onClick={() => handleDeleteRoom(room.id)}>
                                                            Delete
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'bookings' && (
                        <div className="bookings-section">
                            <div className="section-header">
                                <h3>Bookings Management</h3>
                            </div>

                            {bookings.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-icon">📅</div>
                                    <p>No bookings yet</p>
                                </div>
                            ) : (
                                <div className="bookings-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Room</th>
                                                <th>Guest</th>
                                                <th>Check-in</th>
                                                <th>Check-out</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bookings.map(booking => (
                                                <tr key={booking.id}>
                                                    <td>#{booking.id}</td>
                                                    <td>Room #{booking.roomId}</td>
                                                    <td>{booking.user?.login || `User #${booking.userId}`}</td>
                                                    <td>{formatDate(booking.dateInRoom)}</td>
                                                    <td>{formatDate(booking.dateOutRoom)}</td>
                                                    <td>{booking.amount ? `${booking.amount} ₴` : '-'}</td>
                                                    <td>
                                                        <span className={`booking-status ${getStatusBadge(booking.status).class}`}>
                                                            {getStatusBadge(booking.status).label}
                                                        </span>
                                                    </td>
                                                    <td className="actions">
                                                        {booking.status === 'pending' && (
                                                            <>
                                                                <Button 
                                                                    variant="link" 
                                                                    onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                                                                >
                                                                    Confirm
                                                                </Button>
                                                                <Button 
                                                                    variant="link" 
                                                                    onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                                                                >
                                                                    Cancel
                                                                </Button>
                                                            </>
                                                        )}
                                                        {booking.status === 'confirmed' && (
                                                            <Button 
                                                                variant="link" 
                                                                onClick={() => handleUpdateBookingStatus(booking.id, 'completed')}
                                                            >
                                                                Complete
                                                            </Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {isRoomModalOpen && (
                    <Modal onClose={() => setIsRoomModalOpen(false)}>
                        <form onSubmit={handleRoomSubmit} className="room-form">
                            <h3>{editingRoom ? 'Edit Room' : 'Add New Room'}</h3>
                            
                            <div className="form-group">
                                <label>Room Number *</label>
                                <Input
                                    name="number"
                                    type="number"
                                    value={roomForm.number}
                                    onChange={handleRoomFormChange}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Type</label>
                                <Input
                                    name="type"
                                    value={roomForm.type}
                                    onChange={handleRoomFormChange}
                                    placeholder="e.g., Standard, Deluxe, Suite"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Capacity (guests)</label>
                                <Input
                                    name="capacity"
                                    type="number"
                                    value={roomForm.capacity}
                                    onChange={handleRoomFormChange}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Price per night (₴) *</label>
                                <Input
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    value={roomForm.price}
                                    onChange={handleRoomFormChange}
                                    required
                                />
                            </div>
                            
                            <div className="form-group checkbox">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="isFree"
                                        checked={roomForm.isFree}
                                        onChange={handleRoomFormChange}
                                    />
                                    Room is available
                                </label>
                            </div>
                            
                            <div className="form-actions">
                                <Button type="button" variant="secondary" onClick={() => setIsRoomModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="action">
                                    {editingRoom ? 'Save Changes' : 'Add Room'}
                                </Button>
                            </div>
                        </form>
                    </Modal>
                )}

                {selectedRoomForPhotos && (
                    <Modal onClose={() => setSelectedRoomForPhotos(null)} title={`Photos - Room #${selectedRoomForPhotos.number}`}>
                        <div className="room-photos-modal">
                            <PhotoGallery
                                photos={roomPhotos}
                                onUpload={handleRoomPhotoUpload}
                                onDelete={handleRoomPhotoDelete}
                                maxPhotos={5}
                                disabled={!canManage}
                            />
                        </div>
                    </Modal>
                )}
            </div>
        </PageShell>
    );
}

export default HotelManagementPage;

