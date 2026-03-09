import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Preloader({ onComplete }: { onComplete: () => void; key?: string }) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsExiting(true);
          setTimeout(onComplete, 1200); // Wait for split animation
          return 100;
        }
        return prev + 2;
      });
    }, 20);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[1000] pointer-events-none flex flex-col">
      {/* Top Half */}
      <motion.div
        className="w-full h-1/2 bg-wolf-black flex items-end justify-center overflow-hidden border-b border-wolf-gunmetal/30"
        initial={{ y: 0 }}
        animate={{ y: isExiting ? '-100%' : 0 }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
      >
        <div className="translate-y-[50%] text-6xl md:text-8xl font-heading font-black tracking-widest flex items-center gap-4">
          <span className="text-wolf-red">WOLF</span>
          <span className="text-white">CUSTOMS</span>
        </div>
      </motion.div>

      {/* Bottom Half */}
      <motion.div
        className="w-full h-1/2 bg-wolf-black flex items-start justify-center overflow-hidden border-t border-wolf-gunmetal/30 relative"
        initial={{ y: 0 }}
        animate={{ y: isExiting ? '100%' : 0 }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
      >
        <div className="-translate-y-[50%] text-6xl md:text-8xl font-heading font-black tracking-widest flex items-center gap-4">
          <span className="text-wolf-red">WOLF</span>
          <span className="text-white">CUSTOMS</span>
        </div>
        
        {/* Progress Bar & Text */}
        <motion.div 
          className="absolute bottom-12 flex flex-col items-center gap-4"
          animate={{ opacity: isExiting ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-64 h-1 bg-wolf-gunmetal relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-wolf-red"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="font-mono text-wolf-silver text-sm tracking-widest">
            {progress}%
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
