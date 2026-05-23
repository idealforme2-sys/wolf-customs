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
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-24 overflow-hidden rounded-[32px] border border-white/[0.08] bg-[linear-gradient(135deg,rgba(18,12,6,0.92),rgba(8,5,2,0.97))] p-8 md:p-12 shadow-[0_32px_90px_rgba(0,0,0,0.35)] backdrop-blur-md"
        >
          {/* Decorative Glowing Gradients */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,223,150,0.6)] to-transparent" />
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(243,163,55,0.15)_0%,transparent_70%)] blur-3xl pointer-events-none" />
          <div className="absolute -left-24 -bottom-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(199,98,0,0.12)_0%,transparent_70%)] blur-3xl pointer-events-none" />

          <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-stretch">
            {/* Left Brand Identity Pane */}
            <div className="flex flex-col justify-between space-y-8 pr-0 lg:pr-8 lg:border-r border-white/[0.06]">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="h-[2px] w-8 bg-wolf-red shadow-[0_0_12px_rgba(243,163,55,0.8)]" />
                  <span className="text-wolf-red font-heading tracking-[0.26em] uppercase text-xs font-bold [text-shadow:0_0_14px_rgba(243,163,55,0.3)]">
                    Adelaide, South Australia
                  </span>
                </div>
                
                <h2 className="text-4xl font-heading font-black uppercase tracking-tight leading-[0.9] text-white sm:text-5xl md:text-6xl lg:text-5xl xl:text-6.5xl">
                  Adelaide <span className="text-white font-light">Automotive</span>
                  <br />
                  <span className="molten-highlight">Restoration &amp; Custom Paint</span>
                  <br />
                  <span className="text-white text-3xl sm:text-4xl font-light tracking-wide block mt-3">By Wolf Customs</span>
                </h2>
              </div>

              {/* Status and ABN info Badges */}
              <div className="space-y-4 pt-6 border-t border-white/[0.06]">
                <div className="flex flex-wrap gap-3">
                  <div className="inline-flex items-center gap-2.5 rounded-full border border-wolf-red/30 bg-wolf-red/5 px-4 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-all duration-300 hover:border-wolf-red/55">
                    <span className="h-2 w-2 rounded-full bg-wolf-red animate-pulse shadow-[0_0_10px_rgba(243,163,55,1)]" />
                    <p className="text-[11px] font-heading font-bold uppercase tracking-[0.24em] text-wolf-red">
                      Salisbury South Workshop
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                    <Award className="h-3.5 w-3.5 text-wolf-cream-muted" />
                    <p className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-wolf-cream-muted">
                      {content.business.abn}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Information & Process Cards */}
            <div className="flex flex-col justify-between space-y-8 pl-0 lg:pl-4">
              <div className="grid gap-6 sm:grid-cols-1">
                {/* Philosophy Card */}
                <div className="group relative overflow-hidden rounded-[24px] border border-white/[0.06] bg-[linear-gradient(135deg,rgba(255,244,220,0.02),rgba(56,28,5,0.2))] p-6 transition-all duration-500 hover:border-wolf-red/35 hover:bg-[linear-gradient(135deg,rgba(255,244,220,0.06),rgba(56,28,5,0.45))] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
                  <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(243,163,55,0.1)_0%,transparent_70%)] blur-2xl transition-all duration-500 group-hover:scale-125" />
                  <p className="text-[10px] font-heading font-bold uppercase tracking-[0.24em] text-wolf-red mb-3">
                    01 / The Workshop Vision
                  </p>
                  <p className="relative z-10 text-base font-light leading-relaxed text-gray-300 md:text-lg">
                    From Salisbury South, Wolf Customs restores, refinishes, and repairs vehicles for Adelaide owners who care about
                    <span className="text-wolf-red font-medium transition-all duration-300 group-hover:text-white"> straighter body lines, deeper colour, and detail that still rewards a closer look.</span>
                  </p>
                </div>

                {/* Process Steps Card */}
                <div className="group relative overflow-hidden rounded-[24px] border border-white/[0.06] bg-black/40 p-6 transition-all duration-500 hover:border-wolf-red/30">
                  <p className="text-[10px] font-heading font-bold uppercase tracking-[0.24em] text-[#ffd77f] mb-3">
                    02 / Classic, Prestige &amp; Modern
                  </p>
                  <p className="text-sm font-light leading-relaxed text-gray-400 md:text-base mb-6">
                    Every build moves through the same detail-first process: patient preparation, clean surfacing, controlled paintwork, and finishing work shaped to feel sharp on delivery day and years after.
                  </p>

                  {/* Visual Process Step Tracker */}
                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/[0.05]">
                    {[
                      { num: "01", label: "Preparation", desc: "Patient Surface Prep" },
                      { num: "02", label: "Surfacing", desc: "Clean Straight Lines" },
                      { num: "03", label: "Paintwork", desc: "Controlled Booth Spray" },
                      { num: "04", label: "Finishing", desc: "Sharp Delivery Detail" },
                    ].map((step) => (
                      <div key={step.label} className="text-center group/step">
                        <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-xs font-heading font-bold text-gray-500 transition-all duration-500 group-hover/step:border-wolf-red/50 group-hover/step:bg-wolf-red/10 group-hover/step:text-wolf-red group-hover:border-wolf-red/20">
                          {step.num}
                        </div>
                        <p className="text-[9px] font-heading uppercase tracking-wider text-gray-400 font-bold group-hover/step:text-white">
                          {step.label}
                        </p>
                        <p className="hidden md:block text-[8px] text-gray-600 group-hover/step:text-gray-400 transition-colors">
                          {step.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Service Location Pill */}
              <div className="flex items-center gap-3 rounded-full border border-white/[0.05] bg-white/[0.02] px-5 py-3.5 text-xs font-heading font-bold uppercase tracking-[0.22em] text-gray-300 transition-colors hover:bg-white/[0.04]">
                <div className="relative flex h-3 w-3 shrink-0 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-wolf-red opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-wolf-red" />
                </div>
                <span>Serving Adelaide &amp; surrounding South Australian suburbs</span>
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
