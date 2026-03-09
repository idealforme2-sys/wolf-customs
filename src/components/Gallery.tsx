import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

import customPaintImg from '../assets/images/gallery/gallery_custom_paint.png';
import fullResprayImg from '../assets/images/gallery/gallery_full_respray.png';
import panelRepairImg from '../assets/images/gallery/gallery_panel_repair.png';
import classicRestorationImg from '../assets/images/gallery/gallery_classic_restoration.png';
import rustTreatmentImg from '../assets/images/gallery/gallery_rust_treatment.png';

const projects = [
  {
    id: 1,
    title: 'Custom Paint',
    subtitle: 'Porsche 911',
    image: customPaintImg,
  },
  {
    id: 2,
    title: 'Full Respray',
    subtitle: 'Nissan Skyline R34',
    image: fullResprayImg,
  },
  {
    id: 3,
    title: 'Panel Repair',
    subtitle: 'BMW M3',
    image: panelRepairImg,
  },
  {
    id: 4,
    title: 'Classic Restoration',
    subtitle: 'Ford Mustang 1968',
    image: classicRestorationImg,
  },
  {
    id: 5,
    title: 'Rust Treatment',
    subtitle: 'Toyota LandCruiser',
    image: rustTreatmentImg,
  },
];

export default function Gallery() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Transform scroll progress to horizontal movement
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  return (
    <section ref={targetRef} id="work" className="relative h-[400vh] bg-wolf-black">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        
        {/* Title Overlay */}
        <div className="absolute top-32 left-6 lg:left-12 z-20 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="h-[1px] w-8 bg-wolf-red" />
            <span className="text-wolf-red font-heading tracking-[0.2em] uppercase text-sm font-bold">
              Capabilities
            </span>
          </motion.div>
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-heading font-black uppercase tracking-tighter text-white mix-blend-difference drop-shadow-2xl">
            Signature <span className="text-wolf-red">Services</span>
          </h2>
        </div>
        
        {/* Horizontal Scroll Container */}
        <motion.div style={{ x }} className="flex gap-8 px-6 lg:px-12 pt-48 pb-16 h-full items-center">
          {projects.map((project, index) => (
            <div 
              key={project.id} 
              className="relative w-[85vw] md:w-[50vw] lg:w-[40vw] h-[60vh] md:h-[70vh] shrink-0 group overflow-hidden cursor-hover"
            >
              <div className="absolute inset-0 bg-wolf-black/40 group-hover:bg-transparent transition-colors duration-700 z-10" />
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[1.5s] ease-out grayscale group-hover:grayscale-0" 
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-wolf-black via-wolf-black/20 to-transparent opacity-90 z-20" />
              
              <div className="absolute bottom-0 left-0 p-8 md:p-12 z-30 w-full transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-wolf-red font-heading tracking-[0.2em] uppercase text-sm font-bold mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {project.subtitle}
                </p>
                <h3 className="text-4xl md:text-5xl font-heading font-bold uppercase tracking-wide text-white mb-6">
                  {project.title}
                </h3>
                <div className="w-full h-[1px] bg-wolf-gunmetal relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full bg-wolf-red w-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out delay-200" />
                </div>
              </div>
            </div>
          ))}
          
          {/* End CTA Card */}
          <div className="relative w-[85vw] md:w-[40vw] h-[60vh] md:h-[70vh] shrink-0 bg-wolf-gray border border-wolf-gunmetal flex flex-col items-center justify-center text-center p-12 group hover:border-wolf-red transition-colors duration-500">
            <h3 className="text-4xl md:text-5xl font-heading font-black uppercase tracking-tighter text-white mb-6">
              Start Your <br/><span className="text-wolf-red">Project</span>
            </h3>
            <a
              href="#contact"
              className="px-8 py-4 bg-wolf-red text-white font-heading tracking-widest uppercase hover:bg-white hover:text-wolf-black transition-colors duration-300 font-bold"
            >
              Get a Quote
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
