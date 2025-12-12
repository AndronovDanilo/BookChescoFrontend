import React, { useState } from 'react';
import { HOTEL_TABS } from '../../shared/data/hotelData';
import RoomList from '../../entities/room/RoomList';
import './HotelTabs.css';

const DescriptionContent = ({ description }) => (
    <div className="tab-content description-text">
        <p>{description}</p>
    </div>
);

function HotelTabs({ hotelDetails }) {
    const [activeTab, setActiveTab] = useState('description');

    const renderContent = () => {
        switch (activeTab) {
            case 'description':
                return <DescriptionContent description={hotelDetails.description} />;
            case 'rooms':
                return <RoomList />;
            default:
                return null;
        }
    };

    return (
        <div className="hotel-tabs container">
            <div className="tabs-navigation">
                {HOTEL_TABS.map(tab => (
                    <button
                        key={tab.id}
                        className={activeTab === tab.id ? 'active' : ''}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="tabs-content-wrapper">
                {renderContent()}
            </div>
        </div>
    );
}
export default HotelTabs;