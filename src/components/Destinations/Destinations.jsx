import './Destinations.css'

function Destinations() {
    return (
        <section className="destinations container">
            <h2>Popular Destinations</h2>
            <div className="grid">
                <div className="card">
                    <img src="#" alt="Paris" />
                    <h3>Paris</h3>
                    <p>10,230 places to stay</p>
                </div>
                <div className="card">
                    <img src="#" alt="Rome" />
                    <h3>Rome</h3>
                    <p>8,720 places to stay</p>
                </div>
                <div className="card">
                    <img src="#" alt="London" />
                    <h3>London</h3>
                    <p>12,540 places to stay</p>
                </div>
                <div className="card">
                    <img src="#" alt="Dubai" />
                    <h3>Dubai</h3>
                    <p>9,310 places to stay</p>
                </div>
            </div>
        </section>
    )
}

export default Destinations