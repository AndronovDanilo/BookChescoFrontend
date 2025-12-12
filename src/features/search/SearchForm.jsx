import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchForm.css';

function SearchForm() {
    const navigate = useNavigate();
    const [location, setLocation] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState('2 adults · 0 children · 1 room');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const params = new URLSearchParams();
        if (location) params.set('city', location);
        if (checkIn) params.set('checkIn', checkIn);
        if (checkOut) params.set('checkOut', checkOut);
        params.set('guests', guests);
        
        navigate(`/search?${params.toString()}`);
    };

    // Get today's date for min date
    const today = new Date().toISOString().split('T')[0];

    return (
        <form className="search-form" onSubmit={handleSubmit}>
            <div className="search-field location">
                <span className="field-icon">🛏️</span>
                <input 
                    type="text" 
                    placeholder="Where are you going?"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
            </div>
            <div className="search-field">
                <span className="field-icon">📅</span>
                <input 
                    type="date" 
                    placeholder="Check-in"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={today}
                />
            </div>
            <div className="search-field">
                <span className="field-icon">📅</span>
                <input 
                    type="date" 
                    placeholder="Check-out"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || today}
                />
            </div>
            <div className="search-field">
                <span className="field-icon">👥</span>
                <select value={guests} onChange={(e) => setGuests(e.target.value)}>
                    <option>1 adult · 0 children · 1 room</option>
                    <option>2 adults · 0 children · 1 room</option>
                    <option>2 adults · 1 child · 1 room</option>
                    <option>2 adults · 2 children · 1 room</option>
                    <option>3 adults · 0 children · 2 rooms</option>
                </select>
            </div>
            <button type="submit" className="search-btn">Search</button>
        </form>
    );
}

export default SearchForm;
