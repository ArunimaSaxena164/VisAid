import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import Problem from "./components/Problem"
import Features from "./components/Features"
import HowItWorks from "./components/HowItWorks"
import Architecture from "./components/Architecture"
import Download from "./components/Download"
import Footer from "./components/Footer"

function App() {
  return (
    <div className="min-h-screen text-white">

      <Navbar />
      <Hero />
      <Problem />
      <Features />
      <HowItWorks />
      <Architecture />
      <Download />
      <Footer />

    </div>
  )
}

export default App