import React from 'react';
import { ROOMS_DATA, HOTEL_DETAILS } from '../../shared/data/hotelData';import Button from '../../shared/ui/Button/Button';

function RoomList() {
    return (
        <div className="room-list">
            {ROOMS_DATA.map((room) => (
                <div
                    key={room.id}
                    className={`room-item ${room.isAvailable ? 'available' : 'unavailable'}`}
                >
                    <div className="room-info">
                        <h4>{room.type} ({room.capacity} чел.)</h4>
                        <p>Цена: {room.price} {HOTEL_DETAILS.currency}</p>
                    </div>
                    <div className="room-status">
                        {room.isAvailable ? (
                            <Button variant="primary">Забронировать</Button> // Синяя кнопка
                        ) : (
                            <Button className="unavailable-btn" disabled>Занято</Button> // Серая кнопка
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
export default RoomList;