import React from 'react';
import './Card.css';

function Card({ 
    imageUrl, 
    title, 
    description, 
    location,
    rating,
    ratingText,
    reviewCount,
    price,
    nights,
    badge,
    variant = 'default',
    children 
}) {
    if (variant === 'destination') {
        return (
            <div className="card card-destination">
                <div className="card-image">
                    <img src={imageUrl} alt={title} />
                    <div className="card-overlay">
                        <h3>{title}</h3>
                        {description && <p>{description}</p>}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="card-image">
                <img src={imageUrl} alt={title} />
                {badge && <span className="card-badge">{badge}</span>}
            </div>
            <div className="card-content">
                <h3>{title}</h3>
                
                {location && (
                    <p className="card-location">📍 {location}</p>
                )}
                
                {description && <p>{description}</p>}
                
                {rating && (
                    <div className="card-rating">
                        <span className="card-rating-score">{rating}</span>
                        <span className="card-rating-text">
                            <strong>{ratingText}</strong>
                            {reviewCount && <span> · {reviewCount} reviews</span>}
                        </span>
                    </div>
                )}
                
                {price && (
                    <div className="card-price">
                        <div className="price-label">Starting from</div>
                        <div className="price-value">${price}</div>
                        {nights && <div className="price-nights">{nights} nights</div>}
                    </div>
                )}
                
                {children}
            </div>
        </div>
    );
}

export default Card;
