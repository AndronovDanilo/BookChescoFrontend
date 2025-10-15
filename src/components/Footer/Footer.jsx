import './Footer.css'

function Footer() {
    return (
        <footer className="footer">
            <div className="container footer-container">
                <p>© 2025 Booking Clone. All rights reserved.</p>
                <nav className="footer-nav">
                    <a href="https://t.me/AzumaLive">About Us</a>
                    <a href="#">Support</a>
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Use</a>
                </nav>
            </div>
            <nav className="github-links">
                <a
                    href="https://github.com/AndronovDanilo/BookChescoBackend"
                    target="_blank"
                    rel="noopener noreferrer">
                    <img
                        src="https://res.cloudinary.com/de11pqvgo/image/upload/v1760450828/GithubBackend_ppeccv_jlnqje.png"
                        alt="GitHubBackEnd"
                    />
                </a>
                <a
                    href="https://github.com/AndronovDanilo/BookChescoFrontend"
                    target="_blank"
                    rel="noopener noreferrer">
                    <img
                        src="https://res.cloudinary.com/de11pqvgo/image/upload/v1760450687/GithubFrontEnd_cwdedj_rm5e8z.png"
                        alt="GitHubFrontEnd"
                    />
                </a>
            </nav>
        </footer>
    )
}

export default Footer