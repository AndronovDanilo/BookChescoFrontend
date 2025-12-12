import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function ProtectedRoute({ children, requiredRoles, onOpenAuth }) {
    const { user, loading, isAuthenticated, hasRole } = useAuth();
    const location = useLocation();

    useEffect(() => {
        // If not authenticated, open login modal
        if (!loading && !isAuthenticated && onOpenAuth) {
            onOpenAuth('login');
        }
    }, [loading, isAuthenticated, onOpenAuth]);

    // Show loading state
    if (loading) {
        return (
            <div className="loading-container" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)',
                color: '#f8fafc'
            }}>
                <div className="loading-spinner">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    // If not authenticated, redirect to home
    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // Check role permissions
    if (requiredRoles && requiredRoles.length > 0) {
        if (!hasRole(requiredRoles)) {
            return (
                <div className="access-denied" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)',
                    color: '#f8fafc',
                    textAlign: 'center',
                    padding: '2rem'
                }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#ef4444' }}>
                        🚫 Access Denied
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: '#9ca3af', marginBottom: '2rem' }}>
                        You don't have permission to access this page.
                    </p>
                    <p style={{ color: '#6b7280' }}>
                        Required roles: {requiredRoles.join(', ')}
                    </p>
                    <a 
                        href="/" 
                        style={{
                            marginTop: '2rem',
                            padding: '0.75rem 2rem',
                            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '10px',
                            fontWeight: '600'
                        }}
                    >
                        Go Back Home
                    </a>
                </div>
            );
        }
    }

    return children;
}

export default ProtectedRoute;


