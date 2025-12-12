import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageShell from '../widgets/PageShell/PageShell';
import Button from '../shared/ui/Button/Button';
import { PhotoUpload } from '../shared/ui/PhotoUpload';
import { useAuth } from '../shared/context/AuthContext';
import apiService from '../shared/api/apiService';
import './ProfilePage.css';

const getStatusBadge = (status) => {
    const badges = {
        pending: { label: 'Pending', class: 'status--pending' },
        confirmed: { label: 'Confirmed', class: 'status--confirmed' },
        cancelled: { label: 'Cancelled', class: 'status--cancelled' },
        completed: { label: 'Completed', class: 'status--completed' },
    };
    return badges[status] || badges.pending;
};

function ProfilePage({ onOpenAuth }) {
    const { user, updateUser } = useAuth();
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    
    const [profileData, setProfileData] = useState({
        login: user?.login || '',
        email: user?.email || '',
    });
    
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [userPhotoUrl, setUserPhotoUrl] = useState(null);

    useEffect(() => {
        if (user) {
            setProfileData({
                login: user.login || '',
                email: user.email || '',
            });
            // Build photo URL from photoId if exists
            if (user.photoId) {
                setUserPhotoUrl(`https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo'}/image/upload/${user.photoId}`);
            }
        }
    }, [user]);

    useEffect(() => {
        if (activeTab === 'bookings') {
            fetchBookings();
        }
    }, [activeTab]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const data = await apiService.getMyBookings();
            setBookings(data);
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileChange = (e) => {
        setProfileData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handlePasswordChange = (e) => {
        setPasswordData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handlePhotoUpload = async (file) => {
        try {
            const result = await apiService.uploadUserPhoto(file);
            setUserPhotoUrl(result.url);
            setMessage({ type: 'success', text: 'Photo uploaded successfully!' });
        } catch (error) {
            setMessage({ 
                type: 'error', 
                text: error.message || 'Failed to upload photo' 
            });
            throw error;
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const updated = await apiService.updateProfile(profileData);
            updateUser(updated);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'Failed to update profile' 
            });
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            await apiService.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'Failed to change password' 
            });
        } finally {
            setSaving(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;

        try {
            await apiService.cancelBooking(bookingId);
            setBookings(prev => prev.map(b => 
                b.id === bookingId ? { ...b, status: 'cancelled' } : b
            ));
            setMessage({ type: 'success', text: 'Booking cancelled successfully' });
        } catch (error) {
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'Failed to cancel booking' 
            });
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('uk-UA', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const getRoleBadge = (role) => {
        const badges = {
            admin: { label: 'Administrator', color: '#ef4444' },
            hotel_owner: { label: 'Hotel Owner', color: '#f59e0b' },
            manager: { label: 'Manager', color: '#10b981' },
            client: { label: 'Client', color: '#3b82f6' },
        };
        return badges[role] || badges.client;
    };

    if (!user) {
        return (
            <PageShell onOpenAuth={onOpenAuth}>
                <div className="profile-page container">
                    <div className="profile-not-auth">
                        <div className="not-auth-icon">🔐</div>
                        <h2>Please log in to view your profile</h2>
                        <p>Access your bookings, personal details, and more</p>
                        <Button variant="action" onClick={() => onOpenAuth('login')}>
                            Log In
                        </Button>
                    </div>
                </div>
            </PageShell>
        );
    }

    return (
        <PageShell onOpenAuth={onOpenAuth}>
            <div className="profile-page container">
                <div className="profile-header">
                    <div className="profile-avatar-upload">
                        {userPhotoUrl ? (
                            <PhotoUpload
                                currentPhotoUrl={userPhotoUrl}
                                onUpload={handlePhotoUpload}
                                shape="circle"
                                size="large"
                                label="Change Photo"
                            />
                        ) : (
                            <PhotoUpload
                                onUpload={handlePhotoUpload}
                                shape="circle"
                                size="large"
                                label="Add Photo"
                            />
                        )}
                    </div>
                    <div className="profile-info">
                        <h1>{user.login}</h1>
                        <p>{user.email}</p>
                        <span 
                            className="profile-role-badge"
                            style={{ backgroundColor: getRoleBadge(user.role).color }}
                        >
                            {getRoleBadge(user.role).label}
                        </span>
                    </div>
                </div>

                <div className="profile-tabs">
                    <button 
                        className={`profile-tab ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        👤 Profile Settings
                    </button>
                    <button 
                        className={`profile-tab ${activeTab === 'bookings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bookings')}
                    >
                        📅 My Bookings
                    </button>
                    <button 
                        className={`profile-tab ${activeTab === 'security' ? 'active' : ''}`}
                        onClick={() => setActiveTab('security')}
                    >
                        🔒 Security
                    </button>
                </div>

                {message.text && (
                    <div className={`profile-message ${message.type}`}>
                        {message.type === 'success' ? '✅' : '❌'} {message.text}
                    </div>
                )}

                <div className="profile-content">
                    {activeTab === 'profile' && (
                        <div className="profile-section">
                            <h2>Personal Information</h2>
                            <form onSubmit={handleProfileSubmit}>
                                <div className="form-group">
                                    <label>Username</label>
                                    <input
                                        type="text"
                                        name="login"
                                        value={profileData.login}
                                        onChange={handleProfileChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={profileData.email}
                                        onChange={handleProfileChange}
                                        required
                                    />
                                </div>
                                <div className="form-actions">
                                    <Button type="submit" variant="action" disabled={saving}>
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'bookings' && (
                        <div className="profile-section">
                            <h2>My Bookings</h2>
                            {loading ? (
                                <div className="bookings-loading">
                                    <div className="loading-spinner"></div>
                                    <p>Loading your bookings...</p>
                                </div>
                            ) : bookings.length === 0 ? (
                                <div className="bookings-empty">
                                    <div className="empty-icon">🏨</div>
                                    <h3>No bookings yet</h3>
                                    <p>Start exploring and book your perfect stay!</p>
                                    <Button variant="action" onClick={() => window.location.href = '/search'}>
                                        Browse Hotels
                                    </Button>
                                </div>
                            ) : (
                                <div className="bookings-list">
                                    {bookings.map(booking => (
                                        <div key={booking.id} className="booking-card">
                                            <div className="booking-header">
                                                <h4>{booking.room?.hotel?.name || 'Hotel'}</h4>
                                                <span className={`booking-status ${getStatusBadge(booking.status).class}`}>
                                                    {getStatusBadge(booking.status).label}
                                                </span>
                                            </div>
                                            <div className="booking-details">
                                                <div className="booking-detail">
                                                    <span className="detail-label">Room</span>
                                                    <span className="detail-value">
                                                        {booking.room?.type || `Room #${booking.roomId}`}
                                                    </span>
                                                </div>
                                                <div className="booking-detail">
                                                    <span className="detail-label">Check-in</span>
                                                    <span className="detail-value">
                                                        {formatDate(booking.dateInRoom)}
                                                    </span>
                                                </div>
                                                <div className="booking-detail">
                                                    <span className="detail-label">Check-out</span>
                                                    <span className="detail-value">
                                                        {formatDate(booking.dateOutRoom)}
                                                    </span>
                                                </div>
                                                {booking.amount && (
                                                    <div className="booking-detail">
                                                        <span className="detail-label">Total</span>
                                                        <span className="detail-value price">
                                                            {booking.amount} ₴
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            {booking.status === 'pending' && (
                                                <div className="booking-actions">
                                                    <Button 
                                                        variant="link" 
                                                        onClick={() => handleCancelBooking(booking.id)}
                                                    >
                                                        Cancel Booking
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="profile-section">
                            <h2>Change Password</h2>
                            <form onSubmit={handlePasswordSubmit}>
                                <div className="form-group">
                                    <label>Current Password</label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>New Password</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Confirm New Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                </div>
                                <div className="form-actions">
                                    <Button type="submit" variant="action" disabled={saving}>
                                        {saving ? 'Changing...' : 'Change Password'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </PageShell>
    );
}

export default ProfilePage;

