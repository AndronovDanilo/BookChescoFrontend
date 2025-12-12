import React, { useState, useEffect } from 'react';
import Table from '../../shared/ui/Table/Table.jsx';
import Button from '../../shared/ui/Button/Button';
import Modal from '../../shared/ui/Modal/Modal';
import apiService from '../../shared/api/apiService';

function HotelTable() {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingHotel, setEditingHotel] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        city: '',
        address: '',
        describe: '',
        rate: ''
    });

    const fetchHotels = async () => {
        try {
            const data = await apiService.getHotels();
            setHotels(data);
        } catch (error) {
            console.error('Failed to fetch hotels:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHotels();
    }, []);

    const handleAdd = () => {
        setEditingHotel(null);
        setFormData({ name: '', city: '', address: '', describe: '', rate: '' });
        setModalOpen(true);
    };

    const handleEdit = (hotel) => {
        setEditingHotel(hotel);
        setFormData({
            name: hotel.name || '',
            city: hotel.city || '',
            address: hotel.address || '',
            describe: hotel.describe || '',
            rate: hotel.rate || ''
        });
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this hotel?')) return;
        
        try {
            await apiService.deleteHotel(id);
            setHotels(hotels.filter(h => h.id !== id));
        } catch (error) {
            alert(error.message || 'Failed to delete hotel');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const payload = {
                ...formData,
                rate: formData.rate ? parseFloat(formData.rate) : null
            };

            if (editingHotel) {
                const updated = await apiService.updateHotel(editingHotel.id, payload);
                setHotels(hotels.map(h => h.id === editingHotel.id ? updated : h));
            } else {
                const created = await apiService.createHotel(payload);
                setHotels([...hotels, created]);
            }
            setModalOpen(false);
        } catch (error) {
            alert(error.message || 'Failed to save hotel');
        }
    };

    return (
        <>
            <div className="admin-table-container">
                <div className="admin-table-header">
                    <h3>{hotels.length} Hotels</h3>
                    <Button variant="action" onClick={handleAdd}>+ Add Hotel</Button>
                </div>
                
                <Table 
                    loading={loading} 
                    empty={hotels.length === 0}
                    emptyIcon="🏨"
                    emptyText="No hotels yet. Add your first hotel!"
                >
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>City</th>
                            <th>Address</th>
                            <th>Rating</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hotels.map(hotel => (
                            <tr key={hotel.id}>
                                <td>{hotel.id}</td>
                                <td><strong>{hotel.name}</strong></td>
                                <td>{hotel.city}</td>
                                <td>{hotel.address}</td>
                                <td>{hotel.rate ? `⭐ ${hotel.rate.toFixed(1)}` : '-'}</td>
                                <td className="actions">
                                    <Button variant="link" onClick={() => handleEdit(hotel)}>Edit</Button>
                                    <Button variant="link" onClick={() => handleDelete(hotel.id)} style={{color: 'var(--color-error)'}}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <Modal 
                isOpen={modalOpen} 
                onClose={() => setModalOpen(false)}
                title={editingHotel ? 'Edit Hotel' : 'Add New Hotel'}
                size="md"
            >
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Hotel Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                            placeholder="Enter hotel name"
                        />
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label>City *</label>
                            <input
                                type="text"
                                value={formData.city}
                                onChange={(e) => setFormData({...formData, city: e.target.value})}
                                required
                                placeholder="Enter city"
                            />
                        </div>
                        <div className="form-group">
                            <label>Rating</label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="10"
                                value={formData.rate}
                                onChange={(e) => setFormData({...formData, rate: e.target.value})}
                                placeholder="0.0 - 10.0"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Address</label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            placeholder="Enter full address"
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={formData.describe}
                            onChange={(e) => setFormData({...formData, describe: e.target.value})}
                            placeholder="Describe the hotel..."
                        />
                    </div>

                    <div className="form-actions">
                        <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="action" type="submit">
                            {editingHotel ? 'Save Changes' : 'Add Hotel'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}

export default HotelTable;
