import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from '../pages/HomePage';
import AdminPage from '../pages/AdminPage';
import HotelPage from '../pages/HotelPage';
import SearchPage from '../pages/SearchPage';
import ProfilePage from '../pages/ProfilePage';
import MyHotelsPage from '../pages/MyHotelsPage';
import HotelManagementPage from '../pages/HotelManagementPage';

import AuthModal from '../features/auth/AuthModal';
import { AuthProvider } from '../shared/context/AuthContext';
import ProtectedRoute from '../shared/ui/ProtectedRoute/ProtectedRoute';

function App() {
    const [authMode, setAuthMode] = useState(null);
    const handleCloseAuth = () => setAuthMode(null);

    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route
                        path="/"
                        element={<HomePage onOpenAuth={setAuthMode} />}
                    />

                    <Route
                        path="/search"
                        element={<SearchPage onOpenAuth={setAuthMode} />}
                    />

                    <Route
                        path="/hotel/:id"
                        element={<HotelPage onOpenAuth={setAuthMode} />}
                    />

                    <Route
                        path="/profile"
                        element={<ProfilePage onOpenAuth={setAuthMode} />}
                    />

                    <Route
                        path="/my-hotels"
                        element={
                            <ProtectedRoute 
                                requiredRoles={['admin', 'hotel_owner', 'manager']}
                                onOpenAuth={setAuthMode}
                            >
                                <MyHotelsPage onOpenAuth={setAuthMode} />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/manage-hotel/:id"
                        element={
                            <ProtectedRoute 
                                requiredRoles={['admin', 'hotel_owner', 'manager']}
                                onOpenAuth={setAuthMode}
                            >
                                <HotelManagementPage onOpenAuth={setAuthMode} />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute 
                                requiredRoles={['admin']}
                                onOpenAuth={setAuthMode}
                            >
                                <AdminPage onOpenAuth={setAuthMode} />
                            </ProtectedRoute>
                        }
                    />
                </Routes>

                {authMode ? (
                    <AuthModal
                        mode={authMode}
                        onClose={handleCloseAuth}
                    />
                ) : null}
            </Router>
        </AuthProvider>
    );
}

export default App;
