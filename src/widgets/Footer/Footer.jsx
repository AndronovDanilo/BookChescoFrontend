import React from 'react';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-main">
                    <div className="footer-brand">
                        <h3>BookChesco</h3>
                        <p>
                            Find and book the best hotels, apartments, and vacation rentals 
                            around the world. Your perfect stay is just a click away.
                        </p>
                    </div>
                    
                    <div className="footer-links">
                        <h4>Company</h4>
                        <ul>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Careers</a></li>
                            <li><a href="#">Press</a></li>
                            <li><a href="#">Blog</a></li>
                        </ul>
                    </div>
                    
                    <div className="footer-links">
                        <h4>Support</h4>
                        <ul>
                            <li><a href="#">Help Center</a></li>
                            <li><a href="#">Safety Info</a></li>
                            <li><a href="#">Cancellation</a></li>
                            <li><a href="#">Contact Us</a></li>
                        </ul>
                    </div>
                    
                    <div className="footer-links">
                        <h4>Legal</h4>
                        <ul>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms of Service</a></li>
                            <li><a href="#">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© 2025 BookChesco. All rights reserved.</p>
                    <div className="footer-social">
                        <a href="https://github.com/AndronovDanilo/BookChescoBackend" target="_blank" rel="noopener noreferrer">
                            <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" />
                        </a>
                        <a href="https://t.me/AzumaLive" target="_blank" rel="noopener noreferrer">
                            <img src="https://cdn-icons-png.flaticon.com/512/2111/2111646.png" alt="Telegram" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
