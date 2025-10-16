import React, { useState } from 'react';
import './Authentication.css';

function Authentication({ mode = "login", onClose }) {
    const [isLogin, setIsLogin] = useState(mode === "login");
    const [formData, setFormData] = useState({
        login: "", email: "", password: "", confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            if (!formData.login && !formData.email) {
                alert("Please enter your username or email!");
                return;
            }
            if (!formData.password) {
                alert("Please enter your password!");
                return;
            }
            alert(`Logged in as: ${formData.login || formData.email}`);
        } else {
            if (!formData.login || !formData.email || !formData.password || !formData.confirmPassword) {
                alert("Please fill in all fields!");
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                alert("Passwords do not match!");
                return;
            }
            alert(`Registration successful! Welcome, ${formData.login}`);
        }
    };

    return (
        <div className="auth-container" onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()}>
                <button className="auth-close" onClick={onClose}>✖</button>
                <form onSubmit={handleSubmit}>
                    {isLogin ? (
                        <>
                            <input
                                type="text"
                                name="login"
                                placeholder="Username or Email"
                                value={formData.login}
                                onChange={handleChange}
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </>
                    ) : (
                        <>
                            <input
                                type="text"
                                name="login"
                                placeholder="Username"
                                value={formData.login}
                                onChange={handleChange}
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </>
                    )}
                    <button type="submit">{isLogin ? "Log In" : "Sign Up"}</button>
                </form>
                <p>
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <span
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setFormData({ login: "", email: "", password: "", confirmPassword: "" });
                        }}
                    >
                        {isLogin ? "Sign Up" : "Log In"}
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Authentication;