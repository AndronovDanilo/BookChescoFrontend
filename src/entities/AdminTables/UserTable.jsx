import React, { useState, useEffect } from 'react';
import Table from '../../shared/ui/Table/Table.jsx';
import Button from '../../shared/ui/Button/Button';
import Modal from '../../shared/ui/Modal/Modal';
import apiService from '../../shared/api/apiService';

const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'hotel_owner', label: 'Hotel Owner' },
    { value: 'manager', label: 'Manager' },
    { value: 'client', label: 'Client' },
    { value: 'guest', label: 'Guest' }
];

function UserTable() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'client'
    });

    const fetchUsers = async () => {
        try {
            const data = await apiService.getUsers();
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAdd = () => {
        setEditingUser(null);
        setFormData({ username: '', email: '', password: '', role: 'client' });
        setModalOpen(true);
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            username: user.login || '',
            email: user.email || '',
            password: '',
            role: user.role || 'client'
        });
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        
        try {
            await apiService.deleteUser(id);
            setUsers(users.filter(u => u.id !== id));
        } catch (error) {
            alert(error.message || 'Failed to delete user');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (editingUser) {
                const payload = {
                    username: formData.username,
                    email: formData.email,
                    role: formData.role,
                    ...(formData.password && { password: formData.password })
                };
                const updated = await apiService.updateUser(editingUser.id, payload);
                setUsers(users.map(u => u.id === editingUser.id ? updated : u));
            } else {
                if (!formData.password) {
                    alert('Password is required for new users');
                    return;
                }
                const created = await apiService.createUser(formData);
                setUsers([...users, created]);
            }
            setModalOpen(false);
        } catch (error) {
            alert(error.message || 'Failed to save user');
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString();
    };

    return (
        <>
            <div className="admin-stats">
                <div className="stat-card">
                    <h4>Total Users</h4>
                    <div className="stat-value">{users.length}</div>
                </div>
                <div className="stat-card">
                    <h4>Admins</h4>
                    <div className="stat-value">{users.filter(u => u.role === 'admin').length}</div>
                </div>
                <div className="stat-card">
                    <h4>Hotel Owners</h4>
                    <div className="stat-value">{users.filter(u => u.role === 'hotel_owner').length}</div>
                </div>
                <div className="stat-card">
                    <h4>Clients</h4>
                    <div className="stat-value">{users.filter(u => u.role === 'client').length}</div>
                </div>
            </div>

            <div className="admin-table-container">
                <div className="admin-table-header">
                    <h3>{users.length} Users</h3>
                    <Button variant="action" onClick={handleAdd}>+ Add User</Button>
                </div>
                
                <Table 
                    loading={loading}
                    empty={users.length === 0}
                    emptyIcon="👥"
                    emptyText="No users yet"
                >
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Registered</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td><strong>{user.login}</strong></td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`status-badge ${user.role}`}>
                                        {roleOptions.find(r => r.value === user.role)?.label || user.role}
                                    </span>
                                </td>
                                <td>{formatDate(user.createdAt)}</td>
                                <td className="actions">
                                    <Button variant="link" onClick={() => handleEdit(user)}>Edit</Button>
                                    <Button variant="link" onClick={() => handleDelete(user.id)} style={{color: 'var(--color-error)'}}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <Modal 
                isOpen={modalOpen} 
                onClose={() => setModalOpen(false)}
                title={editingUser ? 'Edit User' : 'Add New User'}
                size="md"
            >
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Username *</label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                required
                                placeholder="Enter username"
                            />
                        </div>
                        <div className="form-group">
                            <label>Role *</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                                required
                            >
                                {roleOptions.map(role => (
                                    <option key={role.value} value={role.value}>{role.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email *</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                            placeholder="Enter email"
                        />
                    </div>

                    <div className="form-group">
                        <label>{editingUser ? 'New Password (leave empty to keep current)' : 'Password *'}</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required={!editingUser}
                            placeholder={editingUser ? 'Enter new password' : 'Enter password'}
                            minLength={6}
                        />
                    </div>

                    <div className="form-actions">
                        <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="action" type="submit">
                            {editingUser ? 'Save Changes' : 'Add User'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}

export default UserTable;
