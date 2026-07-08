import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Home from './pages/Home';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      <Hero />
      <Home />
      <Footer />
    </div>
  );
}

export default App;
