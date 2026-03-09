import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const steps = [
  {
    number: '01',
    title: 'Inspection',
    description: 'Comprehensive assessment of the vehicle, identifying rust, previous repairs, and structural integrity.',
  },
  {
    number: '02',
    title: 'Panel Prep',
    description: 'Stripping old paint, cutting out rust, fabricating new metal, and ensuring perfect panel gaps.',
  },
  {
    number: '03',
    title: 'Primer',
    description: 'Application of high-build epoxy primers, block sanding to achieve laser-straight body lines.',
  },
  {
    number: '04',
    title: 'Paint',
    description: 'Premium basecoat application in our climate-controlled spray booth for a flawless finish.',
  },
  {
    number: '05',
    title: 'Polish',
    description: 'Wet sanding and multi-stage machine polishing to achieve that signature glass-like reflection.',
  },
];

export default function Process() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"]
  });

  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={ref} id="process" className="py-32 bg-wolf-gray relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 lg:px-8 relative">
        <div className="text-center mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <div className="h-[1px] w-8 bg-wolf-red" />
            <span className="text-wolf-red font-heading tracking-[0.2em] uppercase text-sm font-bold">
              Methodology
            </span>
            <div className="h-[1px] w-8 bg-wolf-red" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-heading font-black uppercase tracking-tighter mb-6 leading-none"
          >
            The <span className="text-wolf-red">Process</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg font-light leading-relaxed"
          >
            Our meticulous step-by-step approach ensures perfection in every build. We don't cut corners.
          </motion.p>
        </div>

        <div className="relative">
          {/* Vertical Line Background */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-wolf-gunmetal -translate-x-1/2 z-0" />
          
          {/* Animated Vertical Progress Line */}
          <motion.div 
            style={{ height }} 
            className="absolute left-6 md:left-1/2 top-0 w-[2px] bg-wolf-red -translate-x-1/2 origin-top shadow-[0_0_15px_rgba(230,0,0,0.8)] z-10" 
          />

          <div className="flex flex-col gap-24 relative z-20">
            {steps.map((step, index) => (
              <div 
                key={step.number}
                className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Empty space for alternating layout */}
                <div className="hidden md:block md:w-1/2" />
                
                {/* Node */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-wolf-black border-2 border-wolf-gunmetal flex items-center justify-center z-20 group hover:border-wolf-red transition-colors duration-500">
                  <div className="w-4 h-4 rounded-full bg-wolf-gunmetal group-hover:bg-wolf-red transition-colors duration-500 shadow-[0_0_10px_rgba(230,0,0,0.5)]" />
                </div>

                {/* Content Card */}
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ margin: "-100px", once: true }}
                  transition={{ duration: 0.6 }}
                  className="w-full md:w-1/2 pl-20 md:pl-0"
                >
                  <div className={`bg-wolf-black p-8 md:p-10 border border-wolf-gunmetal hover:border-wolf-red/50 transition-colors duration-500 relative group ${index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'}`}>
                    <div className="absolute top-0 left-0 w-full h-1 bg-wolf-red transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
                    <span className="text-6xl font-heading font-black text-wolf-gunmetal group-hover:text-wolf-red/20 transition-colors duration-500 absolute -top-6 -right-4 select-none pointer-events-none">
                      {step.number}
                    </span>
                    <h3 className="text-3xl font-heading font-bold uppercase tracking-wide mb-4 text-white">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 text-lg font-light leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
