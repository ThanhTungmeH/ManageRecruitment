import Header from './Header';
import Hero from './Hero';
import About from './About';
import Services from './Service';
import Team from './Team';
import Contact from './Contact';
import Footer from './Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <About />
      <Services />
      <Team />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;