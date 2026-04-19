import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ChevronRight, MapPin } from "lucide-react";
import Magnetic from "./Magnetic";
import { useSiteContent } from "./SiteContentProvider";

const HERO_SEO_HEADING = "Adelaide's Premier Auto Restoration & Custom Paint Studio";

export default function Hero() {
  const { content } = useSiteContent();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const requestPlayback = () => {
      if (document.hidden || !video.paused) return;
      video.play().catch(() => {});
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
        return;
      }
      requestPlayback();
    };

    const handlePause = () => {
      if (!document.hidden) requestPlayback();
    };

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
      className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-wolf-black px-0 pb-24 pt-36 md:pt-32"
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
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

        <div
          className="absolute inset-0 z-10"
          style={{
            background: `
              linear-gradient(180deg, rgba(6,3,1,0.88) 0%, rgba(8,5,2,0.28) 28%, rgba(8,5,2,0.42) 58%, rgba(8,5,2,0.92) 100%),
              radial-gradient(ellipse at 50% 30%, rgba(243,163,55,0.07) 0%, transparent 55%),
              radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)
            `,
          }}
        />
      </div>

      <div className="relative z-30 mx-auto flex w-full max-w-7xl flex-col items-center px-6 text-center lg:px-8">
        <div className="flex w-full flex-col items-center gap-3 md:gap-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1 }}
            className="flex items-center justify-center gap-3 md:gap-4"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="h-[1px] w-10 bg-gradient-to-r from-transparent to-wolf-red origin-right md:w-20"
            />
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-[10px] font-heading font-bold uppercase tracking-[0.45em] text-wolf-red md:text-xs"
            >
              {HERO_SEO_HEADING}
            </motion.h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="h-[1px] w-10 bg-gradient-to-l from-transparent to-wolf-red origin-left md:w-20"
            />
          </motion.div>

          <div className="relative overflow-visible" style={{ perspective: "600px" }}>
            <div
              aria-label="Wolf Customs"
              className="flex flex-col items-center text-[15vw] font-heading font-black uppercase tracking-tight leading-[0.82] md:text-[9.5vw] lg:text-[8.5rem]"
            >
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
            </div>
          </div>

          <motion.div
            {...fadeUp(2.4)}
            className="flex w-full max-w-3xl flex-col items-center gap-2 text-center md:gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="h-[1px] w-10 bg-gradient-to-r from-transparent to-wolf-red/80" />
              <span className="text-[11px] font-heading font-bold uppercase tracking-[0.28em] text-wolf-red">
                Restoration • Custom Paint • Panel Repair
              </span>
              <div className="h-[1px] w-10 bg-gradient-to-l from-transparent to-wolf-red/80" />
            </div>

            <p className="max-w-2xl text-base font-light leading-relaxed text-gray-300 md:text-xl">
              {content.hero.description}
            </p>

            <div className="inline-flex items-center gap-2 text-[11px] font-heading font-bold uppercase tracking-[0.22em] text-gray-400">
              <MapPin className="h-4 w-4 text-wolf-red" />
              <span>Based in Salisbury South, serving Adelaide and surrounding South Australian suburbs.</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          {...fadeUp(2.7)}
          className="mt-8 flex flex-col gap-5 sm:flex-row md:mt-10"
        >
          <Magnetic>
            <a
              href="#contact"
              className="hero-cta-primary group relative flex items-center justify-center gap-3 overflow-hidden px-11 py-5 font-heading text-sm font-bold uppercase tracking-[0.22em]"
            >
              <span className="relative z-10 text-wolf-black">{content.hero.primaryCtaLabel}</span>
              <ChevronRight className="relative z-10 h-5 w-5 text-wolf-black transition-transform duration-300 group-hover:translate-x-1.5" />
              <div className="hero-cta-shine absolute inset-0 z-0" />
            </a>
          </Magnetic>

          <Magnetic>
            <a
              href="#portfolio"
              className="hero-cta-secondary group relative flex items-center justify-center overflow-hidden px-11 py-5 font-heading text-sm font-bold uppercase tracking-[0.22em] backdrop-blur-sm"
            >
              <span className="relative z-10 text-white transition-colors duration-400 group-hover:text-wolf-black">
                {content.hero.secondaryCtaLabel}
              </span>
              <div className="absolute inset-0 origin-bottom scale-y-0 bg-wolf-silver transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
            </a>
          </Magnetic>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 3 }}
        className="absolute bottom-14 right-14 z-30 hidden h-28 w-28 items-center justify-center lg:flex"
      >
        <Magnetic>
          <div className="cursor-hover relative flex h-full w-full items-center justify-center">
            <div className="hero-spin-slow absolute inset-0 rounded-full border border-wolf-red/20 border-dashed" />
            <svg
              viewBox="0 0 100 100"
              className="hero-spin-slower h-full w-full fill-current text-wolf-silver"
            >
              <path
                id="circlePath"
                d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                fill="transparent"
              />
              <text className="text-[10px] font-heading font-bold uppercase tracking-[0.2em]">
                <textPath href="#circlePath" startOffset="0%">
                  {content.hero.rotatingBadgeText}
                </textPath>
              </text>
            </svg>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-wolf-red shadow-[0_0_14px_rgba(243,163,55,0.9)]" />
            </div>
          </div>
        </Magnetic>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.4, duration: 1 }}
        className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <div className="hero-mouse-icon">
          <div className="hero-mouse-wheel" />
        </div>
        <span className="text-[8px] font-heading font-bold uppercase tracking-[0.35em] text-gray-500">
          Scroll
        </span>
      </motion.div>
    </section>
  );
}
