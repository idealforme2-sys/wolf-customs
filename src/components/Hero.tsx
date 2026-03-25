import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import Magnetic from "./Magnetic";
import { useSiteContent } from "./SiteContentProvider";

export default function Hero() {
  const { content } = useSiteContent();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let replayTimeout: number | null = null;

    const clearReplayTimeout = () => {
      if (replayTimeout !== null) {
        window.clearTimeout(replayTimeout);
        replayTimeout = null;
      }
    };

    const requestPlayback = () => {
      if (document.hidden) return;
      clearReplayTimeout();
      replayTimeout = window.setTimeout(() => {
        video.play().catch(() => {});
      }, 80);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearReplayTimeout();
        video.pause();
        return;
      }

      requestPlayback();
    };

    video.addEventListener("canplay", requestPlayback);
    video.addEventListener("playing", clearReplayTimeout);
    video.addEventListener("waiting", requestPlayback);
    video.addEventListener("stalled", requestPlayback);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearReplayTimeout();
      video.removeEventListener("canplay", requestPlayback);
      video.removeEventListener("playing", clearReplayTimeout);
      video.removeEventListener("waiting", requestPlayback);
      video.removeEventListener("stalled", requestPlayback);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const textVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 1.5 + i * 0.1,
        duration: 1,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center overflow-hidden bg-wolf-black pt-32 pb-24">
      {/* Dynamic Background Video */}
      <div className="absolute inset-0 z-0 isolate [contain:paint]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,218,134,0.14),transparent_30%),linear-gradient(180deg,#110b05_0%,#060301_100%)]" />
        <div className="absolute inset-0 overflow-hidden [backface-visibility:hidden] [contain:paint] [transform:translateZ(0)]">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            preload="auto"
            playsInline
            disablePictureInPicture
            onLoadedData={() => setVideoReady(true)}
            className={`absolute inset-0 h-full w-full object-cover object-center [backface-visibility:hidden] [transform:translateZ(0)] [will-change:transform,opacity] transition-opacity duration-700 ${videoReady ? "opacity-100" : "opacity-0"}`}
          >
            <source src="/hero-background.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(8,5,2,0.84)_0%,rgba(8,5,2,0.36)_36%,rgba(8,5,2,0.58)_70%,rgba(8,5,2,0.9)_100%),radial-gradient(circle_at_center,rgba(255,204,110,0.1)_0%,transparent_58%)]" />
        <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_top,rgba(255,241,192,0.08)_0%,transparent_28%),linear-gradient(105deg,rgba(0,0,0,0.18)_0%,transparent_24%,rgba(255,224,149,0.05)_46%,transparent_62%,rgba(0,0,0,0.14)_100%)] opacity-90" />
      </div>

      <div className="relative z-30 max-w-7xl mx-auto px-6 lg:px-8 w-full flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="h-[1px] w-8 md:w-16 bg-wolf-red" />
          <span className="text-wolf-red font-heading tracking-[0.4em] uppercase text-xs md:text-sm font-bold">
            {content.hero.eyebrow}
          </span>
          <div className="h-[1px] w-8 md:w-16 bg-wolf-red" />
        </motion.div>

        <div className="overflow-visible relative mb-6">
          <h1 className="text-[14vw] md:text-[9vw] lg:text-[8rem] font-heading font-black tracking-normal leading-[0.85] uppercase flex flex-col items-center">
            <div className="flex overflow-visible [filter:drop-shadow(0_0_18px_rgba(255,255,255,0.16))]">
              {["W", "O", "L", "F"].map((char, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  className="bg-[linear-gradient(180deg,#ffffff_0%,#fffdf8_22%,#f3eee4_58%,#cfc6b7_100%)] bg-clip-text text-transparent [-webkit-text-stroke:0.35px_rgba(255,255,255,0.2)] p-[0.2em] -m-[0.2em]"
                >
                  {char}
                </motion.span>
              ))}
            </div>
            <div className="mt-2 flex overflow-visible [filter:drop-shadow(0_0_18px_rgba(255,212,122,0.16))]">
              {["C", "U", "S", "T", "O", "M", "S"].map((char, i) => (
                <motion.span
                  key={i}
                  custom={i + 4}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  className="bg-[linear-gradient(180deg,#fff8dc_0%,#ffe199_18%,#ffc45d_42%,#f39a32_64%,#cf6c0a_84%,#7f3000_100%)] bg-clip-text text-transparent [-webkit-text-stroke:0.35px_rgba(255,242,214,0.14)] p-[0.2em] -m-[0.2em]"
                >
                  {char}
                </motion.span>
              ))}
            </div>
          </h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.5 }}
          className="text-lg md:text-2xl text-gray-300 max-w-3xl mb-12 font-light leading-relaxed"
        >
          {content.hero.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.8 }}
          className="flex flex-col sm:flex-row gap-6"
        >
          <Magnetic>
            <a
              href="#contact"
              className="group relative px-10 py-5 bg-wolf-red text-wolf-black font-heading tracking-[0.2em] uppercase overflow-hidden flex items-center justify-center gap-3 text-sm font-bold shadow-[0_0_34px_rgba(243,163,55,0.28)] hover:shadow-[0_0_56px_rgba(243,163,55,0.42)] transition-shadow duration-500"
            >
              <span className="relative z-10">{content.hero.primaryCtaLabel}</span>
              <ChevronRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#fff7d6_0%,#ffe39f_50%,#ffbe57_100%)] transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out" />
              <div className="absolute inset-0 bg-wolf-red-hover transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out delay-75" />
            </a>
          </Magnetic>

          <Magnetic>
            <a
              href="#portfolio"
              className="group relative overflow-hidden px-10 py-5 border border-white/20 text-white font-heading tracking-[0.2em] uppercase hover:bg-wolf-silver transition-all duration-500 flex items-center justify-center text-sm font-bold backdrop-blur-sm"
            >
              <span className="relative z-10 transition-colors duration-500 group-hover:text-wolf-black">
                {content.hero.secondaryCtaLabel}
              </span>
            </a>
          </Magnetic>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 3 }}
        className="absolute bottom-12 right-12 z-30 hidden lg:flex items-center justify-center w-32 h-32"
      >
        <Magnetic>
          <div className="relative w-full h-full flex items-center justify-center cursor-hover">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              className="absolute inset-0 border border-wolf-red/30 rounded-full border-dashed"
            />
            <motion.svg
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              viewBox="0 0 100 100"
              className="w-full h-full text-wolf-silver fill-current"
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
            </motion.svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-2 h-2 bg-wolf-red rounded-full shadow-[0_0_14px_rgba(243,163,55,0.9)]" />
            </div>
          </div>
        </Magnetic>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 1 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1.5"
      >
        <span className="text-[8px] uppercase tracking-[0.3em] text-gray-500 font-heading font-bold">
          Scroll
        </span>
        <div className="w-[1px] h-6 bg-gray-800 relative overflow-hidden">
          <motion.div
            animate={{ y: [0, 24] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-full h-1/2 bg-wolf-red absolute top-0"
          />
        </div>
      </motion.div>
    </section>
  );
}
