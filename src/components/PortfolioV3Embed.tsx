import { useEffect } from "react";
import { motion } from "framer-motion";

const WIDGET_PORTFOLIO_DESCRIPTION =
  'This version places the business\'s "entire Instagram feed" onto the website, so people can scroll through all posts and reels in one section instead of only showing selected content.';

export default function PortfolioV3Embed() {
  useEffect(() => {
    const existingScript = document.querySelector<HTMLScriptElement>('script[src="https://widgets.sociablekit.com/instagram-feed/widget.js"]');

    if (existingScript) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://widgets.sociablekit.com/instagram-feed/widget.js";
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <section id="portfolio-v3" className="relative overflow-hidden bg-wolf-black py-28 text-white">
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-wolf-red/30 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(230,0,0,0.12),transparent_28%)]" />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-16 h-72 w-72 rounded-full bg-wolf-red/20 blur-[110px]"
        animate={{ x: [0, 42, 0], y: [0, -18, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/3 h-96 w-96 rounded-full bg-wolf-red/10 blur-[150px]"
        animate={{ x: [0, -36, 0], y: [0, 34, 0], scale: [1.04, 0.96, 1.04] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-8 left-1/3 h-60 w-60 rounded-full bg-wolf-red/12 blur-[120px]"
        animate={{ x: [0, 26, 0], y: [0, 18, 0], opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <style>{`
        #portfolio-v3 .sk-instagram-feed,
        #portfolio-v3 .sk-instagram-feed > div,
        #portfolio-v3 .sk-instagram-feed iframe {
          width: 100% !important;
          max-width: none !important;
        }

        #portfolio-v3 .sk-instagram-feed iframe {
          min-height: 78vh !important;
          border: 0 !important;
          display: block !important;
          background: #050505 !important;
          color-scheme: dark !important;
        }

        @media (min-width: 1024px) {
          #portfolio-v3 .sk-instagram-feed iframe {
            min-height: 86vh !important;
          }
        }
      `}</style>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6 flex items-center gap-4">
              <div className="h-[1px] w-8 bg-wolf-red" />
              <span className="text-sm font-heading font-bold uppercase tracking-[0.2em] text-wolf-red">
                Portfolio Ver 3
              </span>
            </div>
            <h2 className="mb-6 text-5xl font-heading font-black uppercase leading-none tracking-tighter text-white md:text-7xl">
              Latest <span className="text-wolf-red">Work</span>
            </h2>
            <p className="max-w-2xl text-lg font-light leading-relaxed text-gray-400">
              {WIDGET_PORTFOLIO_DESCRIPTION}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1600px] px-6 lg:px-8">
        <div className="relative rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.28)] md:p-5">
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-wolf-red/70 to-transparent"
            animate={{ opacity: [0.18, 0.7, 0.18] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_top,rgba(230,0,0,0.12),transparent_40%)]" />
          <div className="pointer-events-none absolute inset-4 rounded-[28px] border border-white/8" />
          <div className="min-h-[78vh] overflow-hidden rounded-[24px] bg-[radial-gradient(circle_at_top,rgba(230,0,0,0.08),transparent_34%),linear-gradient(180deg,#141414,#090909)]">
            <div className="sk-instagram-feed h-full w-full" data-embed-id="25665453" />
          </div>
        </div>
      </div>
    </section>
  );
}
