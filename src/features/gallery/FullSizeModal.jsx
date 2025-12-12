import React from 'react';
import './FullSizeModal.css';

function FullSizeModal({ photo, onClose }) {
    if (!photo) return null;

    return (
        // Клик по оверлею закрывает модальное окно
        <div className="full-size-modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>×</button>
                <img src={photo.url} alt={photo.alt} className="full-size-image" />
            </div>
        </div>
    );
}

export default FullSizeModal;