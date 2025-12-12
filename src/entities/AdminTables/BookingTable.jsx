import React, { useState, useEffect } from 'react';
import Table from '../../shared/ui/Table/Table.jsx';
import Button from '../../shared/ui/Button/Button';
import Modal from '../../shared/ui/Modal/Modal';
import apiService from '../../shared/api/apiService';

function BookingTable() {
    const [bookings, setBookings] = useState([]);
    const [users, setUsers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState(null);
    const [formData, setFormData] = useState({
        roomId: '',
        dateInRoom: '',
        dateOutRoom: '',
        status: 'pending',
        isPaid: false,
        amount: ''
    });

    const fetchData = async () => {
        try {
            const [bookingsData, usersData, roomsData, hotelsData] = await Promise.all([
                apiService.getBookings().catch(() => []),
                apiService.getUsers().catch(() => []),
                apiService.getRooms().catch(() => []),
                apiService.getHotels().catch(() => [])
            ]);
            setBookings(bookingsData);
            setUsers(usersData);
            setRooms(roomsData);
            setHotels(hotelsData);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getUserName = (userId) => {
        const user = users.find(u => u.id === userId);
        return user?.login || 'Unknown';
    };

    const getRoomInfo = (roomId) => {
        const room = rooms.find(r => r.id === roomId);
        if (!room) return { room: 'Unknown', hotel: 'Unknown' };
        const hotel = hotels.find(h => h.id === room.hotelId);
        return { 
            room: `Room ${room.number}`, 
            hotel: hotel?.name || 'Unknown' 
        };
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString();
    };

    const handleEdit = (booking) => {
        setEditingBooking(booking);
        setFormData({
            roomId: booking.roomId || '',
            dateInRoom: booking.dateInRoom ? booking.dateInRoom.split('T')[0] : '',
            dateOutRoom: booking.dateOutRoom ? booking.dateOutRoom.split('T')[0] : '',
            status: booking.status || 'pending',
            isPaid: booking.isPaid || false,
            amount: booking.amount || ''
        });
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this booking?')) return;
        
        try {
            await apiService.deleteBooking(id);
            setBookings(bookings.filter(b => b.id !== id));
        } catch (error) {
            alert(error.message || 'Failed to delete booking');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const payload = {
                ...formData,
                roomId: parseInt(formData.roomId),
                amount: formData.amount ? parseFloat(formData.amount) : null
            };

            if (editingBooking) {
                const updated = await apiService.updateBooking(editingBooking.id, payload);
                setBookings(bookings.map(b => b.id === editingBooking.id ? updated : b));
            }
            setModalOpen(false);
        } catch (error) {
            alert(error.message || 'Failed to save booking');
        }
    };

    return (
        <>
            <div className="admin-stats">
                <div className="stat-card">
                    <h4>Total Bookings</h4>
                    <div className="stat-value">{bookings.length}</div>
                </div>
                <div className="stat-card">
                    <h4>Pending</h4>
                    <div className="stat-value">{bookings.filter(b => b.status === 'pending').length}</div>
                </div>
                <div className="stat-card">
                    <h4>Confirmed</h4>
                    <div className="stat-value">{bookings.filter(b => b.status === 'confirmed').length}</div>
                </div>
                <div className="stat-card">
                    <h4>Revenue</h4>
                    <div className="stat-value">
                        ${bookings.filter(b => b.isPaid).reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0).toFixed(2)}
                    </div>
                </div>
            </div>

            <div className="admin-table-container">
                <div className="admin-table-header">
                    <h3>{bookings.length} Bookings</h3>
                </div>
                
                <Table 
                    loading={loading}
                    empty={bookings.length === 0}
                    emptyIcon="📅"
                    emptyText="No bookings yet"
                >
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Guest</th>
                            <th>Hotel</th>
                            <th>Room</th>
                            <th>Check-in</th>
                            <th>Check-out</th>
                            <th>Status</th>
                            <th>Paid</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(booking => {
                            const roomInfo = getRoomInfo(booking.roomId);
                            return (
                                <tr key={booking.id}>
                                    <td>{booking.id}</td>
                                    <td><strong>{getUserName(booking.userId)}</strong></td>
                                    <td>{roomInfo.hotel}</td>
                                    <td>{roomInfo.room}</td>
                                    <td>{formatDate(booking.dateInRoom)}</td>
                                    <td>{formatDate(booking.dateOutRoom)}</td>
                                    <td>
                                        <span className={`status-badge ${booking.status}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td>{booking.isPaid ? '✅' : '❌'}</td>
                                    <td>{booking.amount ? `$${booking.amount}` : '-'}</td>
                                    <td className="actions">
                                        <Button variant="link" onClick={() => handleEdit(booking)}>Edit</Button>
                                        <Button variant="link" onClick={() => handleDelete(booking.id)} style={{color: 'var(--color-error)'}}>Delete</Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>

            <Modal 
                isOpen={modalOpen} 
                onClose={() => setModalOpen(false)}
                title="Edit Booking"
                size="md"
            >
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Check-in Date</label>
                            <input
                                type="date"
                                value={formData.dateInRoom}
                                onChange={(e) => setFormData({...formData, dateInRoom: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label>Check-out Date</label>
                            <input
                                type="date"
                                value={formData.dateOutRoom}
                                onChange={(e) => setFormData({...formData, dateOutRoom: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                            >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Amount</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.amount}
                                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                placeholder="Total amount"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.isPaid}
                                onChange={(e) => setFormData({...formData, isPaid: e.target.checked})}
                                style={{ marginRight: '8px' }}
                            />
                            Payment received
                        </label>
                    </div>

                    <div className="form-actions">
                        <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="action" type="submit">
                            Save Changes
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}

export default BookingTable;
