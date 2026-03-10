import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Volume2, VolumeX } from "lucide-react";
import { cn } from "../utils/cn";
import Magnetic from "./Magnetic";
import wolfLogoImg from "../wolf.jpg";
import bgMusic from "../Morning-Routine-Lofi-Study-Music(chosic.com).mp3";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // We keep the volume slightly lower so it's pleasant
    audio.volume = 0.5;

    const tryPlayAudio = () => {
      if (!isMuted && audio.paused) {
        audio.play().catch(() => {
          // Browser is still blocking autoplay, ignore and wait for next interaction
        });
      }
    };

    // Try playing immediately
    tryPlayAudio();

    // Attach listeners to document to unlock audio
    const unlockAudio = () => {
      tryPlayAudio();
      
      // If it successfully started playing, we don't need to aggressively listen anymore
      if (!audio.paused) {
        document.removeEventListener('click', unlockAudio);
        document.removeEventListener('scroll', unlockAudio);
        document.removeEventListener('touchstart', unlockAudio);
        document.removeEventListener('keydown', unlockAudio);
      }
    };

    document.addEventListener('click', unlockAudio, { passive: true });
    document.addEventListener('scroll', unlockAudio, { passive: true });
    document.addEventListener('touchstart', unlockAudio, { passive: true });
    document.addEventListener('keydown', unlockAudio, { passive: true });

    return () => {
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('scroll', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
    };
  }, [isMuted]);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    audio.muted = newMutedState;

    // To be absolutely certain the player behaves, we also explicitly pause or play it
    if (newMutedState) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
  };

  const navLinks = [
    { name: "Services", href: "#services" },
    { name: "Work", href: "#work" },
    { name: "Process", href: "#process" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <>
      {/* Background Audio */}
      <audio ref={audioRef} src={bgMusic} loop muted={isMuted} className="hidden" />

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
          "border-b",
          isScrolled
            ? "top-0 bg-wolf-black/80 backdrop-blur-xl py-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-wolf-gunmetal/50"
            : "top-8 md:top-9 bg-transparent py-8 border-transparent",
        )}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-6">
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

            {/* Audio Toggle */}
            <button 
              onClick={toggleMute}
              className="p-2 text-gray-400 hover:text-wolf-red transition-colors duration-300"
              aria-label={isMuted ? "Unmute background music" : "Mute background music"}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

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
