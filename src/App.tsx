import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import BeforeAfter from "./components/BeforeAfter";
import Gallery from "./components/Gallery";
import Portfolio from "./components/Portfolio";
import PortfolioV2Links from "./components/PortfolioV2Links";
import PortfolioV3Embed from "./components/PortfolioV3Embed";
import Process from "./components/Process";
import Trust from "./components/Trust";
import FAQ from "./components/FAQ";
import CTA from "./components/CTA";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Preloader from "./components/Preloader";
import CustomCursor from "./components/CustomCursor";
import { SiteContentProvider } from "./components/SiteContentProvider";
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import QuotesDashboard from "./admin/QuotesDashboard";
import OverviewDashboard from "./admin/OverviewDashboard";
import ProtectedRoute from "./admin/ProtectedRoute";
import ContentDashboard from "./admin/ContentDashboard";

function PublicSite() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="site-theme relative min-h-screen bg-wolf-black text-wolf-silver selection:bg-wolf-red selection:text-wolf-black">
      <div className="noise-bg" />
      
      <AnimatePresence mode="wait">
        {loading && <Preloader key="preloader" onComplete={() => setLoading(false)} />}
      </AnimatePresence>
      
      <Navbar />
      <main>
        <Hero />
        <Services />
        <BeforeAfter />
        <Gallery />
        {/* <Portfolio /> */}
        <PortfolioV2Links />
        {/* <PortfolioV3Embed /> */}
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

export default function App() {
  return (
    <BrowserRouter>
      <SiteContentProvider>
        <CustomCursor />
        <Routes>
          <Route path="/" element={<PublicSite />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route path="/admin/content" element={<ContentDashboard />} />
            <Route path="/admin/quotes" element={<QuotesDashboard />} />
            <Route path="/admin/dashboard" element={<OverviewDashboard />} />
          </Route>
        </Routes>
      </SiteContentProvider>
    </BrowserRouter>
  );
}
