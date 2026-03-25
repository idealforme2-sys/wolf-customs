import { motion } from 'framer-motion';
import { Wrench, Car, Paintbrush, ShieldAlert, Palette, SprayCan, ShieldCheck, Award, CheckCircle, MapPin } from 'lucide-react';
import { useSiteContent } from './SiteContentProvider';

import paintPanelImg from '../assets/images/services/paint_panel_repairs.png';
import vehicleResImg from '../assets/images/services/vehicle_restorations.png';
import fullResprayImg from '../assets/images/services/full_car_resprays.png';
import rustImg from '../assets/images/services/rust_repairs.png';
import customPaintImg from '../assets/images/services/custom_paint_jobs.png';
import sprayImg from '../assets/images/services/spray_painting.png';

const featureIcons = {
  'shield-check': ShieldCheck,
  award: Award,
  'check-circle': CheckCircle,
  'map-pin': MapPin,
};

const serviceIcons = {
  wrench: Wrench,
  car: Car,
  paintbrush: Paintbrush,
  'shield-alert': ShieldAlert,
  palette: Palette,
  'spray-can': SprayCan,
};

const serviceImages = {
  'paint-panel-repairs': paintPanelImg,
  'vehicle-restorations': vehicleResImg,
  'full-car-resprays': fullResprayImg,
  'rust-repairs': rustImg,
  'custom-paint-jobs': customPaintImg,
  'spray-painting': sprayImg,
};


export default function Services() {
  const { content } = useSiteContent();
  const features = content.services.features.map((feature) => ({
    ...feature,
    icon: featureIcons[feature.iconKey as keyof typeof featureIcons] ?? ShieldCheck,
  }));
  const services = content.services.items.map((service) => ({
    ...service,
    icon: serviceIcons[service.iconKey as keyof typeof serviceIcons] ?? Wrench,
    image: service.imageUrl || serviceImages[service.imageKey as keyof typeof serviceImages] || paintPanelImg,
  }));

  return (
    <section id="services" className="py-32 bg-wolf-black relative">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-wolf-red/30 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Features Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24 pb-12 border-b border-wolf-gunmetal/30">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="flex items-start space-x-4 group"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-wolf-red/25 bg-[linear-gradient(180deg,rgba(255,245,215,0.12),rgba(37,18,4,0.92))] shadow-[0_0_22px_rgba(243,163,55,0.12)] transition-all duration-500 group-hover:border-wolf-red/45 group-hover:bg-[linear-gradient(180deg,rgba(255,243,205,0.22),rgba(168,74,0,0.62))] group-hover:shadow-[0_0_34px_rgba(243,163,55,0.18)]">
                <feat.icon className="h-5 w-5 text-[#fff4ce] transition-all duration-500 group-hover:scale-110 group-hover:text-white group-hover:[filter:drop-shadow(0_0_10px_rgba(255,226,162,0.35))]" />
              </div>
              <div>
                <h4 className="hover-molten-text font-heading uppercase text-sm md:text-base tracking-widest">
                  {feat.title}
                </h4>
                <p className="text-sm text-gray-400">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Sticky Left Column */}
          <div className="lg:w-1/3">
            <div className="sticky top-40">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-[1px] w-8 bg-wolf-red" />
                  <span className="text-wolf-red font-heading tracking-[0.2em] uppercase text-sm font-bold">
                    {content.services.eyebrow}
                  </span>
                </div>
                <h2 className="text-5xl md:text-7xl font-heading font-black uppercase tracking-tighter mb-6 leading-none">
                  {content.services.title} <br/><span className="molten-highlight">{content.services.highlight}</span>
                </h2>
                <p className="text-gray-400 text-lg mb-8 font-light leading-relaxed">
                  {content.services.description}
                </p>
                
                <div className="hidden lg:block w-24 h-24 border border-wolf-gunmetal rounded-full relative overflow-hidden mt-12">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                    className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_326deg,rgba(255,241,196,0.95)_344deg,rgba(243,163,55,1)_360deg)]"
                  />
                  <div className="absolute inset-[2px] bg-wolf-black rounded-full flex items-center justify-center">
                    <Wrench className="w-6 h-6 text-[#fff4cf]" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Scrolling Right Column */}
          <div className="lg:w-2/3 flex flex-col gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: "-100px", once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative p-8 md:p-12 bg-wolf-gray border border-wolf-gunmetal hover:border-wolf-red/50 transition-colors duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-wolf-black z-0" />
                
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-700 transform group-hover:scale-105 z-0"
                  style={{ backgroundImage: `url(${service.image})` }} 
                />
                
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-wolf-black via-wolf-black/80 to-wolf-gray/40 z-0" />

                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-wolf-red/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                
                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded border border-wolf-red/25 bg-[linear-gradient(180deg,rgba(255,245,216,0.14),rgba(24,13,4,0.8))] shadow-[0_0_26px_rgba(243,163,55,0.12)] transition-all duration-500 group-hover:border-wolf-red/45 group-hover:bg-[linear-gradient(180deg,rgba(255,243,206,0.24),rgba(186,82,0,0.72))] group-hover:shadow-[0_0_44px_rgba(243,163,55,0.2)]">
                    <service.icon className="h-8 w-8 text-[#fff5d2] transition-all duration-500 group-hover:scale-110 group-hover:text-white group-hover:[filter:drop-shadow(0_0_12px_rgba(255,229,170,0.42))]" />
                  </div>
                  
                  <div>
                    <h3 className="hover-molten-text mb-4 text-3xl font-heading font-bold uppercase tracking-wide drop-shadow-md">
                      {service.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed font-light text-lg drop-shadow-sm">
                      {service.description}
                    </p>
                  </div>
                </div>
                
                {/* Decorative Number */}
                <div className="absolute top-4 right-8 text-8xl font-heading font-black text-white/[0.05] group-hover:text-wolf-red/[0.1] transition-colors duration-500 pointer-events-none select-none z-0">
                  0{index + 1}
                </div>
                
                {/* Bottom Line Indicator */}
                <div className="absolute bottom-0 left-0 h-1 bg-wolf-red w-0 group-hover:w-full transition-all duration-700 ease-out" />
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
