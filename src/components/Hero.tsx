import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useRef } from "react";
import Magnetic from "./Magnetic";
import { useSiteContent } from "./SiteContentProvider";

export default function Hero() {
  const { content } = useSiteContent();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

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
    <section
      ref={ref}
      className="relative min-h-screen w-full flex flex-col justify-center overflow-hidden bg-wolf-black pt-32 pb-24"
    >
      {/* Dynamic Background Video */}
      <motion.div style={{ y }} className="absolute inset-0 z-0 transform-gpu will-change-transform">
        <video
          autoPlay
          muted
          loop
          preload="auto"
          playsInline
          disablePictureInPicture
          className="absolute inset-0 h-full w-full object-cover object-center contrast-[1.06] saturate-[1.08] [transform:translateZ(0)]"
        >
          <source src="/hero-background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-wolf-black/62 via-wolf-black/24 to-wolf-black/68 z-10" />
        <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,rgba(230,0,0,0.09)_0%,transparent_72%)] opacity-45" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-30 max-w-7xl mx-auto px-6 lg:px-8 w-full flex flex-col items-center text-center"
      >
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
            <div className="flex overflow-visible">
              {["W", "O", "L", "F"].map((char, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 drop-shadow-2xl p-[0.2em] -m-[0.2em]"
                >
                  {char}
                </motion.span>
              ))}
            </div>
            <div className="flex overflow-visible mt-2">
              {["C", "U", "S", "T", "O", "M", "S"].map((char, i) => (
                <motion.span
                  key={i}
                  custom={i + 4}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-transparent bg-clip-text bg-gradient-to-b from-wolf-red to-red-900 drop-shadow-2xl p-[0.2em] -m-[0.2em]"
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
              className="group relative px-10 py-5 bg-wolf-red text-white font-heading tracking-[0.2em] uppercase overflow-hidden flex items-center justify-center gap-3 text-sm font-bold shadow-[0_0_30px_rgba(230,0,0,0.3)] hover:shadow-[0_0_50px_rgba(230,0,0,0.5)] transition-shadow duration-500"
            >
              <span className="relative z-10">{content.hero.primaryCtaLabel}</span>
              <ChevronRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-white transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out" />
              <div className="absolute inset-0 bg-wolf-red-hover transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out delay-75" />
            </a>
          </Magnetic>

          <Magnetic>
            <a
              href="#portfolio"
              className="group px-10 py-5 border border-white/20 text-white font-heading tracking-[0.2em] uppercase hover:bg-white hover:text-wolf-black transition-all duration-500 flex items-center justify-center text-sm font-bold backdrop-blur-sm"
            >
              {content.hero.secondaryCtaLabel}
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>

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
              <div className="w-2 h-2 bg-wolf-red rounded-full shadow-[0_0_10px_rgba(230,0,0,0.8)]" />
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
