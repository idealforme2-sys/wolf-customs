import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const WIDGET_PORTFOLIO_DESCRIPTION =
  'This version places the business\'s "entire Instagram feed" onto the website, so people can scroll through all posts and reels in one section instead of only showing selected content.';

const WIDGET_SCRIPT_SRC = "https://widgets.sociablekit.com/instagram-feed/widget.js";
const WIDGET_EMBED_ID = "25665453";

let widgetScriptPromise: Promise<void> | null = null;

const loadWidgetScript = (anchor: HTMLElement, forceReload = false) => {
  if (forceReload) {
    document
      .querySelectorAll<HTMLScriptElement>(`script[src="${WIDGET_SCRIPT_SRC}"]`)
      .forEach((script) => script.remove());
    widgetScriptPromise = null;
  }

  const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${WIDGET_SCRIPT_SRC}"]`);
  if (existingScript) {
    if (existingScript.dataset.loaded === "true") {
      return Promise.resolve();
    }

    if (!widgetScriptPromise) {
      widgetScriptPromise = new Promise<void>((resolve, reject) => {
        let settled = false;

        const handleLoad = () => {
          if (settled) {
            return;
          }
          settled = true;
          existingScript.dataset.loaded = "true";
          resolve();
        };
        const handleError = () => {
          if (settled) {
            return;
          }
          settled = true;
          widgetScriptPromise = null;
          reject(new Error("Failed to load SociableKIT widget script."));
        };

        existingScript.addEventListener("load", handleLoad, { once: true });
        existingScript.addEventListener("error", handleError, { once: true });
        window.setTimeout(handleLoad, 1500);
      });
    }

    return widgetScriptPromise;
  }

  widgetScriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = WIDGET_SCRIPT_SRC;
    script.async = true;
    script.dataset.sociablekit = "instagram-feed";
    script.addEventListener(
      "load",
      () => {
        script.dataset.loaded = "true";
        resolve();
      },
      { once: true },
    );
    script.addEventListener(
      "error",
      () => {
        widgetScriptPromise = null;
        reject(new Error("Failed to load SociableKIT widget script."));
      },
      { once: true },
    );

    anchor.parentNode?.insertBefore(script, anchor.nextSibling);
  });

  return widgetScriptPromise;
};

export default function PortfolioV3Embed() {
  const sectionRef = useRef<HTMLElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const [shouldLoadWidget, setShouldLoadWidget] = useState(false);
  const [isWidgetReady, setIsWidgetReady] = useState(false);
  const [hasWidgetFailed, setHasWidgetFailed] = useState(false);
  const [widgetAttempt, setWidgetAttempt] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoadWidget(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoadWidget || !widgetRef.current) {
      return;
    }

    const widget = widgetRef.current;
    let cancelled = false;
    let retryTimeoutId: number | null = null;

    const hasIframe = () => !!widget.querySelector("iframe");
    const markReady = () => {
      if (!cancelled && hasIframe()) {
        setIsWidgetReady(true);
        setHasWidgetFailed(false);
        return true;
      }

      return false;
    };

    setIsWidgetReady(false);
    setHasWidgetFailed(false);

    const observer = new MutationObserver(() => {
      if (markReady()) {
        observer.disconnect();
      }
    });

    observer.observe(widget, { childList: true, subtree: true });

    void loadWidgetScript(widget, widgetAttempt > 0)
      .then(() => {
        if (cancelled || markReady()) {
          return;
        }

        retryTimeoutId = window.setTimeout(() => {
          if (cancelled || markReady()) {
            return;
          }

          if (widgetAttempt === 0) {
            setWidgetAttempt(1);
            return;
          }

          setHasWidgetFailed(true);
        }, 5000);
      })
      .catch(() => {
        if (!cancelled) {
          setHasWidgetFailed(true);
        }
      });

    return () => {
      cancelled = true;
      observer.disconnect();
      if (retryTimeoutId !== null) {
        window.clearTimeout(retryTimeoutId);
      }
    };
  }, [shouldLoadWidget, widgetAttempt]);

  return (
    <section ref={sectionRef} id="portfolio-v3" className="relative overflow-hidden bg-wolf-black py-28 text-white">
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
          <div className="relative min-h-[78vh] overflow-hidden rounded-[24px] bg-[radial-gradient(circle_at_top,rgba(230,0,0,0.08),transparent_34%),linear-gradient(180deg,#141414,#090909)]">
            {!isWidgetReady && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[linear-gradient(180deg,rgba(9,9,9,0.78),rgba(9,9,9,0.92))] px-6 text-center">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-wolf-red" />
                <p className="text-xs font-heading font-bold uppercase tracking-[0.24em] text-gray-300">
                  Loading Instagram Feed
                </p>
                <p className="max-w-md text-sm text-gray-500">
                  {hasWidgetFailed
                    ? "The widget is taking longer than expected. It will usually recover on retry."
                    : "Fetching the full Instagram widget for this section."}
                </p>
                {hasWidgetFailed ? (
                  <button
                    type="button"
                    onClick={() => {
                      setHasWidgetFailed(false);
                      setWidgetAttempt((current) => current + 1);
                    }}
                    className="mt-2 inline-flex items-center rounded-full border border-wolf-red/40 px-4 py-2 text-[11px] font-heading font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-wolf-red"
                  >
                    Retry Widget
                  </button>
                ) : null}
              </div>
            )}
            <div
              key={widgetAttempt}
              ref={widgetRef}
              className="sk-instagram-feed h-full w-full"
              data-embed-id={WIDGET_EMBED_ID}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
