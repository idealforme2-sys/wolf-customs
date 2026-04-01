import { useEffect, useMemo, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, Volume2, VolumeX } from "lucide-react";
import { useSiteContent } from "./SiteContentProvider";
import { getInstagramEmbedUrl, getInstagramItemType, normalizeInstagramUrl, resolvePortfolioItems } from "../utils/portfolioInstagram";

interface EmbedItem {
  id: string;
  type: "post" | "reel";
  media: string[];
  link: string;
}

const EMBED_CROP_MAP: Record<string, { frame: string; iframe: string }> = {
  "Post 1": { frame: "h-[610px] md:h-[690px]", iframe: "h-[820px] md:h-[900px]" },
  "Post 2": { frame: "h-[470px] md:h-[530px]", iframe: "h-[820px] md:h-[900px]" },
  "Post 3": { frame: "h-[500px] md:h-[560px]", iframe: "h-[820px] md:h-[900px]" },
  "Post 4": { frame: "h-[500px] md:h-[560px]", iframe: "h-[820px] md:h-[900px]" },
  "Post 5": { frame: "h-[500px] md:h-[560px]", iframe: "h-[820px] md:h-[900px]" },
  "Reel 1": { frame: "h-[610px] md:h-[690px]", iframe: "h-[980px] md:h-[1060px]" },
  "Reel 2": { frame: "h-[540px] md:h-[620px]", iframe: "h-[980px] md:h-[1060px]" },
  "Reel 3": { frame: "h-[640px] md:h-[720px]", iframe: "h-[980px] md:h-[1060px]" },
  "Reel 4": { frame: "h-[610px] md:h-[690px]", iframe: "h-[980px] md:h-[1060px]" },
  "Reel 5": { frame: "h-[610px] md:h-[690px]", iframe: "h-[980px] md:h-[1060px]" },
  "Reel 6": { frame: "h-[610px] md:h-[690px]", iframe: "h-[980px] md:h-[1060px]" },
  "Reel 7": { frame: "h-[590px] md:h-[670px]", iframe: "h-[980px] md:h-[1060px]" },
};

const EMBED_PORTFOLIO_DESCRIPTION =
  "This version is simple: you paste the Instagram post or reel link into the owner dashboard, and that content will show on the website. I recommend it because it allows you to select handpicked posts and reels that best represent the business, which is often better than showing every single piece of Instagram content.";

function EmbedCard({ item }: { item: EmbedItem }) {
  const embedUrl = getInstagramEmbedUrl(item.link);
  const crop = EMBED_CROP_MAP[item.id] ?? (item.type === "reel"
    ? { frame: "h-[610px] md:h-[690px]", iframe: "h-[980px] md:h-[1060px]" }
    : { frame: "h-[500px] md:h-[560px]", iframe: "h-[820px] md:h-[900px]" });

  return (
    <div className="break-inside-avoid overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
      <div className="bg-[radial-gradient(circle_at_top,rgba(199,161,74,0.12),transparent_32%),linear-gradient(180deg,#161109,#090603)] p-2">
        <div className={`overflow-hidden rounded-[24px] border border-white/8 bg-black ${crop.frame}`}>
          <iframe
            title={item.id}
            src={embedUrl}
            className={`w-full border-0 ${crop.iframe}`}
            loading="lazy"
            allowTransparency={true}
            allow="encrypted-media"
          />
        </div>
      </div>
    </div>
  );
}

function PreviewShell({ children }: { children: ReactNode }) {
  return (
    <div className="break-inside-avoid overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
      <div className="bg-[radial-gradient(circle_at_top,rgba(199,161,74,0.12),transparent_32%),linear-gradient(180deg,#161109,#090603)] p-2">
        {children}
      </div>
    </div>
  );
}

function PostPreviewCard({ item }: { item: EmbedItem }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const media = item.media.filter((value) => value.trim());
  const currentMedia = media[currentIndex] ?? "";

  const nextSlide = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  return (
    <PreviewShell>
      <div className="group relative overflow-hidden rounded-[24px] border border-white/8 bg-black aspect-[4/5]">
        {currentMedia ? <img src={currentMedia} alt={item.id} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /> : null}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

        {media.length > 1 ? (
          <>
            <button
              type="button"
              onClick={prevSlide}
              className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/55 text-white transition-colors hover:border-wolf-red hover:bg-wolf-red hover:text-wolf-black"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/55 text-white transition-colors hover:border-wolf-red hover:bg-wolf-red hover:text-wolf-black"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
              {media.map((_, index) => (
                <span
                  key={index}
                  className={`h-1.5 w-1.5 rounded-full ${index === currentIndex ? "bg-wolf-red" : "bg-white/45"}`}
                />
              ))}
            </div>
          </>
        ) : null}

        {item.link ? (
          <a
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-black/55 text-white transition-colors hover:border-wolf-red hover:bg-wolf-red hover:text-wolf-black"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        ) : null}
      </div>
    </PreviewShell>
  );
}

function ReelPreviewCard({ item }: { item: EmbedItem }) {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoSrc = item.media.find((value) => value.trim()) ?? "";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <PreviewShell>
      <div className="group relative overflow-hidden rounded-[24px] border border-white/8 bg-black aspect-[9/14]">
        {videoSrc ? (
          <video
            ref={videoRef}
            src={videoSrc}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="metadata"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : null}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

        <button
          type="button"
          onClick={() => {
            setIsMuted((current) => {
              const next = !current;
              if (videoRef.current) {
                videoRef.current.muted = next;
              }
              return next;
            });
          }}
          className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-black/55 text-white transition-colors hover:border-wolf-red hover:bg-wolf-red hover:text-wolf-black"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>

        {item.link ? (
          <a
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-black/55 text-white transition-colors hover:border-wolf-red hover:bg-wolf-red hover:text-wolf-black"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        ) : null}
      </div>
    </PreviewShell>
  );
}

export default function PortfolioV2Links() {
  const { content } = useSiteContent();

  const embedItems = useMemo<EmbedItem[]>(() => {
    return resolvePortfolioItems(content.portfolio.items, content.portfolio.useCustomItems)
      .map((item, index) => {
        const normalizedLink = normalizeInstagramUrl(item.link);
        const media = item.media.filter((value) => value.trim());

        if (!normalizedLink && media.length === 0) {
          return null;
        }

        const resolvedType = media.length ? item.type : getInstagramItemType(normalizedLink);

        return {
          id: item.label.trim() || `${resolvedType === "reel" ? "Reel" : "Post"} ${index + 1}`,
          type: resolvedType,
          media,
          link: normalizedLink,
        } satisfies EmbedItem;
      })
      .filter((item): item is EmbedItem => item !== null);
  }, [content.portfolio.items, content.portfolio.useCustomItems]);

  return (
    <section id="portfolio-v2" className="relative bg-[linear-gradient(180deg,#0b0804,#050301)] py-28 text-white">
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-wolf-red/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
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
                Portfolio Ver 2
              </span>
            </div>
            <h2 className="mb-6 text-5xl font-heading font-black uppercase leading-none tracking-tighter text-white md:text-7xl">
              Latest <span className="molten-highlight">Work</span>
            </h2>
            <p className="max-w-2xl text-lg font-light leading-relaxed text-gray-400">
              {EMBED_PORTFOLIO_DESCRIPTION}
            </p>
          </motion.div>
        </div>

        {embedItems.length ? (
          <div className="columns-1 gap-6 space-y-6 md:columns-2 xl:columns-3">
            {embedItems.map((item) => (
              <div key={item.id} className="break-inside-avoid">
                {item.media.length ? (
                  item.type === "reel" ? <ReelPreviewCard item={item} /> : <PostPreviewCard item={item} />
                ) : (
                  <EmbedCard item={item} />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-12 text-center text-sm text-gray-400">
            No portfolio links are available right now.
          </div>
        )}
      </div>
    </section>
  );
}
