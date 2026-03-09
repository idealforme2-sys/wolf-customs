import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import BeforeAfter from "./components/BeforeAfter";
import Gallery from "./components/Gallery";
import Portfolio from "./components/Portfolio";
import Process from "./components/Process";
import Trust from "./components/Trust";
import FAQ from "./components/FAQ";
import CTA from "./components/CTA";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Preloader from "./components/Preloader";
import CustomCursor from "./components/CustomCursor";

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="min-h-screen bg-wolf-black text-white selection:bg-wolf-red selection:text-white relative">
      <div className="noise-bg" />
      <CustomCursor />
      
      <AnimatePresence mode="wait">
        {loading && <Preloader key="preloader" onComplete={() => setLoading(false)} />}
      </AnimatePresence>
      
      <Navbar />
      <main>
        <Hero />
        <Services />
        <BeforeAfter />
        <Gallery />
        <Portfolio />
        <Process />
        <Trust />
        <FAQ />
        <CTA />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
