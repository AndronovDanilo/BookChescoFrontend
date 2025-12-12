import React, { useState } from 'react';
import './PhotoUpload.css';

function PhotoUpload({ 
  currentPhotoUrl, 
  onUpload, 
  onDelete,
  shape = 'square',
  size = 'medium',
  label = 'Upload Photo',
  accept = 'image/*',
  disabled = false
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(null);
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

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    setIsUploading(true);
    try {
      await onUpload(file);
      setPreview(null);
    } catch (err) {
      setError(err.message || 'Upload failed');
      setPreview(null);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete && !isUploading) {
      try {
        await onDelete();
      } catch (err) {
        setError(err.message || 'Delete failed');
      }
    }
  };

  const displayUrl = preview || currentPhotoUrl;

  return (
    <div className={`photo-upload photo-upload--${shape} photo-upload--${size}`}>
      <label className={`photo-upload-area ${disabled ? 'disabled' : ''} ${isUploading ? 'uploading' : ''}`}>
        <input
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          disabled={disabled || isUploading}
          className="visually-hidden"
        />
        {displayUrl ? (
          <>
            <img src={displayUrl} alt="Preview" className="photo-upload-preview" />
            {!disabled && onDelete && !isUploading && (
              <button 
                type="button"
                className="photo-upload-delete"
                onClick={handleDelete}
                title="Remove photo"
              >
                ✕
              </button>
            )}
          </>
        ) : (
          <div className="photo-upload-placeholder">
            <span className="photo-upload-icon">📷</span>
            <span className="photo-upload-label">{label}</span>
          </div>
        )}

        {isUploading && (
          <div className="photo-upload-loading">
            <div className="spinner"></div>
            <span>Uploading...</span>
          </div>
        )}
      </label>

      {error && <p className="photo-upload-error">{error}</p>}
    </div>
  );
}

export default PhotoUpload;
