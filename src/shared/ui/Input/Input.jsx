import React from 'react';
import './Input.css';

function Input({ type = 'text', placeholder, value, onChange, name, className = '', ...props }) {
    return (
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={className}
            {...props}
        />
    );
}

export default Input;