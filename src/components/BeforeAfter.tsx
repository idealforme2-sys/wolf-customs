import { useState, useRef, type MouseEvent, type TouchEvent } from "react";
import { motion } from "framer-motion";
import beforeImg from "../before.jpg";
import afterImg from "../after.jpg";
import { useSiteContent } from "./SiteContentProvider";

export default function BeforeAfter() {
  const { content } = useSiteContent();
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (event: MouseEvent | TouchEvent) => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const clientX = "touches" in event ? event.touches[0].clientX : event.clientX;
    const x = clientX - containerRect.left;
    const percentage = Math.max(0, Math.min(100, (x / containerRect.width) * 100));
    setSliderPosition(percentage);
  };

  const beforeImage = content.beforeAfter.beforeImageUrl || beforeImg;
  const afterImage = content.beforeAfter.afterImageUrl || afterImg;

  return (
    <section className="py-24 bg-wolf-black relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tight mb-4"
          >
            {content.beforeAfter.title} <span className="molten-highlight">{content.beforeAfter.highlight}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            {content.beforeAfter.description}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-sm cursor-ew-resize select-none border border-wolf-gunmetal"
          ref={containerRef}
          onMouseMove={handleMove}
          onTouchMove={handleMove}
        >
          <div className="absolute inset-0">
            <img
              src={afterImage}
              alt={content.beforeAfter.afterLabel}
              className="w-full h-full object-cover"
              draggable="false"
            />
            <div className="absolute top-6 right-6 bg-wolf-black/80 backdrop-blur-sm px-4 py-2 font-heading uppercase tracking-widest text-sm border border-wolf-red/30">
              {content.beforeAfter.afterLabel}
            </div>
          </div>

          <div
            className="absolute inset-0 border-r-2 border-wolf-red"
            style={{
              clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
            }}
          >
            <img
              src={beforeImage}
              alt={content.beforeAfter.beforeLabel}
              className="w-full h-full object-cover grayscale opacity-80"
              draggable="false"
            />
            <div className="absolute top-6 left-6 bg-wolf-black/80 backdrop-blur-sm px-4 py-2 font-heading uppercase tracking-widest text-sm border border-wolf-silver/30">
              {content.beforeAfter.beforeLabel}
            </div>
          </div>

          <div
            className="absolute top-0 bottom-0 w-1 bg-wolf-red cursor-ew-resize flex items-center justify-center shadow-[0_0_15px_rgba(199,161,74,0.55)]"
            style={{ left: `calc(${sliderPosition}% - 2px)` }}
          >
            <div className="w-8 h-8 bg-wolf-red rounded-full flex items-center justify-center shadow-lg">
              <div className="flex gap-1">
                <div className="w-0.5 h-3 bg-wolf-black rounded-full" />
                <div className="w-0.5 h-3 bg-wolf-black rounded-full" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
