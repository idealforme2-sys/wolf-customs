import React, { useEffect, useRef, useState } from 'react';
import { Package, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const merchItems = [
  { id: 1, name: "T-Shirts", price: 0 },
  { id: 2, name: "Hoodies", price: 0 },
  { id: 3, name: "Hats", price: 0 },
  { id: 4, name: "Stubbie Holders", price: 0 },
  { id: 5, name: "Stickers", price: 0 },
  { id: 6, name: "Merch 1", price: 0 },
  { id: 7, name: "Merch 2", price: 0 },
];

const TickerContent = () => (
  <>
    <span className="text-lg md:text-2xl font-black tracking-widest mx-4 md:mx-8">/// NEW GEAR</span>
    <div className="w-10 sm:w-16 h-1 sm:h-1.5 bg-current opacity-50"></div>
    <span className="text-lg md:text-2xl font-black tracking-widest mx-4 md:mx-8">COMING SOON</span>
    <div className="w-10 sm:w-16 h-1 sm:h-1.5 bg-current opacity-50"></div>
    <span className="text-lg md:text-2xl font-black tracking-widest mx-4 md:mx-8">/// EXCLUSIVE</span>
    <div className="w-10 sm:w-16 h-1 sm:h-1.5 bg-current opacity-50"></div>
    <span className="text-lg md:text-2xl font-black tracking-widest mx-4 md:mx-8">STAY TUNED</span>
    <div className="w-10 sm:w-16 h-1 sm:h-1.5 bg-current opacity-50"></div>
  </>
);

export default function MerchSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 640 : false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const resumeRef = useRef<NodeJS.Timeout | null>(null);

  // Pause auto-play when user interacts, resume after 6 seconds
  const pauseAutoPlay = () => {
    setIsAutoPlaying(false);
    if (resumeRef.current) clearTimeout(resumeRef.current);
    resumeRef.current = setTimeout(() => {
      setIsAutoPlaying(true);
    }, 6000);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % merchItems.length);
    pauseAutoPlay();
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + merchItems.length) % merchItems.length);
    pauseAutoPlay();
  };

  // Auto-play and Resize effect
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);

    if (!isAutoPlaying) {
      return () => window.removeEventListener('resize', handleResize);
    }

    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % merchItems.length);
    }, 3000);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying]);

  return (
    <section className="bg-gray-50 min-h-screen overflow-hidden pb-20">
      
      {/* Animated Header Area */}
      <div className="relative pt-24 sm:pt-32 pb-20 sm:pb-24 mb-4 sm:mb-8 flex items-center justify-center">
        
        {/* Background Tickers */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
          {/* Ticker 1 - Dark */}
          <div className="absolute w-[150vw] -rotate-4 sm:-rotate-3 -translate-y-8 sm:translate-y-0 bg-gray-900 text-white py-3 sm:py-5 shadow-2xl z-0">
            <div className="flex w-[200%] animate-marquee items-center">
              <div className="flex-1 flex justify-around items-center whitespace-nowrap">
                <TickerContent />
              </div>
              <div className="flex-1 flex justify-around items-center whitespace-nowrap">
                <TickerContent />
              </div>
            </div>
          </div>

          {/* Ticker 2 - Accent */}
          <div className="absolute w-[150vw] rotate-3 sm:rotate-2 translate-y-8 sm:translate-y-0 bg-amber-400 text-gray-900 py-3 sm:py-4 shadow-xl z-0 mix-blend-multiply opacity-90">
            <div className="flex w-[200%] animate-marquee-reverse items-center">
              <div className="flex-1 flex justify-around items-center whitespace-nowrap">
                <TickerContent />
              </div>
              <div className="flex-1 flex justify-around items-center whitespace-nowrap">
                <TickerContent />
              </div>
            </div>
          </div>
        </div>

        {/* Foreground Headline */}
        <div className="relative z-10 text-center bg-white/90 backdrop-blur-md py-6 px-5 sm:py-10 sm:px-12 md:px-20 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 max-w-[90%] sm:max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            Official Merchandise
          </h2>
          <p className="mt-3 sm:mt-4 text-lg sm:text-xl text-gray-600 font-medium max-w-xl mx-auto">
            Stay tuned! Our new merch line is dropping soon.
          </p>
          <div className="mt-6 sm:mt-8 inline-flex items-center px-5 py-2.5 sm:px-6 sm:py-3 border border-transparent text-sm sm:text-base font-bold rounded-full text-amber-900 bg-amber-200 shadow-sm hover:bg-amber-300 transition-colors">
            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            Coming Soon
          </div>
        </div>
      </div>

      {/* 3D Carousel Area */}
      <div 
        className="relative w-full max-w-6xl mx-auto h-[480px] sm:h-[550px] flex items-center justify-center mt-4 sm:mt-8"
        style={{ perspective: '1200px' }}
      >
        {/* Controls */}
        <button 
          onClick={handlePrev} 
          className="absolute left-2 sm:left-4 md:left-12 z-40 p-2 sm:p-3 md:p-4 rounded-full bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.1)] text-gray-800 hover:bg-white hover:scale-110 transition-all duration-300"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
        <button 
          onClick={handleNext} 
          className="absolute right-2 sm:right-4 md:right-12 z-40 p-2 sm:p-3 md:p-4 rounded-full bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.1)] text-gray-800 hover:bg-white hover:scale-110 transition-all duration-300"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        {/* Cards Container */}
        <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
          {merchItems.map((item, index) => {
            // Calculate relative offset from active index
            let offset = (index - activeIndex + merchItems.length) % merchItems.length;
            // Adjust offset to be centered around 0 (e.g., -3, -2, -1, 0, 1, 2, 3)
            if (offset > Math.floor(merchItems.length / 2)) {
              offset -= merchItems.length;
            }

            const isCenter = offset === 0;
            const absOffset = Math.abs(offset);
            const sign = Math.sign(offset);

            // 3D Animation Values
            const x = isMobile ? `${offset * 90}%` : `${offset * 75}%`; // Shift horizontally based on card width
            const scale = isCenter ? (isMobile ? 1.05 : 1.1) : 1 - absOffset * 0.15;
            const zIndex = 30 - absOffset;
            const opacity = isCenter ? 1 : Math.max(0, 1 - absOffset * (isMobile ? 0.5 : 0.35));
            const rotateY = sign * -15; // Inward tilt

            return (
              <motion.div
                key={item.id}
                animate={{ x, scale, zIndex, opacity, rotateY }}
                transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
                className="absolute w-[260px] sm:w-[320px] flex flex-col bg-white/60 backdrop-blur-xl rounded-[20px] sm:rounded-3xl shadow-[0_15px_50px_rgba(0,0,0,0.08)] border border-white/80 overflow-hidden"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Image Placeholder */}
                <div className="aspect-w-1 aspect-h-1 bg-white/40 w-full overflow-hidden flex items-center justify-center p-6 sm:p-8 h-48 sm:h-64 border-b border-white/50">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <Package className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 opacity-50" />
                    <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-gray-500">coming soon</span>
                  </div>
                </div>
                
                {/* Product Details */}
                <div className="p-5 sm:p-8 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-6 flex-1 leading-relaxed">
                    Details and sizing information will be available soon.
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-5 border-t border-white/50">
                    <p className="text-2xl font-black text-gray-900">
                      ${item.price.toFixed(2)}
                    </p>
                    <button 
                      disabled
                      className="inline-flex items-center px-5 py-2.5 border border-gray-200 shadow-sm text-sm font-bold rounded-xl text-gray-700 bg-white/80 hover:bg-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Notify Me
                    </button>
                  </div>
                </div>
                
                {/* Coming Soon Badge */}
                <div className="absolute top-5 right-5">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-white/90 backdrop-blur-md text-gray-900 shadow-sm border border-gray-100">
                    Preview
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
