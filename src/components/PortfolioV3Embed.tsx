import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const WIDGET_PORTFOLIO_DESCRIPTION =
  'This version places the business\'s "entire Instagram feed" onto the website, so people can scroll through all posts and reels in one section instead of only showing selected content.';

const ELFSIGHT_SCRIPT_SRC = "https://elfsightcdn.com/platform.js";
const ELFSIGHT_APP_CLASS = "elfsight-app-b557c3af-43a3-4613-be1a-04d7db3679b2";

let widgetScriptPromise: Promise<void> | null = null;

const loadWidgetScript = (forceReload = false) => {
  if (forceReload) {
    document
      .querySelectorAll<HTMLScriptElement>(`script[src="${ELFSIGHT_SCRIPT_SRC}"]`)
      .forEach((script) => script.remove());
    widgetScriptPromise = null;
  }

  const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${ELFSIGHT_SCRIPT_SRC}"]`);
  if (existingScript) {
    if (existingScript.dataset.loaded === "true") {
      return Promise.resolve();
    }

    if (!widgetScriptPromise) {
      widgetScriptPromise = new Promise<void>((resolve, reject) => {
        let settled = false;

        const handleLoad = () => {
          if (settled) return;
          settled = true;
          existingScript.dataset.loaded = "true";
          resolve();
        };

        const handleError = () => {
          if (settled) return;
          settled = true;
          widgetScriptPromise = null;
          reject(new Error("Failed to load Elfsight script."));
        };

        existingScript.addEventListener("load", handleLoad, { once: true });
        existingScript.addEventListener("error", handleError, { once: true });
        window.setTimeout(handleLoad, 1200);
      });
    }

    return widgetScriptPromise;
  }

  widgetScriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = ELFSIGHT_SCRIPT_SRC;
    script.async = true;
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
        reject(new Error("Failed to load Elfsight script."));
      },
      { once: true },
    );

    document.head.appendChild(script);
  });

  return widgetScriptPromise;
};

export default function PortfolioV3Embed() {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [isWidgetReady, setIsWidgetReady] = useState(false);
  const [hasWidgetFailed, setHasWidgetFailed] = useState(false);
  const [widgetAttempt, setWidgetAttempt] = useState(0);

  useEffect(() => {
    const widget = widgetRef.current;
    if (!widget) {
      return;
    }

    let cancelled = false;
    let timeoutId: number | null = null;

    const markReady = () => {
      const hasContent = widget.querySelector(".eapps-instagram-feed-posts-item") !== null;
      if (hasContent && !cancelled) {
        window.requestAnimationFrame(() => {
          widget.querySelectorAll('a[href*="elfsight.com"]').forEach((link) => link.remove());
        });
        setIsWidgetReady(true);
        setHasWidgetFailed(false);
        return true;
      }

      return false;
    };

    setIsWidgetReady(false);
    setHasWidgetFailed(false);
    widget.innerHTML = "";

    const observer = new MutationObserver(() => {
      if (markReady()) {
        observer.disconnect();
      }
    });

    observer.observe(widget, { childList: true, subtree: true });

    void loadWidgetScript(widgetAttempt > 0)
      .then(() => {
        if (cancelled || markReady()) {
          return;
        }

        timeoutId = window.setTimeout(() => {
          if (cancelled || markReady()) {
            return;
          }

          setHasWidgetFailed(true);
        }, 8000);
      })
      .catch(() => {
        if (!cancelled) {
          setHasWidgetFailed(true);
        }
      });

    return () => {
      cancelled = true;
      observer.disconnect();
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [widgetAttempt]);

  useEffect(() => {
    if (!isWidgetReady) {
      return;
    }

    const widget = widgetRef.current;
    if (!widget) {
      return;
    }

    const syncTileKinds = () => {
      widget.querySelectorAll<HTMLElement>(".eapps-instagram-feed-posts-item").forEach((item) => {
        const href =
          item.querySelector<HTMLAnchorElement>(".eapps-instagram-feed-posts-item-link")?.href ?? "";
        item.dataset.previewKind = href.includes("/reel/") ? "reel" : "post";
      });
    };

    syncTileKinds();

    const observer = new MutationObserver(() => {
      syncTileKinds();
    });

    observer.observe(widget, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, [isWidgetReady]);

  useEffect(() => {
    if (!isWidgetReady) {
      return;
    }

    const handlePopupCarouselClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) {
        return;
      }

      const popup = target.closest(".eapps-instagram-feed-popup");
      if (!popup) {
        return;
      }

      if (
        target.closest("a, button, video, iframe, .eapps-instagram-feed-popup-item-media-carousel-pagination") ||
        target.closest(".eapps-instagram-feed-popup-item-media-carousel-arrow")
      ) {
        return;
      }

      const wrapper = target.closest(".eapps-instagram-feed-popup-item-media-carousel-wrapper") as HTMLElement | null;
      if (!wrapper) {
        return;
      }

      const carousel = wrapper.closest(".eapps-instagram-feed-popup-item-media-carousel");
      if (!carousel) {
        return;
      }

      const rect = wrapper.getBoundingClientRect();
      if (rect.width === 0) {
        return;
      }

      const previousControl = carousel.querySelector<HTMLElement>(
        ".eapps-instagram-feed-popup-item-media-carousel-arrow-prev",
      );
      const nextControl = carousel.querySelector<HTMLElement>(
        ".eapps-instagram-feed-popup-item-media-carousel-arrow-next",
      );

      const wantsNext = event.clientX - rect.left >= rect.width / 2;
      const selectedControl = wantsNext ? nextControl : previousControl;

      if (
        !selectedControl ||
        selectedControl.classList.contains("es-post-media-carousel-arrow-disabled") ||
        selectedControl.classList.contains("eapps-instagram-feed-popup-item-media-carousel-arrow-disabled")
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      window.requestAnimationFrame(() => {
        selectedControl.click();
      });
    };

    document.addEventListener("click", handlePopupCarouselClick, true);

    return () => {
      document.removeEventListener("click", handlePopupCarouselClick, true);
    };
  }, [isWidgetReady]);

  return (
    <section id="portfolio-v3" className="relative overflow-hidden bg-wolf-black py-28 text-white">
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-wolf-red/30 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(199,161,74,0.16),transparent_28%)]" />
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
        body.custom-cursor-enabled #portfolio-v3 .eapps-instagram-feed-posts-item-link,
        body.custom-cursor-enabled #portfolio-v3 .eapps-instagram-feed-posts-slider-nav,
        body.custom-cursor-enabled .eapps-instagram-feed-popup,
        body.custom-cursor-enabled .eapps-instagram-feed-popup * {
          cursor: auto !important;
        }

        body.custom-cursor-enabled #portfolio-v3 .eapps-instagram-feed-posts-item-link,
        body.custom-cursor-enabled #portfolio-v3 .eapps-instagram-feed-posts-slider-nav,
        body.custom-cursor-enabled .eapps-instagram-feed-popup a,
        body.custom-cursor-enabled .eapps-instagram-feed-popup button,
        body.custom-cursor-enabled .eapps-instagram-feed-popup-close {
          cursor: pointer !important;
        }

        body.custom-cursor-enabled .eapps-instagram-feed-popup-item-media-carousel-wrapper {
          cursor: ew-resize !important;
        }

        #portfolio-v3 .${ELFSIGHT_APP_CLASS} {
          min-height: auto;
          width: 100%;
        }

        #portfolio-v3 .eapps-instagram-feed-container,
        #portfolio-v3 .eapps-instagram-feed-content,
        #portfolio-v3 .eapps-instagram-feed-posts-container {
          width: 100% !important;
          max-width: none !important;
          background: transparent !important;
        }

        #portfolio-v3 .eapps-instagram-feed-title-container,
        #portfolio-v3 .eapps-instagram-feed-data-status-container,
        #portfolio-v3 .eapps-instagram-feed-error-container,
        #portfolio-v3 .eapps-instagram-feed-content-loader,
        #portfolio-v3 a[href*="elfsight.com"] {
          display: none !important;
        }

        #portfolio-v3 .eapps-instagram-feed-header-container {
          margin-bottom: 0 !important;
          padding: 22px 22px 18px !important;
          border-bottom: 1px solid rgba(255, 233, 193, 0.08) !important;
          overflow: hidden !important;
        }

        #portfolio-v3 .eapps-instagram-feed-header-inner {
          align-items: center !important;
          gap: 18px !important;
        }

        #portfolio-v3 .eapps-instagram-feed-header-user {
          gap: 14px !important;
          flex: 0 1 auto !important;
          min-width: 0 !important;
        }

        #portfolio-v3 .eapps-instagram-feed-header-user-picture-wrapper {
          width: 56px !important;
          height: 56px !important;
          flex: 0 0 56px !important;
          border-radius: 999px !important;
          overflow: hidden !important;
        }

        #portfolio-v3 .eapps-instagram-feed-header-user-picture {
          width: 100% !important;
          height: 100% !important;
          border-radius: 999px !important;
          object-fit: cover !important;
        }

        #portfolio-v3 .eapps-instagram-feed-header-follow-button-wrapper {
          width: auto !important;
          flex: 0 0 auto !important;
        }

        #portfolio-v3 .eapps-instagram-feed-header-follow-button {
          width: auto !important;
          min-width: 140px !important;
          height: 40px !important;
          padding: 0 16px !important;
          border-radius: 10px !important;
        }

        #portfolio-v3 .eapps-instagram-feed-posts-container {
          overflow: hidden !important;
        }

        #portfolio-v3 .eapps-instagram-feed-posts-slider {
          overflow: hidden !important;
          background: transparent !important;
        }

        #portfolio-v3 .eapps-instagram-feed-posts-slider-inner {
          display: flex !important;
          width: auto !important;
          min-width: 100% !important;
          height: auto !important;
        }

        #portfolio-v3 .eapps-instagram-feed-posts-view {
          display: flex !important;
          flex: 0 0 100% !important;
          flex-wrap: wrap !important;
          width: 100% !important;
          height: auto !important;
        }

        #portfolio-v3 .eapps-instagram-feed-posts-item {
          margin: 0 !important;
          border: 0 !important;
          box-shadow: none !important;
          overflow: hidden !important;
          background: #0e0904 !important;
        }

        #portfolio-v3 .eapps-instagram-feed-posts-item-link,
        #portfolio-v3 .eapps-instagram-feed-posts-item-media,
        #portfolio-v3 .eapps-instagram-feed-posts-item-image-wrapper {
          width: 100% !important;
          background: #0e0904 !important;
          line-height: 0 !important;
          font-size: 0 !important;
          overflow: hidden !important;
        }

        #portfolio-v3 .eapps-instagram-feed-posts-item-image-wrapper {
          background: #0e0904 !important;
        }

        #portfolio-v3 .eapps-instagram-feed-posts-item-image {
          display: block !important;
          object-fit: cover !important;
          width: 100% !important;
          height: 100% !important;
          top: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          left: 0 !important;
          transform: none !important;
          box-shadow: inset 0 0 0 1px #0e0904 !important;
        }

        #portfolio-v3 .eapps-instagram-feed-posts-item-image-icon {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 0 !important;
          top: 14px !important;
          right: 14px !important;
          left: auto !important;
          width: 34px !important;
          height: 34px !important;
          border-radius: 999px !important;
          overflow: hidden !important;
          background: rgba(9, 6, 3, 0.68) !important;
          backdrop-filter: blur(8px) !important;
          border: 1px solid rgba(255, 228, 176, 0.16) !important;
          color: #fff6de !important;
          text-align: center !important;
          line-height: 1 !important;
          font-size: 14px !important;
        }

        #portfolio-v3 .eapps-instagram-feed-posts-item-image-icon svg {
          width: 16px !important;
          height: 16px !important;
          flex: 0 0 16px !important;
        }

        #portfolio-v3 .eapps-instagram-feed-posts-item[data-preview-kind="reel"] .eapps-instagram-feed-posts-item-image-icon-video {
          display: flex !important;
        }

        #portfolio-v3 .eapps-instagram-feed-posts-item[data-preview-kind="reel"] .eapps-instagram-feed-posts-item-image-icon-carousel {
          display: none !important;
        }

        #portfolio-v3 .eapps-instagram-feed-posts-item[data-preview-kind="post"] .eapps-instagram-feed-posts-item-image-icon-video {
          display: none !important;
        }

        #portfolio-v3 .eapps-instagram-feed-posts-item[data-preview-kind="post"] .eapps-instagram-feed-posts-item-image-icon-carousel {
          display: flex !important;
        }

        #portfolio-v3 .eapps-instagram-feed-popup-item-media-carousel-arrow {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 42px !important;
          height: 42px !important;
          border-radius: 999px !important;
          background: rgba(9, 6, 3, 0.72) !important;
          border: 1px solid rgba(255, 228, 176, 0.18) !important;
          color: #fff6de !important;
          opacity: 0.94 !important;
          backdrop-filter: blur(10px) !important;
          transition:
            background-color 0.25s ease,
            border-color 0.25s ease,
            transform 0.25s ease,
            opacity 0.25s ease !important;
        }

        #portfolio-v3 .eapps-instagram-feed-popup-item-media-carousel-arrow:hover {
          transform: scale(1.04);
          background: rgba(26, 15, 5, 0.88) !important;
          border-color: rgba(255, 207, 112, 0.42) !important;
        }

        #portfolio-v3 .eapps-instagram-feed-popup-item-media-carousel-arrow-disabled {
          opacity: 0.35 !important;
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
              Latest <span className="molten-highlight">Work</span>
            </h2>
            <p className="max-w-2xl text-lg font-light leading-relaxed text-gray-400">
              {WIDGET_PORTFOLIO_DESCRIPTION}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1420px] px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#12100c]/95 shadow-[0_24px_80px_rgba(0,0,0,0.38)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-wolf-red/50 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(199,161,74,0.08),transparent_42%)]" />
          <div className="relative">
            {!isWidgetReady ? (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[linear-gradient(180deg,rgba(9,9,9,0.74),rgba(9,9,9,0.9))] px-6 text-center">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-wolf-red" />
                <p className="text-xs font-heading font-bold uppercase tracking-[0.24em] text-gray-300">
                  Loading Instagram Feed
                </p>
                <p className="max-w-md text-sm text-gray-500">
                  {hasWidgetFailed
                    ? "The Elfsight embed is taking longer than expected. Try reloading it once."
                    : "Loading the full Instagram feed for this section."}
                </p>
                {hasWidgetFailed ? (
                  <button
                    type="button"
                    onClick={() => {
                      setHasWidgetFailed(false);
                      setWidgetAttempt((current) => current + 1);
                    }}
                    className="mt-2 inline-flex items-center rounded-full border border-wolf-red/40 px-4 py-2 text-[11px] font-heading font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-wolf-red hover:text-wolf-black"
                  >
                    Retry Widget
                  </button>
                ) : null}
              </div>
            ) : null}

            <div className="relative p-0">
              <div
                key={widgetAttempt}
                ref={widgetRef}
                className={ELFSIGHT_APP_CLASS}
                data-elfsight-app-lazy=""
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
