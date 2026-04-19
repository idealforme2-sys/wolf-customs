import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useSiteContent } from "./SiteContentProvider";

import customPaintImg from "../assets/images/gallery/gallery_custom_paint.png";
import fullResprayImg from "../assets/images/gallery/gallery_full_respray.png";
import panelRepairImg from "../assets/images/gallery/gallery_panel_repair.png";
import classicRestorationImg from "../assets/images/gallery/gallery_classic_restoration.png";
import rustTreatmentImg from "../../public/images/gallery/rust_treatment_new.png";

const fallbackProjectImages = [
  customPaintImg,
  fullResprayImg,
  panelRepairImg,
  classicRestorationImg,
  rustTreatmentImg,
];

const galleryImageAlts: Record<string, string> = {
  "Custom Paint": "custom paint job Adelaide",
  "Full Respray": "full car respray Adelaide",
  "Panel Repair": "panel repair Adelaide",
  "Classic Restoration": "car restoration Adelaide",
  "Rust Treatment": "rust repair Adelaide",
};

export default function Gallery() {
  const { content } = useSiteContent();
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const projects = content.gallery.items.map((project, index) => ({
    ...project,
    id: index + 1,
    image: project.imageUrl || fallbackProjectImages[index] || fallbackProjectImages[0],
  }));

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  return (
    <section ref={targetRef} id="work" className="relative h-[400vh] bg-wolf-black">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="absolute top-32 left-6 lg:left-12 z-20 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="h-[1px] w-8 bg-wolf-red" />
            <span className="text-wolf-red font-heading tracking-[0.2em] uppercase text-sm font-bold">
              {content.gallery.eyebrow}
            </span>
          </motion.div>
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-heading font-black uppercase tracking-tighter text-white mix-blend-difference drop-shadow-2xl">
            {content.gallery.title} <span className="molten-highlight">{content.gallery.highlight}</span>
          </h2>
        </div>

        <motion.div style={{ x }} className="flex gap-8 px-6 lg:px-12 pt-48 pb-16 h-full items-center">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative h-[60vh] w-[85vw] shrink-0 cursor-hover overflow-hidden rounded-[28px] border border-wolf-gunmetal/70 bg-[#050301] shadow-[0_24px_60px_rgba(0,0,0,0.38)] transition-all duration-700 hover:border-wolf-red/45 hover:shadow-[0_34px_90px_rgba(243,163,55,0.12)] md:h-[70vh] md:w-[50vw] lg:w-[40vw]"
            >
              <div className="absolute inset-0 bg-wolf-black/40 group-hover:bg-transparent transition-colors duration-700 z-10" />
              <img
                src={project.image}
                alt={galleryImageAlts[project.title] ?? `${project.title} Adelaide`}
                className="h-full w-full bg-[#050301] object-cover grayscale transition-transform duration-[1.5s] ease-out will-change-transform group-hover:scale-110 group-hover:grayscale-0"
              />

              <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#040201] via-[#040201]/20 to-transparent opacity-95" />
              <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_center,transparent_46%,rgba(4,2,1,0.32)_100%)]" />
              <div className="absolute inset-[1px] z-20 rounded-[27px] border border-[rgba(255,216,132,0.08)]" />

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

          <div className="relative w-[85vw] md:w-[40vw] h-[60vh] md:h-[70vh] shrink-0 bg-wolf-gray border border-wolf-gunmetal flex flex-col items-center justify-center text-center p-12 group hover:border-wolf-red transition-colors duration-500">
            <h3 className="text-4xl md:text-5xl font-heading font-black uppercase tracking-tighter text-white mb-6">
              {content.gallery.ctaTitle} <br />
              <span className="text-wolf-red">{content.gallery.ctaHighlight}</span>
            </h3>
            <a
              href="#contact"
              className="px-8 py-4 bg-wolf-red text-wolf-black font-heading tracking-widest uppercase hover:bg-wolf-silver hover:text-wolf-black transition-colors duration-300 font-bold"
            >
              {content.gallery.ctaButtonLabel}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
