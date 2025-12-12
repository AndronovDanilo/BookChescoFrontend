import React, { useState } from 'react';
import './PhotoGallery.css';

function PhotoGallery({ 
  photos = [], 
  onUpload, 
  onDelete,
  maxPhotos = 10,
  disabled = false
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      await onUpload(file);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (photoId) => {
    if (onDelete && !isUploading) {
      try {
        await onDelete(photoId);
      } catch (err) {
        setError(err.message || 'Delete failed');
      }
    }
  };

  const canAddMore = photos.length < maxPhotos && !disabled;

  return (
    <div className="photo-gallery">
      <div className="photo-gallery-grid">
        {photos.map((photo) => (
          <div key={photo.id} className="photo-gallery-item">
            <img src={photo.url} alt="Gallery item" />
            {!disabled && onDelete && (
              <button 
                type="button"
                className="delete-btn"
                onClick={() => handleDelete(photo.id)}
                title="Delete photo"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        {canAddMore && (
          <label className={`photo-gallery-add ${isUploading ? 'uploading' : ''}`}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={disabled || isUploading}
              className="visually-hidden"
            />
            {isUploading ? (
              <>
                <div className="spinner"></div>
                <span className="text">Uploading...</span>
              </>
            ) : (
              <>
                <span className="icon">📷</span>
                <span className="text">Add Photo</span>
              </>
            )}
          </label>
        )}
      </div>

      {error && <p className="photo-gallery-error">{error}</p>}
      
      <p className="photo-gallery-info">
        {photos.length} / {maxPhotos} photos uploaded
      </p>
    </div>
  );
}

export default PhotoGallery;
