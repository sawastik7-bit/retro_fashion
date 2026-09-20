import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ActionDivider from './components/ActionDivider';
import Marquee from './components/Marquee';
import HorizontalCarousel from './components/HorizontalCarousel';
import ProductGrid from './components/ProductGrid';
import FeaturedDrop from './components/FeaturedDrop';
import LookbookGallery from './components/LookbookGallery';
import About from './components/About';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';

gsap.registerPlugin(ScrollTrigger);

const MARQUEE_ITEMS = [
  'RIOT',
  'CHAOS',
  'BLAST',
  'VENOM',
  'REBEL',
  'ANARCHY',
  'REVOLT',
  'RIOT',
  'CHAOS',
  'BLAST',
];

function App() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    ScrollTrigger.defaults({
      toggleActions: 'play none none none',
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-punk-black overflow-x-hidden">
      <CustomCursor />
      <Navbar />

      <main>
        <Hero />

        <ActionDivider />

        <div id="shop">
          <Marquee items={MARQUEE_ITEMS} speed={25} className="py-8 md:py-12" />
        </div>

        <ActionDivider />

        <HorizontalCarousel />

        <ActionDivider />

        <ProductGrid />

        <ActionDivider />

        <LookbookGallery />

        <ActionDivider />

        <div id="drops">
          <FeaturedDrop />
        </div>

        <ActionDivider />

        <div id="about">
          <About />
        </div>

        <ActionDivider />

        <Newsletter />
      </main>

      <Footer />
    </div>
  );
}

export default App;
