import React from 'react';
import './Table.css';

function Table({ children, loading, empty, emptyIcon = '📋', emptyText = 'No data available' }) {
    if (loading) {
        return (
            <div className="table-loading">
                <div className="table-loading-spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (empty) {
        return (
            <div className="table-empty">
                <div className="table-empty-icon">{emptyIcon}</div>
                <p>{emptyText}</p>
            </div>
        );
    }

    return (
        <div className="table-wrapper">
            <table className="table">
                {children}
            </table>
        </div>
    );
}

export default Table;
