import React, { useState } from "react";
import "./AdminPanel.css";

import UserTable from '../../entities/AdminTables/UserTable';
import HotelTable from '../../entities/AdminTables/HotelTable';
import RoomTable from '../../entities/AdminTables/RoomTable';
import BookingTable from '../../entities/AdminTables/BookingTable';

const tabs = [
    { id: "hotels", label: "Hotels", icon: "🏨" },
    { id: "rooms", label: "Rooms", icon: "🛏️" },
    { id: "bookings", label: "Bookings", icon: "📅" },
    { id: "users", label: "Users", icon: "👥" },
];

const componentMap = {
    users: UserTable,
    hotels: HotelTable,
    rooms: RoomTable,
    bookings: BookingTable,
};

const AdminSidebar = ({ activeTab, setActiveTab }) => (
    <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
            <h2>Admin Panel</h2>
        </div>
        <nav className="admin-nav">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`admin-nav-item ${activeTab === tab.id ? "active" : ""}`}
                    onClick={() => setActiveTab(tab.id)}
                >
                    <span className="nav-icon">{tab.icon}</span>
                    <span className="nav-label">{tab.label}</span>
                </button>
            ))}
        </nav>
    </aside>
);

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState("hotels");
    const ActiveComponent = componentMap[activeTab] || (() => <div>View not found</div>);
    const currentTab = tabs.find((t) => t.id === activeTab);

    return (
        <div className="admin-panel">
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="admin-content">
                <div className="admin-content-header">
                    <div>
                        <h1>{currentTab?.icon} {currentTab?.label}</h1>
                        <p>Manage your {currentTab?.label.toLowerCase()}</p>
                    </div>
                </div>
                <ActiveComponent />
            </main>
        </div>
    );
};

export default AdminPanel;
