import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import Magnetic from "./Magnetic";

import slide1 from "../1.jpg";
import slide2 from "../2.jpg";
import slide3 from "../3.jpg";

const slides = [slide1, slide2, slide3];

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // 6 seconds per slide
    return () => clearInterval(timer);
  }, []);

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
      {/* Dynamic Background Slideshow */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={currentSlide}
            src={slides[currentSlide]}
            alt={`Hero Background ${currentSlide + 1}`}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ 
              opacity: { duration: 1.5, ease: "easeInOut" },
              scale: { duration: 6, ease: "linear" } 
            }}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </AnimatePresence>
        {/* Dark Overlays for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-wolf-black/90 via-wolf-black/60 to-wolf-black z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(230,0,0,0.15)_0%,transparent_70%)] z-10 mix-blend-screen" />
      </motion.div>

      {/* Background Marquee */}
      <div className="absolute top-1/2 -translate-y-1/2 w-full z-10 opacity-5 pointer-events-none overflow-hidden">
        <div className="marquee-container">
          <div className="marquee-content text-[20vw] font-heading font-black leading-none">
            WOLF CUSTOMS • WOLF CUSTOMS • WOLF CUSTOMS • WOLF CUSTOMS • 
          </div>
          <div className="marquee-content text-[20vw] font-heading font-black leading-none" aria-hidden="true">
            WOLF CUSTOMS • WOLF CUSTOMS • WOLF CUSTOMS • WOLF CUSTOMS • 
          </div>
        </div>
      </div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-30 max-w-7xl mx-auto px-6 lg:px-8 w-full flex flex-col items-center text-center"
      >
        {/* Top Label */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="h-[1px] w-8 md:w-16 bg-wolf-red" />
          <span className="text-wolf-red font-heading tracking-[0.4em] uppercase text-xs md:text-sm font-bold">
            Adelaide's Premier Auto Studio
          </span>
          <div className="h-[1px] w-8 md:w-16 bg-wolf-red" />
        </motion.div>

        <div className="overflow-hidden relative mb-6">
          <h1 className="text-[14vw] md:text-[9vw] lg:text-[8rem] font-heading font-black tracking-tighter leading-[0.85] uppercase flex flex-col items-center">
            <div className="flex overflow-hidden">
              {["P", "R", "E", "C", "I", "S", "I", "O", "N"].map((char, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 drop-shadow-2xl"
                >
                  {char}
                </motion.span>
              ))}
            </div>
            <div className="flex overflow-hidden mt-2">
              {["F", "I", "N", "I", "S", "H", "."].map((char, i) => (
                <motion.span
                  key={i}
                  custom={i + 9}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-transparent bg-clip-text bg-gradient-to-b from-wolf-red to-red-900 drop-shadow-2xl"
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
          Professional vehicle restorations, custom paintwork and panel repairs.
          We bring automotive legends back to life.
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
              <span className="relative z-10">Request Quote</span>
              <ChevronRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-white transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out" />
              <div className="absolute inset-0 bg-wolf-red-hover transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out delay-75" />
            </a>
          </Magnetic>

          <Magnetic>
            <a
              href="#work"
              className="group px-10 py-5 border border-white/20 text-white font-heading tracking-[0.2em] uppercase hover:bg-white hover:text-wolf-black transition-all duration-500 flex items-center justify-center text-sm font-bold backdrop-blur-sm"
            >
              View Work
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* Rotating Badge */}
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
                  • Premium Auto Restoration • Adelaide SA
                </textPath>
              </text>
            </motion.svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-2 h-2 bg-wolf-red rounded-full shadow-[0_0_10px_rgba(230,0,0,0.8)]" />
            </div>
          </div>
        </Magnetic>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 1 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-heading font-bold">
          Scroll
        </span>
        <div className="w-[1px] h-16 bg-gray-800 relative overflow-hidden">
          <motion.div
            animate={{ y: [0, 64] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-full h-1/2 bg-wolf-red absolute top-0"
          />
        </div>
      </motion.div>
    </section>
  );
}
