import './App.css'

function App() {
    return (
        <div className={"AppContainer"}>
            <header>
                <h1><strong>MyHotel</strong></h1>
                <nav>
                    <a href="#">Recently viewed</a>
                    <a href="#">Favorites</a>
                    <a href="#">
                        <img src={"https://res.cloudinary.com/de11pqvgo/image/upload/v1759249153/GuestAvatar_q598lb.png"} alt={"Profile"}/>
                    </a>
                    <button>Menu</button>
                </nav>
            </header>

            <main>
                <section id="searching">
                    <input type="text" placeholder="Enter city or hotel"/>
                    <button className={"DataSelect"}>Select dates</button>
                    <button className={"BlueButton"}>Search</button>
                </section>

                <h2 className={"HotelListsTitle"}>Hot hotel deals right now</h2>

                <div className={"HotelLists"}>
                    <div>
                        <ul>
                            <li>
                                <a href={"#"}>
                                    <img
                                        src="https://st2.depositphotos.com/1000975/11773/i/450/depositphotos_117733132-stock-photo-modern-hotel-room-with-big.jpg"
                                        alt="Hotel 1"/>
                                    <h3>Dubai</h3>
                                    <h3>Price: 150$ / night</h3>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <h2 className={"HotelListsTitle"}>Popular searches</h2>

                <div className={"HotelLists"}>
                    <div>
                        <ul>
                            <li>
                                <a href={"#"}>
                                    <img
                                        src="https://media.istockphoto.com/id/627892060/ru/%D1%84%D0%BE%D1%82%D0%BE/%D0%BB%D1%8E%D0%BA%D1%81-%D0%BD%D0%BE%D0%BC%D0%B5%D1%80-%D0%BE%D1%82%D0%B5%D0%BB%D1%8F-%D1%81-%D0%B2%D0%B8%D0%B4%D0%BE%D0%BC.jpg?s=612x612&w=0&k=20&c=xrtKwGNcmnyfBMbZvJ8BGTzmaW40YZzO0XbrwTUDAyY="
                                        alt="Hotel 1"/>
                                    <h3>Paris</h3>
                                    <h3>Price: 200$ / night</h3>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </main>

            <footer>
                <div>
                    <a href="#">About me</a>
                    <a href="#">Help</a>
                </div>
                <div>
                    <a href="https://github.com/AndronovDanilo/MyHotelFrontend" target="_blank" rel="noopener noreferrer">
                    <img src="https://res.cloudinary.com/de11pqvgo/image/upload/v1759329103/GithubFrontEnd_cwdedj.png" alt="front"/>
                    </a>
                    <a href="https://github.com/AndronovDanilo/MyHotelBackend" target="_blank" rel="noopener noreferrer">
                    <img src="https://res.cloudinary.com/de11pqvgo/image/upload/v1759329192/GithubBackend_ppeccv.png" alt="back"/>
                    </a>
                </div>
            </footer>
        </div>
    )
}

export default App
