import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Magnetic from './Magnetic';
import { useSiteContent } from './SiteContentProvider';

export default function CTA() {
  const { content } = useSiteContent();
  return (
    <section className="relative py-40 overflow-hidden flex items-center justify-center bg-wolf-black">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-wolf-black/90 z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,188,79,0.16)_0%,transparent_54%)] z-10" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_18%,rgba(255,232,170,0.08)_36%,transparent_54%,rgba(243,163,55,0.08)_72%,transparent_88%)] z-10" />
        <img
          src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=2000&auto=format&fit=crop"
          alt="Wolf Customs workshop in Adelaide, South Australia"
          className="w-full h-full object-cover grayscale opacity-30"
        />
      </div>

      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <div className="h-[1px] w-12 bg-wolf-red" />
          <span className="text-wolf-red font-heading tracking-[0.3em] uppercase text-sm font-bold">
            {content.cta.eyebrow}
          </span>
          <div className="h-[1px] w-12 bg-wolf-red" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl lg:text-9xl font-heading font-black uppercase tracking-tighter mb-8 text-white leading-[0.9]"
        >
          {content.cta.title} <br />
          <span className="text-transparent bg-clip-text bg-[linear-gradient(180deg,#fff0ba_0%,#ffbf58_34%,#ef8a22_66%,#9f4700_100%)] [filter:drop-shadow(0_0_18px_rgba(243,163,55,0.22))]">{content.cta.highlight}</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-400 mb-16 max-w-3xl mx-auto font-light leading-relaxed"
        >
          {content.cta.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center"
        >
          <Magnetic>
            <a
              href="#contact"
              className="inline-flex group relative px-12 py-6 bg-wolf-red text-wolf-black font-heading text-xl tracking-[0.2em] uppercase overflow-hidden items-center justify-center gap-4 font-bold shadow-[0_0_42px_rgba(243,163,55,0.32)] hover:shadow-[0_0_64px_rgba(243,163,55,0.48)] transition-shadow duration-500"
            >
              <span className="relative z-10">{content.cta.buttonLabel}</span>
              <ChevronRight className="relative z-10 w-6 h-6 group-hover:translate-x-2 transition-transform" />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#fff7d6_0%,#ffe39f_50%,#ffbe57_100%)] transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out" />
              <div className="absolute inset-0 bg-wolf-red-hover transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out delay-75" />
            </a>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
}
