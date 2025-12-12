import React, { useState } from 'react';
import FullSizeModal from './FullSizeModal';
import './PhotoGallery.css';

function PhotoGallery({ photos }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const totalPhotos = photos.length;
    const currentPhoto = photos[currentImageIndex];

    const goToPrevious = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? totalPhotos - 1 : prevIndex - 1
        );
    };

    const goToNext = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === totalPhotos - 1 ? 0 : prevIndex + 1
        );
    };

    const showNavButtons = totalPhotos > 1;

    return (
        <div className="photo-gallery-slider">
            <div className="slider-wrapper">

                {showNavButtons && (
                    <button className="slider-nav-btn prev" onClick={goToPrevious}>
                        &#10094;
                    </button>
                )}

                <img
                    src={currentPhoto.url}
                    alt={currentPhoto.alt}
                    onClick={() => setSelectedPhoto(currentPhoto)}
                    className="slider-main-photo"
                />

                {showNavButtons && (
                    <button className="slider-nav-btn next" onClick={goToNext}>
                        &#10095;
                    </button>
                )}
            </div>

            <FullSizeModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
        </div>
    );
}

export default PhotoGallery;