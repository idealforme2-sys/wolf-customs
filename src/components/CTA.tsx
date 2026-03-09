import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Magnetic from './Magnetic';

export default function CTA() {
  return (
    <section className="relative py-40 overflow-hidden flex items-center justify-center bg-wolf-black">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-wolf-black/90 z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(230,0,0,0.1)_0%,transparent_50%)] z-10 mix-blend-screen" />
        <img
          src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=2000&auto=format&fit=crop"
          alt="Workshop"
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
            Start Your Journey
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
          Bring Your Car <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-wolf-red to-red-900 drop-shadow-2xl">Back To Life</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-400 mb-16 max-w-3xl mx-auto font-light leading-relaxed"
        >
          Ready to start your restoration project or need a flawless respray? Contact our Adelaide workshop today for a consultation.
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
              className="inline-flex group relative px-12 py-6 bg-wolf-red text-white font-heading text-xl tracking-[0.2em] uppercase overflow-hidden items-center justify-center gap-4 font-bold shadow-[0_0_40px_rgba(230,0,0,0.4)] hover:shadow-[0_0_60px_rgba(230,0,0,0.6)] transition-shadow duration-500"
            >
              <span className="relative z-10">Get a Free Quote</span>
              <ChevronRight className="relative z-10 w-6 h-6 group-hover:translate-x-2 transition-transform" />
              <div className="absolute inset-0 bg-white transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out" />
              <div className="absolute inset-0 bg-wolf-red-hover transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out delay-75" />
            </a>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
}
