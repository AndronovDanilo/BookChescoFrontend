import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
import Destinations from './components/Destinations/Destinations'
import Recommendations from './components/Recommendations/Recommendations'
import Footer from './components/Footer/Footer'
import Authentication from "./components/Authentication/Authentication.jsx";
import { useState } from 'react'

function App() {
    const [showAuth, setShowAuth] = useState(false);
    const [authMode, setAuthMode] = useState("login");
    return (
        <div className={"AppContainer"}>
            <Header
                onOpenAuth={(mode) => {
                    setAuthMode(mode);
                    setShowAuth(true);
                }}
            />
            {showAuth && (
                <Authentication
                    mode={authMode}
                    onClose={() => setShowAuth(false)}
                />
            )}
            <Hero />
            <Destinations />
            <Recommendations />
            <Footer />
        </div>
    )
}

export default App
