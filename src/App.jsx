import './App.css'

function App() {
    return (
        <div className={"AppContainer"}>
            <header className="header">
                <div className="container header-container">
                    <div className="logo">Book<span>Chesco</span></div>
                    <div className="user-controls">
                        <a href="#" className="btn">Регистрация</a>
                        <a href="#" className="btn">Войти</a>
                    </div>
                </div>
            </header>

            <section className="hero">
                <div className="container hero-container">
                    <h1>Найдите подходящее жильё</h1>
                    <p>Поиск отелей, домов и других вариантов проживания</p>

                    <form className="search-form">
                        <input type="text" placeholder="Куда вы хотите поехать?"/>
                        <input type="date"/>
                        <input type="date"/>
                        <select>
                            <option>1 взрослый · 0 детей · 1 номер</option>
                        </select>
                        <button type="submit">Искать</button>
                    </form>
                </div>
            </section>

            <section className="destinations container">
                <h2>Популярные направления</h2>
                <div className="grid">
                    <div className="card">
                        <img src="https://source.unsplash.com/400x250/?paris" alt="Paris"/>
                        <h3>Париж</h3>
                        <p>10 230 объектов размещения</p>
                    </div>
                    <div className="card">
                        <img src="https://source.unsplash.com/400x250/?rome" alt="Rome"/>
                        <h3>Рим</h3>
                        <p>8 720 объектов размещения</p>
                    </div>
                    <div className="card">
                        <img src="https://source.unsplash.com/400x250/?london" alt="London"/>
                        <h3>Лондон</h3>
                        <p>12 540 объектов размещения</p>
                    </div>
                    <div className="card">
                        <img src="https://source.unsplash.com/400x250/?dubai" alt="Dubai"/>
                        <h3>Дубай</h3>
                        <p>9 310 объектов размещения</p>
                    </div>
                </div>
            </section>

            <section className="recommendations container">
                <h2>Рекомендуемые отели</h2>
                <div className="grid">
                    <div className="card">
                        <img src="https://source.unsplash.com/400x250/?hotel" alt="Hotel"/>
                        <h3>Hotel Royal</h3>
                        <p>⭐ 9.1 Превосходно · Париж</p>
                    </div>
                    <div className="card">
                        <img src="https://source.unsplash.com/400x250/?resort" alt="Resort"/>
                        <h3>Beach Resort</h3>
                        <p>⭐ 8.7 Отлично · Дубай</p>
                    </div>
                    <div className="card">
                        <img src="https://source.unsplash.com/400x250/?apartment" alt="Apartment"/>
                        <h3>Luxury Apartment</h3>
                        <p>⭐ 9.4 Великолепно · Лондон</p>
                    </div>
                    <div className="card">
                        <img src="https://source.unsplash.com/400x250/?villa" alt="Villa"/>
                        <h3>Sunset Villa</h3>
                        <p>⭐ 9.2 Превосходно · Рим</p>
                    </div>
                </div>
            </section>

            <footer className="footer">
                <div className="container footer-container">
                    <p>© 2025 Booking Clone. Все права защищены.</p>
                    <nav className="footer-nav">
                        <a href="https://t.me/AzumaLive">О нас</a>
                        <a href="#">Служба поддержки</a>
                        <a href="#">Конфиденциальность</a>
                        <a href="#">Условия использования</a>
                    </nav>
                </div>
                <nav className="github-links">
                    <a href="https://github.com/AndronovDanilo/BookChescoBackend" target="_blank" rel="noopener noreferrer">
                        <img src="https://res.cloudinary.com/de11pqvgo/image/upload/v1760450828/GithubBackend_ppeccv_jlnqje.png"
                             alt="GitHubBackEnd"/>
                    </a>
                    <a href="https://github.com/AndronovDanilo/BookChescoFrontend" target="_blank" rel="noopener noreferrer">
                        <img src="https://res.cloudinary.com/de11pqvgo/image/upload/v1760450687/GithubFrontEnd_cwdedj_rm5e8z.png"
                             alt="GitHubFrontEnd"/>
                    </a>
                </nav>
            </footer>
        </div>
    )
}

export default App
