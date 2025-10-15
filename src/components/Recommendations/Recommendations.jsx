import './Recommendations.css'

function Recommendations() {
    return (
        <section className="recommendations container">
            <h2>Recommended Hotels</h2>
            <div className="grid">
                <div className="card">
                    <img src="https://source.unsplash.com/400x250/?hotel" alt="Hotel"/>
                    <h3>Hotel Royal</h3>
                    <p>⭐ 9.1 Excellent · Paris</p>
                </div>
                <div className="card">
                    <img src="https://source.unsplash.com/400x250/?resort" alt="Resort"/>
                    <h3>Beach Resort</h3>
                    <p>⭐ 8.7 Great · Dubai</p>
                </div>
                <div className="card">
                    <img src="https://source.unsplash.com/400x250/?apartment" alt="Apartment"/>
                    <h3>Luxury Apartment</h3>
                    <p>⭐ 9.4 Superb · London</p>
                </div>
                <div className="card">
                    <img src="https://source.unsplash.com/400x250/?villa" alt="Villa"/>
                    <h3>Sunset Villa</h3>
                    <p>⭐ 9.2 Excellent · Rome</p>
                </div>
            </div>
        </section>
    )
}

export default Recommendations