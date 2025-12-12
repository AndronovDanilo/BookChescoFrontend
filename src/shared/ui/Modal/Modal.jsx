import React from 'react';
import './Modal.css';

function Modal({ isOpen = true, onClose, title, children, size = 'md' }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className={`modal modal--${size}`} onClick={e => e.stopPropagation()}>
                {title && (
                    <div className="modal-header">
                        <h3>{title}</h3>
                        <button className="modal-close" onClick={onClose}>×</button>
                    </div>
                )}
                <div className="modal-body">
                    {children}
                </div>
                {!title && (
                    <button className="modal-close-btn" onClick={onClose}>×</button>
                )}
            </div>
        </div>
    );
}

export default Modal;
