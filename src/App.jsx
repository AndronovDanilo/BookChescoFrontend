import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
import Destinations from './components/Destinations/Destinations'
import Recommendations from './components/Recommendations/Recommendations'
import Footer from './components/Footer/Footer'

function App() {
    return (
        <div className={"AppContainer"}>
            <Header />
            <Hero />
            <Destinations />
            <Recommendations />
            <Footer />
        </div>
    )
}

export default App
