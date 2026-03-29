import { useState, useEffect, useRef, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Volume2, VolumeX, ExternalLink } from "lucide-react";
import { useSiteContent } from "./SiteContentProvider";

const urlsGlob = import.meta.glob<{ default: string }>("../assets/Instagram reels and posts/**/url.txt", {
  eager: true,
  query: "?raw",
});

const mediaGlob = import.meta.glob<{ default: string }>(
  "../assets/Instagram reels and posts/**/*.{jpg,jpeg,png,webp,avif,mp4,webm,mov}",
  { eager: true },
);

interface MediaItem {
  id: string;
  type: "post" | "reel";
  media: string[];
  link: string;
}

const getFolderName = (path: string) => {
  const parts = path.split("/");
  return parts[parts.length - 2];
};

const normalizeInstagramUrl = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  try {
    const parsed = new URL(trimmed);
    const cleanedPath = parsed.pathname.endsWith("/") ? parsed.pathname : `${parsed.pathname}/`;
    return `${parsed.origin}${cleanedPath}${parsed.search}`;
  } catch {
    return "";
  }
};

const compareFolders = (a: string, b: string) => {
  const typeA = a.startsWith("Reel") ? "reel" : "post";
  const typeB = b.startsWith("Reel") ? "reel" : "post";

  if (typeA !== typeB) {
    return typeA === "post" ? -1 : 1;
  }

  const numA = parseInt(a.replace(/\D/g, ""), 10) || 0;
  const numB = parseInt(b.replace(/\D/g, ""), 10) || 0;
  return numA - numB;
};

const localPortfolioItems: MediaItem[] = (() => {
  const linksByFolder = new Map<string, string>();
  const mediaByFolder = new Map<string, string[]>();

  Object.entries(urlsGlob)
    .sort(([pathA], [pathB]) => compareFolders(getFolderName(pathA), getFolderName(pathB)))
    .forEach(([path, module]) => {
      linksByFolder.set(getFolderName(path), normalizeInstagramUrl(module.default));
    });

  Object.entries(mediaGlob)
    .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
    .forEach(([path, module]) => {
      const folder = getFolderName(path);
      const current = mediaByFolder.get(folder) ?? [];
      current.push(module.default);
      mediaByFolder.set(folder, current);
    });

  return Array.from(new Set([...linksByFolder.keys(), ...mediaByFolder.keys()]))
    .sort(compareFolders)
    .map((folder) => ({
      id: folder,
      type: (folder.startsWith("Reel") ? "reel" : "post") as MediaItem["type"],
      media: mediaByFolder.get(folder) ?? [],
      link: linksByFolder.get(folder) ?? "",
    }))
    .filter((item) => item.media.length > 0);
})();

const PostCard = ({ item }: { item: MediaItem }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = (e: MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === item.media.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e: MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? item.media.length - 1 : prev - 1));
  };

  const handleOpenLink = () => {
    if (item.link) window.open(item.link, "_blank");
  };

  return (
    <div
      className="group relative w-full aspect-[4/5] overflow-hidden rounded-lg border border-wolf-gunmetal bg-wolf-black transition-colors duration-500 hover:border-wolf-red/50"
      onClick={handleOpenLink}
    >
      <div className="absolute inset-0 z-0 transition-transform duration-700 ease-in-out group-hover:scale-105">
        <img src={item.media[currentIndex]} alt={item.id} className="h-full w-full object-cover" />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-wolf-black via-transparent to-transparent opacity-60" />

      {item.media.length > 1 ? (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity hover:bg-wolf-red hover:text-wolf-black group-hover:opacity-100"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity hover:bg-wolf-red hover:text-wolf-black group-hover:opacity-100"
          >
            <ChevronRight size={18} />
          </button>
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
            {item.media.map((_, index) => (
              <div key={index} className={`h-1.5 w-1.5 rounded-full ${index === currentIndex ? "bg-wolf-red" : "bg-white/50"}`} />
            ))}
          </div>
        </>
      ) : null}

      <div className="absolute top-4 right-4 z-20 scale-75 opacity-0 transition-opacity duration-300 group-hover:scale-100 group-hover:opacity-100">
        <div className="flex h-10 w-10 items-center justify-center rounded border border-white/20 bg-wolf-red text-wolf-black shadow-lg">
          <ExternalLink size={18} />
        </div>
      </div>
    </div>
  );
};

const ReelCard = ({ item }: { item: MediaItem }) => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => {});
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.5 },
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  const toggleMute = (event: MouseEvent) => {
    event.stopPropagation();
    setIsMuted((current) => {
      const next = !current;
      if (videoRef.current) {
        videoRef.current.muted = next;
      }
      return next;
    });
  };

  const handleOpenLink = () => {
    if (item.link) window.open(item.link, "_blank");
  };

  return (
    <div
      className="group relative w-full aspect-[9/16] cursor-pointer overflow-hidden rounded-lg border border-wolf-gunmetal bg-wolf-black transition-colors duration-500 hover:border-wolf-red/50"
      onClick={handleOpenLink}
    >
      <video
        ref={videoRef}
        src={item.media[0]}
        autoPlay
        loop
        preload="metadata"
        playsInline
        muted={isMuted}
        onCanPlay={() => {
          videoRef.current?.play().catch(() => {});
        }}
        className="z-0 h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
      />

      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-wolf-black via-transparent to-transparent opacity-60" />

      <button
        onClick={toggleMute}
        className="absolute bottom-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity hover:bg-wolf-red hover:text-wolf-black group-hover:opacity-100"
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          handleOpenLink();
        }}
        className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded border border-white/20 bg-wolf-red text-wolf-black shadow-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      >
        <ExternalLink size={18} />
      </button>
    </div>
  );
};

export default function Portfolio() {
  const { content } = useSiteContent();

  return (
    <section id="portfolio" className="relative bg-wolf-black py-32">
      <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-wolf-red/30 to-transparent" />

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
                {content.portfolio.eyebrow}
              </span>
            </div>
            <h2 className="mb-6 text-5xl font-heading font-black uppercase leading-none tracking-tighter text-white md:text-7xl">
              {content.portfolio.title} <span className="molten-highlight">{content.portfolio.highlight}</span>
            </h2>
            <p className="max-w-2xl text-lg font-light leading-relaxed text-gray-400">
              {content.portfolio.description}
            </p>
          </motion.div>
        </div>

        {localPortfolioItems.length ? (
          <div className="columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3 xl:columns-4">
            {localPortfolioItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
                className="break-inside-avoid relative"
              >
                {item.type === "post" ? <PostCard item={item} /> : <ReelCard item={item} />}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-12 text-center text-sm text-gray-400">
            No portfolio items are available right now.
          </div>
        )}
      </div>
    </section>
  );
}
