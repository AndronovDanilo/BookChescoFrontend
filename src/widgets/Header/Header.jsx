import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import Logo from '../../shared/ui/Logo/Logo';
import Button from '../../shared/ui/Button/Button';
import { useAuth } from '../../shared/context/AuthContext';

function Header({ onOpenAuth }) {
    const { user, isAuthenticated, logout, canAccessAdmin, isAdmin } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        logout();
        setShowDropdown(false);
    };

    const getRoleBadge = (role) => {
        const badges = {
            admin: { label: 'Admin', color: '#ef4444' },
            hotel_owner: { label: 'Hotel Owner', color: '#f59e0b' },
            manager: { label: 'Manager', color: '#10b981' },
            client: { label: 'Client', color: '#3b82f6' },
            guest: { label: 'Guest', color: '#6b7280' },
        };
        return badges[role] || badges.guest;
    };

    return (
        <header className="header">
            <div className="container header-container">
                <Logo />
                <div className="user-controls">
                    {isAuthenticated ? (
                        <div className="user-menu">
                            <button 
                                className="user-menu-trigger"
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                <div className="user-avatar">
                                    {user?.login?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <span className="user-name">{user?.login}</span>
                                <span 
                                    className="user-role-badge"
                                    style={{ backgroundColor: getRoleBadge(user?.role).color }}
                                >
                                    {getRoleBadge(user?.role).label}
                                </span>
                                <svg 
                                    className={`dropdown-arrow ${showDropdown ? 'open' : ''}`}
                                    width="12" 
                                    height="12" 
                                    viewBox="0 0 12 12"
                                >
                                    <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" fill="none"/>
                                </svg>
                            </button>

                            {showDropdown && (
                                <div className="user-dropdown">
                                    <div className="dropdown-header">
                                        <p className="dropdown-email">{user?.email}</p>
                                    </div>
                                    <div className="dropdown-divider"></div>
                                    
                                    <Link 
                                        to="/" 
                                        className="dropdown-item"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        🏠 Home
                                    </Link>
                                    
                                    <Link 
                                        to="/profile" 
                                        className="dropdown-item"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        👤 My Profile
                                    </Link>

                                    <Link 
                                        to="/profile?tab=bookings" 
                                        className="dropdown-item"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        📅 My Bookings
                                    </Link>
                                    
                                    {canAccessAdmin && (
                                        <Link 
                                            to="/my-hotels" 
                                            className="dropdown-item"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            🏨 My Hotels
                                        </Link>
                                    )}
                                    
                                    {isAdmin && (
                                        <Link 
                                            to="/admin" 
                                            className="dropdown-item"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            ⚙️ Admin Panel
                                        </Link>
                                    )}
                                    
                                    <div className="dropdown-divider"></div>
                                    
                                    <button 
                                        className="dropdown-item logout"
                                        onClick={handleLogout}
                                    >
                                        🚪 Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Button onClick={() => onOpenAuth("signup")}>Sign Up</Button>
                            <Button onClick={() => onOpenAuth("login")}>Log In</Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
