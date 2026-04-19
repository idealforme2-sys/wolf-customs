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

const serviceDescriptionOverrides: Record<string, string> = {
  'paint-panel-repairs':
    'Expert collision repair and dent removal in Adelaide to restore your vehicle to factory condition with seamless panel repair and paintwork.',
  'vehicle-restorations':
    'Complete vehicle restorations in Adelaide for classic and modern cars, bringing automotive legends back to life with uncompromising attention to detail.',
  'full-car-resprays':
    'Full car resprays for Adelaide and South Australia drivers using premium automotive paints in our climate-controlled spray booths.',
  'custom-paint-jobs':
    'Show-quality custom paint jobs in Adelaide with pearls, candies, flakes, and bespoke finishes tailored to your exact vision.',
};

const serviceImageAlts: Record<string, string> = {
  'paint-panel-repairs': 'panel repair Adelaide',
  'vehicle-restorations': 'car restoration Adelaide',
  'full-car-resprays': 'full car respray Adelaide',
  'rust-repairs': 'rust repair Adelaide',
  'custom-paint-jobs': 'custom paint job Adelaide',
  'spray-painting': 'automotive spray painting Adelaide',
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
    description: serviceDescriptionOverrides[service.imageKey] ?? service.description,
    imageAlt: serviceImageAlts[service.imageKey] ?? `${service.title} in Adelaide, South Australia`,
  }));

  return (
    <section id="services" className="relative bg-wolf-black py-32 scroll-mt-36 md:scroll-mt-32">
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
                <p className="hover-molten-text font-heading uppercase text-sm md:text-base tracking-widest">
                  {feat.title}
                </p>
                <p className="text-sm text-gray-400">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mb-24 overflow-hidden rounded-[30px] border border-[rgba(255,228,157,0.12)] bg-[linear-gradient(180deg,rgba(17,10,4,0.9),rgba(8,5,2,0.96))] px-6 py-8 shadow-[0_28px_80px_rgba(0,0,0,0.28)] md:px-8 md:py-10"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,223,150,0.8)] to-transparent" />
          <div className="absolute -left-16 top-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(243,163,55,0.14)_0%,transparent_72%)] blur-3xl" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <div className="mb-5 flex items-center gap-4">
                <div className="h-[1px] w-10 bg-wolf-red" />
                <span className="text-wolf-red font-heading tracking-[0.24em] uppercase text-xs font-bold">
                  Adelaide, South Australia
                </span>
              </div>
              <h2 className="text-4xl font-heading font-black uppercase tracking-tighter leading-[0.95] text-white md:text-6xl">
                Adelaide <span className="text-white">Automotive</span>
                <br />
                <span className="molten-highlight">Restoration &amp; Custom Paint</span>
                <br />
                <span className="text-white">By Wolf Customs</span>
              </h2>
            </div>

            <div className="space-y-5 border-l border-[rgba(255,223,150,0.16)] pl-0 lg:pl-8">
              <div className="inline-flex items-center gap-3 rounded-full border border-[rgba(255,223,150,0.16)] bg-white/[0.03] px-4 py-2 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
                <span className="h-2 w-2 rounded-full bg-wolf-red shadow-[0_0_14px_rgba(243,163,55,0.7)]" />
                <p className="text-[11px] font-heading font-bold uppercase tracking-[0.24em] text-wolf-red">
                  Salisbury South Workshop
                </p>
              </div>

              <div className="relative overflow-hidden rounded-[26px] border border-[rgba(255,223,150,0.18)] bg-[linear-gradient(135deg,rgba(255,244,220,0.08),rgba(56,28,5,0.82))] p-6 shadow-[0_26px_60px_rgba(0,0,0,0.26)]">
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(243,163,55,0.24)_0%,transparent_72%)] blur-2xl" />
                <p className="relative text-base font-light leading-relaxed text-gray-200 md:text-lg">
                  From Salisbury South, Wolf Customs restores, refinishes, and repairs vehicles for Adelaide owners who care about
                  <span className="text-[#ffe4a6]"> straighter body lines, deeper colour, and detail that still rewards a closer look.</span>
                </p>
              </div>

              <div className="relative overflow-hidden rounded-[24px] border border-white/8 bg-black/35 p-5 backdrop-blur-sm">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-wolf-red/70 to-transparent" />
                <p className="mb-3 text-[10px] font-heading font-bold uppercase tracking-[0.26em] text-[#ffd77f]">
                  Classic, Prestige &amp; Modern
                </p>
                <p className="text-sm font-light leading-relaxed text-gray-400 md:text-base">
                  Every build moves through the same detail-first process: patient preparation, clean surfacing, controlled paintwork, and finishing work shaped to feel sharp on delivery day and years after.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-4 py-3 text-[11px] font-heading font-bold uppercase tracking-[0.22em] text-gray-300">
                <MapPin className="h-4 w-4 text-wolf-red" />
                <span>Serving Adelaide & surrounding South Australian suburbs</span>
              </div>
            </div>
          </div>
        </motion.div>

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
                  className="absolute inset-0 z-0 overflow-hidden"
                >
                  <img
                    src={service.image}
                    alt={service.imageAlt}
                    className="h-full w-full object-cover object-center opacity-30 grayscale transition-all duration-700 transform group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-60"
                  />
                </div>
                
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
