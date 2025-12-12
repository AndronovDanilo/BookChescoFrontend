import React, { useState, useEffect } from 'react';
import Table from '../../shared/ui/Table/Table.jsx';
import Button from '../../shared/ui/Button/Button';
import Modal from '../../shared/ui/Modal/Modal';
import apiService from '../../shared/api/apiService';

function RoomTable() {
    const [rooms, setRooms] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [formData, setFormData] = useState({
        number: '',
        type: '',
        price: '',
        capacity: '',
        hotelId: '',
        isFree: true
    });

    const fetchData = async () => {
        try {
            const [roomsData, hotelsData] = await Promise.all([
                apiService.getRooms(),
                apiService.getHotels()
            ]);
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

    const getHotelName = (hotelId) => {
        const hotel = hotels.find(h => h.id === hotelId);
        return hotel?.name || 'Unknown';
    };

    const handleAdd = () => {
        setEditingRoom(null);
        setFormData({ number: '', type: '', price: '', capacity: '', hotelId: '', isFree: true });
        setModalOpen(true);
    };

    const handleEdit = (room) => {
        setEditingRoom(room);
        setFormData({
            number: room.number || '',
            type: room.type || '',
            price: room.price || '',
            capacity: room.capacity || '',
            hotelId: room.hotelId || '',
            isFree: room.isFree !== false
        });
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this room?')) return;
        
        try {
            await apiService.deleteRoom(id);
            setRooms(rooms.filter(r => r.id !== id));
        } catch (error) {
            alert(error.message || 'Failed to delete room');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const payload = {
                ...formData,
                number: parseInt(formData.number),
                price: parseFloat(formData.price),
                capacity: parseInt(formData.capacity),
                hotelId: parseInt(formData.hotelId)
            };

            if (editingRoom) {
                const updated = await apiService.updateRoom(editingRoom.id, payload);
                setRooms(rooms.map(r => r.id === editingRoom.id ? updated : r));
            } else {
                const created = await apiService.createRoom(payload);
                setRooms([...rooms, created]);
            }
            setModalOpen(false);
        } catch (error) {
            alert(error.message || 'Failed to save room');
        }
    };

    return (
        <>
            <div className="admin-table-container">
                <div className="admin-table-header">
                    <h3>{rooms.length} Rooms</h3>
                    <Button variant="action" onClick={handleAdd}>+ Add Room</Button>
                </div>
                
                <Table 
                    loading={loading}
                    empty={rooms.length === 0}
                    emptyIcon="🛏️"
                    emptyText="No rooms yet. Add your first room!"
                >
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Room #</th>
                            <th>Hotel</th>
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
                                <td>{room.id}</td>
                                <td><strong>{room.number}</strong></td>
                                <td>{getHotelName(room.hotelId)}</td>
                                <td>{room.type || '-'}</td>
                                <td>{room.capacity} guests</td>
                                <td>${room.price}/night</td>
                                <td>
                                    <span className={`status-badge ${room.isFree ? 'confirmed' : 'cancelled'}`}>
                                        {room.isFree ? 'Available' : 'Occupied'}
                                    </span>
                                </td>
                                <td className="actions">
                                    <Button variant="link" onClick={() => handleEdit(room)}>Edit</Button>
                                    <Button variant="link" onClick={() => handleDelete(room.id)} style={{color: 'var(--color-error)'}}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <Modal 
                isOpen={modalOpen} 
                onClose={() => setModalOpen(false)}
                title={editingRoom ? 'Edit Room' : 'Add New Room'}
                size="md"
            >
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Hotel *</label>
                        <select
                            value={formData.hotelId}
                            onChange={(e) => setFormData({...formData, hotelId: e.target.value})}
                            required
                        >
                            <option value="">Select hotel</option>
                            {hotels.map(hotel => (
                                <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Room Number *</label>
                            <input
                                type="number"
                                value={formData.number}
                                onChange={(e) => setFormData({...formData, number: e.target.value})}
                                required
                                placeholder="e.g. 101"
                            />
                        </div>
                        <div className="form-group">
                            <label>Room Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                            >
                                <option value="">Select type</option>
                                <option value="Standard">Standard</option>
                                <option value="Deluxe">Deluxe</option>
                                <option value="Suite">Suite</option>
                                <option value="Family">Family</option>
                                <option value="Presidential">Presidential</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Price per Night *</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.price}
                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                                required
                                placeholder="e.g. 99.99"
                            />
                        </div>
                        <div className="form-group">
                            <label>Capacity *</label>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={formData.capacity}
                                onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                                required
                                placeholder="Max guests"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.isFree}
                                onChange={(e) => setFormData({...formData, isFree: e.target.checked})}
                                style={{ marginRight: '8px' }}
                            />
                            Room is available for booking
                        </label>
                    </div>

                    <div className="form-actions">
                        <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="action" type="submit">
                            {editingRoom ? 'Save Changes' : 'Add Room'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}

export default RoomTable;
