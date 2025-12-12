import React from 'react';
import PageShell from '../widgets/PageShell/PageShell';

import Hero from '../widgets/hero/Hero';
import LocationSearchList from '../entities/location/LocationSearchList';
import RecommendedHotels from '../entities/hotel/RecommendedHotels';

function HomePage({ onOpenAuth }) {
    return (
        <PageShell onOpenAuth={onOpenAuth}>
            <Hero />
            <LocationSearchList />
            <RecommendedHotels />
        </PageShell>
    );
}

export default HomePage;