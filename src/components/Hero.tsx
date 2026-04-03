import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import Magnetic from "./Magnetic";
import { useSiteContent } from "./SiteContentProvider";


export default function Hero() {
  const { content } = useSiteContent();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  /* ── video playback management ── */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const requestPlayback = () => {
      if (document.hidden || !video.paused) return;
      video.play().catch(() => {});
    };

    const handleVisibilityChange = () => {
      if (document.hidden) { video.pause(); return; }
      requestPlayback();
    };

    const handlePause = () => { if (!document.hidden) requestPlayback(); };

    const handleCanPlayThrough = () => {
      setIsVideoLoaded(true);
    };

    if (video.readyState >= 4) {
      setIsVideoLoaded(true);
    }

    video.addEventListener("canplaythrough", handleCanPlayThrough);
    video.addEventListener("canplay", requestPlayback);
    video.addEventListener("pause", handlePause);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      video.removeEventListener("canplaythrough", handleCanPlayThrough);
      video.removeEventListener("canplay", requestPlayback);
      video.removeEventListener("pause", handlePause);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  /* ── intersection observer for play/pause ── */
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
          if (video.paused && !document.hidden) video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: [0, 0.3] },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);


  /* ── stagger variants ── */
  const letterVariants = {
    hidden: { opacity: 0, y: 80, rotateX: 45 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        delay: 1.3 + i * 0.07,
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] },
  });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col justify-center overflow-hidden bg-wolf-black pt-32 pb-24"
    >
      {/* ── Background video + overlays ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 overflow-hidden bg-wolf-black">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            preload="auto"
            playsInline
            disablePictureInPicture
            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ease-out ${
              isVideoLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            <source src="/hero-bg.mp4" type="video/mp4" />
          </video>
        </div>

        {/* single combined overlay instead of multiple layers */}
        <div className="absolute inset-0 z-10" style={{
          background: `
            linear-gradient(180deg, rgba(6,3,1,0.88) 0%, rgba(8,5,2,0.28) 28%, rgba(8,5,2,0.42) 58%, rgba(8,5,2,0.92) 100%),
            radial-gradient(ellipse at 50% 30%, rgba(243,163,55,0.07) 0%, transparent 55%),
            radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)
          `
        }} />
      </div>


      {/* ── Content ── */}
      <div className="relative z-30 max-w-7xl mx-auto px-6 lg:px-8 w-full flex flex-col items-center text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1 }}
          className="flex items-center gap-4 mb-8"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="h-[1px] w-10 md:w-20 bg-gradient-to-r from-transparent to-wolf-red origin-right"
          />
          <span className="text-wolf-red font-heading tracking-[0.45em] uppercase text-[10px] md:text-xs font-bold">
            {content.hero.eyebrow}
          </span>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="h-[1px] w-10 md:w-20 bg-gradient-to-l from-transparent to-wolf-red origin-left"
          />
        </motion.div>

        {/* Title */}
        <div className="overflow-visible relative mb-4" style={{ perspective: "600px" }}>
          <h1 className="text-[15vw] md:text-[9.5vw] lg:text-[8.5rem] font-heading font-black tracking-tight leading-[0.82] uppercase flex flex-col items-center">
            {/* WOLF */}
            <div className="flex overflow-visible [filter:drop-shadow(0_0_24px_rgba(255,255,255,0.12))]">
              {["W", "O", "L", "F"].map((char, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  className="hero-title-light p-[0.15em] -m-[0.15em]"
                >
                  {char}
                </motion.span>
              ))}
            </div>
            {/* CUSTOMS */}
            <div className="mt-1 flex overflow-visible [filter:drop-shadow(0_0_22px_rgba(255,195,90,0.18))]">
              {["C", "U", "S", "T", "O", "M", "S"].map((char, i) => (
                <motion.span
                  key={i}
                  custom={i + 4}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  className="hero-title-gold p-[0.15em] -m-[0.15em]"
                >
                  {char}
                </motion.span>
              ))}
            </div>
          </h1>


        </div>

        {/* Description */}
        <motion.p
          {...fadeUp(2.4)}
          className="text-lg md:text-2xl text-gray-300 max-w-2xl mb-14 font-light leading-relaxed"
        >
          {content.hero.description}
        </motion.p>

        {/* CTAs */}
        <motion.div
          {...fadeUp(2.7)}
          className="flex flex-col sm:flex-row gap-5"
        >
          <Magnetic>
            <a
              href="#contact"
              className="hero-cta-primary group relative px-11 py-5 font-heading tracking-[0.22em] uppercase overflow-hidden flex items-center justify-center gap-3 text-sm font-bold"
            >
              <span className="relative z-10 text-wolf-black">{content.hero.primaryCtaLabel}</span>
              <ChevronRight className="relative z-10 w-5 h-5 text-wolf-black group-hover:translate-x-1.5 transition-transform duration-300" />
              <div className="hero-cta-shine absolute inset-0 z-0" />
            </a>
          </Magnetic>

          <Magnetic>
            <a
              href="#portfolio"
              className="hero-cta-secondary group relative overflow-hidden px-11 py-5 font-heading tracking-[0.22em] uppercase flex items-center justify-center text-sm font-bold backdrop-blur-sm"
            >
              <span className="relative z-10 transition-colors duration-400 text-white group-hover:text-wolf-black">
                {content.hero.secondaryCtaLabel}
              </span>
              <div className="absolute inset-0 bg-wolf-silver scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
            </a>
          </Magnetic>
        </motion.div>
      </div>

      {/* ── Rotating badge (desktop) ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 3 }}
        className="absolute bottom-14 right-14 z-30 hidden lg:flex items-center justify-center w-28 h-28"
      >
        <Magnetic>
          <div className="relative w-full h-full flex items-center justify-center cursor-hover">
            <div className="hero-spin-slow absolute inset-0 border border-wolf-red/20 rounded-full border-dashed" />
            <svg
              viewBox="0 0 100 100"
              className="hero-spin-slower w-full h-full text-wolf-silver fill-current"
            >
              <path
                id="circlePath"
                d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                fill="transparent"
              />
              <text className="text-[10px] font-heading tracking-[0.2em] uppercase font-bold">
                <textPath href="#circlePath" startOffset="0%">
                  {content.hero.rotatingBadgeText}
                </textPath>
              </text>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-2 h-2 bg-wolf-red rounded-full shadow-[0_0_14px_rgba(243,163,55,0.9)]" />
            </div>
          </div>
        </Magnetic>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.4, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
      >
        <div className="hero-mouse-icon">
          <div className="hero-mouse-wheel" />
        </div>
        <span className="text-[8px] uppercase tracking-[0.35em] text-gray-500 font-heading font-bold">
          Scroll
        </span>
      </motion.div>
    </section>
  );
}
