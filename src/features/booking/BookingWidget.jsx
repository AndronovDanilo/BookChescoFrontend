import React, { useState } from 'react';
import { useAuth } from '../../shared/context/AuthContext';
import apiService from '../../shared/api/apiService';
import Button from '../../shared/ui/Button/Button';
import './BookingWidget.css';

function BookingWidget({ hotel, rooms, minPrice, onOpenAuth }) {
    const { user, isAuthenticated } = useAuth();
    const [bookingData, setBookingData] = useState({
        checkIn: '',
        checkOut: '',
        roomId: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const availableRooms = rooms.filter(r => r.isFree);

    const handleChange = (e) => {
        setBookingData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        setError('');
        setSuccess(false);
    };

    const calculateNights = () => {
        if (!bookingData.checkIn || !bookingData.checkOut) return 0;
        const start = new Date(bookingData.checkIn);
        const end = new Date(bookingData.checkOut);
        const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 0;
    };

    const calculateTotal = () => {
        const nights = calculateNights();
        if (!nights || !bookingData.roomId) return 0;
        const selectedRoom = rooms.find(r => r.id === parseInt(bookingData.roomId));
        return selectedRoom ? selectedRoom.price * nights : 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            onOpenAuth('login');
            return;
        }

        if (!bookingData.checkIn || !bookingData.checkOut || !bookingData.roomId) {
            setError('Please fill in all fields');
            return;
        }

        const nights = calculateNights();
        if (nights <= 0) {
            setError('Check-out date must be after check-in date');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await apiService.createBooking({
                dateInRoom: bookingData.checkIn,
                dateOutRoom: bookingData.checkOut,
                roomId: parseInt(bookingData.roomId),
                amount: calculateTotal(),
                status: 'pending',
            });
            setSuccess(true);
            setBookingData({ checkIn: '', checkOut: '', roomId: '' });
        } catch (err) {
            setError(err.message || 'Failed to create booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const nights = calculateNights();
    const total = calculateTotal();
    const selectedRoom = rooms.find(r => r.id === parseInt(bookingData.roomId));

    // Get today's date for min date
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="booking-widget">
            <div className="booking-header">
                {minPrice ? (
                    <>
                        <span className="booking-price">{minPrice} ₴</span>
                        <span className="booking-period">per night</span>
                    </>
                ) : (
                    <span className="booking-title">Book this hotel</span>
                )}
            </div>

            {success ? (
                <div className="booking-success">
                    <div className="success-icon">✅</div>
                    <h3>Booking Confirmed!</h3>
                    <p>Your reservation has been sent for confirmation.</p>
                    <p>Check your bookings in your profile.</p>
                    <Button 
                        variant="action" 
                        onClick={() => window.location.href = '/profile'}
                    >
                        View My Bookings
                    </Button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="booking-form">
                    <div className="form-group">
                        <label>Check-in</label>
                        <input
                            type="date"
                            name="checkIn"
                            value={bookingData.checkIn}
                            onChange={handleChange}
                            min={today}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Check-out</label>
                        <input
                            type="date"
                            name="checkOut"
                            value={bookingData.checkOut}
                            onChange={handleChange}
                            min={bookingData.checkIn || today}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Room</label>
                        <select
                            name="roomId"
                            value={bookingData.roomId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a room</option>
                            {availableRooms.map(room => (
                                <option key={room.id} value={room.id}>
                                    {room.type || `Room #${room.number}`} - {room.price} ₴/night
                                </option>
                            ))}
                        </select>
                        {availableRooms.length === 0 && (
                            <p className="no-rooms-msg">No rooms available</p>
                        )}
                    </div>

                    {error && (
                        <div className="booking-error">
                            ❌ {error}
                        </div>
                    )}

                    {nights > 0 && selectedRoom && (
                        <div className="booking-summary">
                            <div className="summary-row">
                                <span>{selectedRoom.price} ₴ × {nights} nights</span>
                                <span>{selectedRoom.price * nights} ₴</span>
                            </div>
                            <div className="summary-total">
                                <span>Total</span>
                                <span>{total} ₴</span>
                            </div>
                        </div>
                    )}

                    <Button 
                        type="submit" 
                        variant="accent" 
                        className="booking-submit"
                        disabled={loading || availableRooms.length === 0}
                    >
                        {loading ? 'Booking...' : isAuthenticated ? 'Reserve' : 'Log in to book'}
                    </Button>

                    {!isAuthenticated && (
                        <p className="booking-hint">
                            <button type="button" onClick={() => onOpenAuth('signup')}>
                                Create an account
                            </button>
                            {' '}to book instantly
                        </p>
                    )}
                </form>
            )}

            <div className="booking-info">
                <p>✓ Free cancellation</p>
                <p>✓ No payment needed today</p>
            </div>
        </div>
    );
}

export default BookingWidget;


