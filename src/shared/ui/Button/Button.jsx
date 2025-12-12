import React from 'react';
import './Button.css';

function Button({ children, type = 'button', onClick, variant = 'primary', className = '', ...props }) {
    return (
        <button
            type={type}
            className={`btn btn--${variant} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;