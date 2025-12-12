import React from 'react';
import { Link } from 'react-router-dom';
import './Logo.css';

function Logo() {
    return (
        <Link to="/" className="logo-link">
            <div className="logo">
                <span className="logo-icon">🏨</span>
                <span className="logo-text">Book<span className="logo-accent">Chesco</span></span>
            </div>
        </Link>
    );
}

export default Logo;
