import './Header.css'

function Header() {
    return(
        <header className="header">
            <div className="container header-container">
                <div className="logo">Book<span>Chesco</span></div>
                <div className="user-controls">
                    <a href="#" className="btn">Sign Up</a>
                    <a href="#" className="btn">Log In</a>
                </div>
            </div>
        </header>
    )
}

export default Header