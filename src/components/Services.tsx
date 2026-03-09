import { motion } from 'framer-motion';
import { Wrench, Car, Paintbrush, ShieldAlert, Palette, SprayCan, ShieldCheck, Award, CheckCircle, MapPin } from 'lucide-react';

import paintPanelImg from '../assets/images/services/paint_panel_repairs.png';
import vehicleResImg from '../assets/images/services/vehicle_restorations.png';
import fullResprayImg from '../assets/images/services/full_car_resprays.png';
import rustImg from '../assets/images/services/rust_repairs.png';
import customPaintImg from '../assets/images/services/custom_paint_jobs.png';
import sprayImg from '../assets/images/services/spray_painting.png';

const features = [
  { title: 'Insurance Work', desc: 'All Providers Accepted', icon: ShieldCheck },
  { title: 'Dealership Approved', desc: 'Fleet & Trade Standards', icon: Award },
  { title: 'Quality Guarantee', desc: 'Lifetime Workmanship', icon: CheckCircle },
  { title: 'Locally Owned', desc: 'Salisbury South, SA', icon: MapPin },
];

const services = [
  {
    title: 'Paint & Panel Repairs',
    description: 'Expert collision repair and dent removal to restore your vehicle to factory condition. We use advanced techniques to ensure a seamless finish.',
    icon: Wrench,
    image: paintPanelImg,
  },
  {
    title: 'Vehicle Restorations',
    description: 'Full nut-and-bolt restorations for classic and muscle cars. Bringing legends back to life with uncompromising attention to detail.',
    icon: Car,
    image: vehicleResImg,
  },
  {
    title: 'Full Car Resprays',
    description: 'Complete color changes or factory-matched resprays using premium automotive paints in our climate-controlled spray booths.',
    icon: Paintbrush,
    image: fullResprayImg,
  },
  {
    title: 'Rust Repairs',
    description: 'Professional rust cutting, custom metal fabrication, and anti-corrosion treatment to protect your investment for decades.',
    icon: ShieldAlert,
    image: rustImg,
  },
  {
    title: 'Custom Paint Jobs',
    description: 'Show-quality custom finishes, pearls, candies, flakes, and bespoke designs tailored to your exact vision.',
    icon: Palette,
    image: customPaintImg,
  },
  {
    title: 'Spray Painting',
    description: 'High-end spray painting services for parts, panels, motorcycles, and accessories with perfect color matching.',
    icon: SprayCan,
    image: sprayImg,
  },
];


export default function Services() {
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
              <div className="w-10 h-10 rounded-full bg-wolf-black flex items-center justify-center shrink-0 border border-wolf-red/20 group-hover:border-wolf-red transition-colors duration-500">
                <feat.icon className="w-5 h-5 text-wolf-red group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div>
                <h4 className="font-heading uppercase text-sm md:text-base tracking-widest text-white group-hover:text-wolf-red transition-colors duration-300">{feat.title}</h4>
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
                    What We Do
                  </span>
                </div>
                <h2 className="text-5xl md:text-7xl font-heading font-black uppercase tracking-tighter mb-6 leading-none">
                  Our <br/><span className="text-wolf-red">Expertise</span>
                </h2>
                <p className="text-gray-400 text-lg mb-8 font-light leading-relaxed">
                  We deliver uncompromising quality across all our automotive restoration and paint services. Every project is treated as a masterpiece.
                </p>
                
                <div className="hidden lg:block w-24 h-24 border border-wolf-gunmetal rounded-full relative overflow-hidden mt-12">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                    className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(230,0,0,1)_360deg)]"
                  />
                  <div className="absolute inset-[2px] bg-wolf-black rounded-full flex items-center justify-center">
                    <Wrench className="w-6 h-6 text-wolf-silver" />
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
                  <div className="w-16 h-16 shrink-0 bg-wolf-black/50 backdrop-blur-sm border border-wolf-gunmetal flex items-center justify-center group-hover:bg-wolf-red group-hover:border-wolf-red transition-all duration-500 rounded shadow-lg">
                    <service.icon className="w-8 h-8 text-wolf-silver group-hover:text-white transition-colors duration-500" />
                  </div>
                  
                  <div>
                    <h3 className="text-3xl font-heading font-bold uppercase tracking-wide mb-4 text-white group-hover:text-wolf-red transition-colors duration-300 drop-shadow-md">
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
