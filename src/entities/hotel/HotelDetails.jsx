import React from 'react';
import { HOTEL_DETAILS } from '../../shared/data/hotelData'; // Импорт данных

function HotelDetails() {
    const { name, city, address, minPrice, currency } = HOTEL_DETAILS;

    return (
        <div className="hotel-details-header container">
            <h1>{name}</h1>
            <p className="location-info">{address}, {city}</p>

            <div className="price-tag">
                <p>Мин. цена за ночь:</p>
                <strong>{minPrice} {currency}</strong>
            </div>
        </div>
    );
}
export default HotelDetails;