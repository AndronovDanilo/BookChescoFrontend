import './Recommendations.css'

function Recommendations() {
    return (
        <section className="recommendations container">
            <h2>Recommended Hotels</h2>
            <div className="grid">
                <div className="card">
                    <img src="#" alt="Hotel"/>
                    <h3>Hotel Royal</h3>
                    <p>⭐ 9.1 Excellent · Paris</p>
                </div>
                <div className="card">
                    <img src="#" alt="Resort"/>
                    <h3>Beach Resort</h3>
                    <p>⭐ 8.7 Great · Dubai</p>
                </div>
                <div className="card">
                    <img src="#" alt="Apartment"/>
                    <h3>Luxury Apartment</h3>
                    <p>⭐ 9.4 Superb · London</p>
                </div>
                <div className="card">
                    <img src="#" alt="Villa"/>
                    <h3>Sunset Villa</h3>
                    <p>⭐ 9.2 Excellent · Rome</p>
                </div>
            </div>
        </section>
    )
}

export default Recommendations