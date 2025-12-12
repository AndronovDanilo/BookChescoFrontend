import React, { useState, useEffect } from 'react';
import './AuthModal.css';
import AuthForm from './ui/AuthForm';
import { useAuth } from '../../shared/context/AuthContext';

function AuthModal({ mode = "login", onClose }) {
    const { login, register, error, clearError } = useAuth();
    const [isLogin, setIsLogin] = useState(mode === "login");
    const [isLoading, setIsLoading] = useState(false);
    const [localError, setLocalError] = useState(null);
    const [formData, setFormData] = useState({
        login: "", email: "", password: "", confirmPassword: "",
    });

    useEffect(() => {
        setIsLogin(mode === "login");
        setFormData({ login: "", email: "", password: "", confirmPassword: "" });
        setLocalError(null);
        clearError();
    }, [mode, clearError]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setLocalError(null);
    };

    const handleToggleMode = () => {
        setIsLogin(!isLogin);
        setFormData({ login: "", email: "", password: "", confirmPassword: "" });
        setLocalError(null);
        clearError();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError(null);

        if (isLogin) {
            // Login validation
            if (!formData.login && !formData.email) {
                setLocalError("Please enter your username or email!");
                return;
            }
            if (!formData.password) {
                setLocalError("Please enter your password!");
                return;
            }

            setIsLoading(true);
            try {
                // Determine if input is email or login
                const credentials = formData.login.includes('@') 
                    ? { email: formData.login, password: formData.password }
                    : { login: formData.login, password: formData.password };
                
                await login(credentials);
                onClose();
            } catch (err) {
                setLocalError(err.message || "Login failed. Please check your credentials.");
            } finally {
                setIsLoading(false);
            }
        } else {
            // Registration validation
            if (!formData.login || !formData.email || !formData.password || !formData.confirmPassword) {
                setLocalError("Please fill in all fields!");
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setLocalError("Passwords do not match!");
                return;
            }
            if (formData.password.length < 6) {
                setLocalError("Password must be at least 6 characters!");
                return;
            }

            setIsLoading(true);
            try {
                await register({
                    username: formData.login,
                    email: formData.email,
                    password: formData.password,
                });
                onClose();
            } catch (err) {
                setLocalError(err.message || "Registration failed. Please try again.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="auth-container" onClick={onClose}>
            <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
                <button className="auth-close" onClick={onClose} disabled={isLoading}>✖</button>

                <h2 className="auth-title">{isLogin ? "Welcome Back" : "Create Account"}</h2>

                {(localError || error) && (
                    <div className="auth-error">
                        {localError || error}
                    </div>
                )}

                <AuthForm
                    isLogin={isLogin}
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                />

                <p className="auth-toggle">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <span onClick={!isLoading ? handleToggleMode : undefined} className={isLoading ? "disabled" : ""}>
                        {isLogin ? "Sign Up" : "Log In"}
                    </span>
                </p>
            </div>
        </div>
    );
}

export default AuthModal;
