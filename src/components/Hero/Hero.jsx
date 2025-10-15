import './Hero.css'

function Hero() {
    return(
        <section className="hero">
            <div className="container hero-container">
                <h1>Find your perfect stay</h1>
                <p>Search hotels, houses, and other accommodation options</p>

                <form className="search-form">
                    <input type="text" placeholder="Where do you want to go?" />
                    <input type="date" />
                    <input type="date" />
                    <select>
                        <option>1 adult · 0 children · 1 room</option>
                    </select>
                    <button type="submit">Search</button>
                </form>
            </div>
        </section>
    )
}

export default Hero