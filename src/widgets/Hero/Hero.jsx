import React from 'react';
import './Hero.css';
import SearchForm from '../../features/search/SearchForm';

function Hero() {
    return(
        <section className="hero">
            <div className="container hero-container">
                <h1>Find your perfect stay</h1>
                <p>Search hotels, houses, and other accommodation options</p>
                <SearchForm />
            </div>
        </section>
    )
}

export default Hero;