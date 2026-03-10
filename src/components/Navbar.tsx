import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "../utils/cn";
import Magnetic from "./Magnetic";
import wolfLogoImg from "../wolf.jpg";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Services", href: "#services" },
    { name: "Work", href: "#work" },
    { name: "Process", href: "#process" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <>
      {/* Top Banner */}
      <div className="bg-wolf-red text-white text-[10px] md:text-xs font-heading tracking-[0.2em] uppercase py-2.5 px-4 text-center relative z-60 font-bold">
        Emergency Accident? We handle your insurance paperwork. call 24/7:{" "}
        <a href="tel:0881234567" className="font-black hover:underline ml-1">
          (08) 8123 4567
        </a>
      </div>
      <nav
        className={cn(
          "fixed left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "top-0 bg-wolf-black/80 backdrop-blur-xl py-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-b border-wolf-gunmetal/50"
            : "top-8 md:top-9 bg-transparent py-8",
        )}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center">
          <Magnetic>
            <a
              href="#"
              className="text-3xl font-heading font-black tracking-widest flex items-center gap-3 group"
            >
              <img 
                src={wolfLogoImg} 
                alt="Wolf Customs Logo" 
                className="w-12 h-12 object-cover object-center rounded-full group-hover:scale-110 transition-transform duration-500 border-2 border-wolf-gunmetal"
              />
              <span className="text-wolf-red group-hover:text-white transition-colors duration-500 ml-2">WOLF</span>
              <span className="text-white group-hover:text-wolf-red transition-colors duration-500">CUSTOMS</span>
            </a>
          </Magnetic>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Magnetic key={link.name}>
                <a
                  href={link.href}
                  className="relative text-xs font-bold tracking-[0.2em] uppercase text-gray-300 hover:text-white transition-colors group py-2"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-wolf-red transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </a>
              </Magnetic>
            ))}
            <Magnetic>
              <a
                href="#contact"
                className="px-8 py-3 bg-transparent border border-wolf-red text-wolf-red hover:bg-wolf-red hover:text-white transition-all duration-500 font-heading tracking-[0.2em] text-xs font-bold uppercase relative overflow-hidden group"
              >
                <span className="relative z-10">GET QUOTE</span>
                <div className="absolute inset-0 bg-wolf-red transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out" />
              </a>
            </Magnetic>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white relative z-50 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: "-100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "-100%" }}
              transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-0 bg-wolf-black z-40 md:hidden flex flex-col justify-center items-center"
            >
              <div className="flex flex-col items-center gap-8">
                {navLinks.map((link, i) => (
                  <motion.a
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-4xl font-heading font-black tracking-widest uppercase text-white hover:text-wolf-red transition-colors"
                  >
                    {link.name}
                  </motion.a>
                ))}
                <motion.a
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  href="#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-8 px-12 py-4 bg-wolf-red text-white font-heading tracking-widest text-xl font-bold uppercase"
                >
                  GET QUOTE
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
