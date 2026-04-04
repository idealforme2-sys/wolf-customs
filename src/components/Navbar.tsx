import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, Phone, Volume2, VolumeX, X } from "lucide-react";
import { cn } from "../utils/cn";
import { Link } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase";
import Magnetic from "./Magnetic";
import { useSiteContent } from "./SiteContentProvider";
import wolfLogoImg from "../wolf.jpg";
import bgMusic from "../Morning-Routine-Lofi-Study-Music(chosic.com).mp3";

export default function Navbar() {
  const { content } = useSiteContent();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

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

    audio.volume = 0.5;

    const attemptPlay = () => {
      audio.play().then(() => {
        setIsMuted(false);
      }).catch((error) => {
        if (error.name === 'NotAllowedError') {
          console.warn("Autoplay with sound prevented by browser. Falling back to muted autoplay.");
          setIsMuted(true);
          audio.muted = true;
          audio.play().catch(console.error);
        } else {
          // It might be a loading/buffer abort, wait and try again or ignore
          console.error("Audio playback failed for another reason:", error);
        }
      });
    };

    // If already buffered enough to play, try it. Otherwise wait for it.
    if (audio.readyState >= 2) {
      attemptPlay();
    } else {
      audio.addEventListener('canplay', attemptPlay, { once: true });
    }

  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      document.body.style.overflow = "";
      return;
    }

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("resize", handleResize);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobileMenuOpen]);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    audio.muted = newMutedState;

    if (!newMutedState) {
      // If we are unmuting, make sure it's playing
      audio.play().catch(console.error);
    }
  };

  const navLinks = [
    { name: "Services", href: "#services" },
    { name: "Work", href: "#portfolio" },
    { name: "Process", href: "#process" },
    { name: "Contact", href: "#contact" },
  ];
  const ownerPortalLink = user ? "/admin/dashboard" : "/admin";
  const ownerPortalLabel = user ? "Owner Dashboard" : "Owner Login";

  const navigateToSection = (href: string) => {
    setIsMobileMenuOpen(false);

    requestAnimationFrame(() => {
      if (href === "#") {
        window.history.replaceState(null, "", window.location.pathname);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const target = document.querySelector(href);
      if (!target) {
        window.location.hash = href;
        return;
      }

      const navHeight = navRef.current?.offsetHeight ?? 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 18;
      window.history.replaceState(null, "", href);
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    });
  };

  return (
    <>
      {/* Background Audio */}
      <audio ref={audioRef} src={bgMusic} loop muted={isMuted} className="hidden" />

      {/* Top Banner */}
      <div className="relative z-[60] overflow-hidden bg-[linear-gradient(90deg,#f6ba58_0%,#ee972e_42%,#c36100_100%)] px-4 py-2.5 text-center text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-[#1b0d02] shadow-[0_10px_30px_rgba(195,97,0,0.18)] md:text-xs">
        <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,247,214,0.7)] to-transparent" />
        <span className="relative">
          {content.topBanner.text}{" "}
          <a href={content.topBanner.phoneHref} className="ml-1 font-black text-[#140901] transition-colors hover:text-[#2f1400] hover:underline">
            {content.topBanner.phoneDisplay}
          </a>
        </span>
      </div>
      <nav
        ref={navRef}
        className={cn(
          "fixed left-0 right-0 z-50 transition-all duration-500",
          "border-b",
          isScrolled
            ? "top-0 bg-wolf-black/80 backdrop-blur-xl py-2 md:py-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-wolf-gunmetal/50"
            : "top-8 md:top-9 bg-transparent py-2 md:py-8 border-transparent",
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="hidden items-center justify-between md:flex">
            <div className="flex items-center gap-6">
              <Magnetic>
                <a
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    navigateToSection("#");
                  }}
                  className="text-2xl md:text-3xl font-heading font-black tracking-[0.1em] md:tracking-widest flex items-center gap-3 group"
                >
                  <img
                    src={wolfLogoImg}
                    alt="Wolf Customs Logo"
                    className="w-12 h-12 object-cover object-center rounded-full group-hover:scale-110 transition-transform duration-500 border-2 border-wolf-gunmetal"
                  />
                  <span className="ml-2 molten-swap-primary">
                    WOLF
                  </span>
                  <span className="molten-swap-secondary">
                    CUSTOMS
                  </span>
                </a>
              </Magnetic>

              <button
                onClick={toggleMute}
                className="p-2 text-gray-400 hover:text-wolf-red transition-colors duration-300"
                aria-label={isMuted ? "Unmute background music" : "Mute background music"}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center gap-10">
              {navLinks.map((link) => (
                <Magnetic key={link.name}>
                  <a
                    href={link.href}
                    onClick={(event) => {
                      event.preventDefault();
                      navigateToSection(link.href);
                    }}
                    className="relative py-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-300 transition-colors group hover:text-white"
                  >
                    {link.name}
                    <span className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 transform bg-wolf-red transition-transform duration-300 group-hover:scale-x-100" />
                  </a>
                </Magnetic>
              ))}
              <div className="flex items-center gap-6">
                <Magnetic>
                  <Link
                    to={ownerPortalLink}
                    className={`text-[10px] font-heading font-bold tracking-widest uppercase transition-all duration-500 ${
                      user
                        ? "molten-link"
                        : "text-gray-500 hover:text-white"
                    }`}
                  >
                    {ownerPortalLabel}
                  </Link>
                </Magnetic>
                <Magnetic>
                  <a
                    href="#contact"
                    onClick={(event) => {
                      event.preventDefault();
                      navigateToSection("#contact");
                    }}
                    className="group relative inline-flex items-center justify-center overflow-hidden bg-wolf-red px-8 py-3 text-xs font-heading font-bold uppercase tracking-[0.2em] text-wolf-black shadow-[0_0_28px_rgba(243,163,55,0.22)] transition-shadow duration-500 hover:shadow-[0_0_44px_rgba(243,163,55,0.34)]"
                  >
                    <span className="relative z-10">
                      GET QUOTE
                    </span>
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,#fff7d6_0%,#ffe39f_50%,#ffbe57_100%)] origin-left scale-x-0 transform transition-transform duration-500 ease-out group-hover:scale-x-100" />
                    <div className="absolute inset-0 bg-wolf-red-hover origin-left scale-x-0 transform transition-transform duration-500 ease-out delay-75 group-hover:scale-x-100" />
                  </a>
                </Magnetic>
              </div>
            </div>
          </div>

          <div className="md:hidden">
            <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,10,10,0.96),rgba(10,10,10,0.84))] px-3 py-3 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => navigateToSection("#")}
                  className="flex min-w-0 flex-1 items-center gap-2.5 pr-1 text-left"
                >
                  <img
                    src={wolfLogoImg}
                    alt="Wolf Customs Logo"
                    className="h-10 w-10 shrink-0 rounded-full border border-white/10 object-cover object-center"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="whitespace-nowrap bg-[linear-gradient(180deg,#fff5d4_0%,#ffd676_30%,#f3a337_60%,#b84f00_100%)] bg-clip-text text-[9px] font-semibold uppercase tracking-[0.18em] text-transparent sm:text-[10px] sm:tracking-[0.22em]">
                      Wolf Customs
                    </p>
                    <p className="mt-1 hidden whitespace-nowrap text-[11px] font-heading font-bold uppercase tracking-[0.12em] text-white min-[380px]:block sm:text-sm sm:tracking-[0.18em]">
                      Quick Access
                    </p>
                  </div>
                </button>

                <div className="flex shrink-0 items-center gap-1.5">
                  <a
                    href={content.topBanner.phoneHref}
                    className="inline-flex h-10 items-center gap-1.5 rounded-full border border-wolf-red/30 bg-wolf-red/10 px-3 text-[10px] font-heading font-bold uppercase tracking-[0.12em] text-white sm:h-11 sm:gap-2 sm:px-4 sm:text-xs sm:tracking-[0.16em]"
                  >
                    <Phone className="h-4 w-4 text-wolf-red" />
                    <span className="hidden min-[380px]:inline">Call</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen((current) => !current)}
                    className="inline-flex h-10 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 text-[10px] font-heading font-bold uppercase tracking-[0.12em] text-white transition-colors hover:border-wolf-red/40 sm:h-11 sm:gap-2 sm:px-4 sm:text-xs sm:tracking-[0.16em]"
                    aria-expanded={isMobileMenuOpen}
                    aria-controls="mobile-nav-panel"
                  >
                    {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                    <span className="hidden min-[380px]:inline">Menu</span>
                  </button>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-4 gap-2">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    type="button"
                    onClick={() => navigateToSection(link.href)}
                    className="rounded-[18px] border border-white/10 bg-black/25 px-2 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-200 transition-colors hover:border-wolf-red/40 hover:text-white"
                  >
                    {link.name}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence>
              {isMobileMenuOpen ? (
                <motion.div
                  id="mobile-nav-panel"
                  initial={{ opacity: 0, y: -12, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -12, height: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,12,12,0.98),rgba(12,12,12,0.9))] p-3 shadow-[0_18px_40px_rgba(0,0,0,0.32)]">
                    <div className="grid gap-2">
                      <button
                    type="button"
                    onClick={() => navigateToSection("#contact")}
                    className="inline-flex items-center justify-between rounded-[22px] bg-[linear-gradient(135deg,#fff2c8_0%,#ffc55f_34%,#eb8f1f_68%,#a94a00_100%)] px-4 py-4 text-sm font-heading font-bold uppercase tracking-[0.18em] text-[#1a0b02]"
                  >
                    Get Quote
                    <ArrowRight className="h-4 w-4" />
                  </button>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={toggleMute}
                          className="inline-flex items-center justify-center gap-2 rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 text-xs font-heading font-bold uppercase tracking-[0.16em] text-gray-200 transition-colors hover:border-wolf-red/40 hover:text-white"
                        >
                          {isMuted ? <VolumeX className="h-4 w-4 text-wolf-red" /> : <Volume2 className="h-4 w-4 text-wolf-red" />}
                          {isMuted ? "Unmute" : "Mute"}
                        </button>

                        <Link
                          to={ownerPortalLink}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="inline-flex items-center justify-center rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 text-center text-xs font-heading font-bold uppercase tracking-[0.16em] text-gray-200 transition-colors hover:border-wolf-red/40 hover:text-white"
                        >
                          {ownerPortalLabel}
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </nav>
    </>
  );
}
