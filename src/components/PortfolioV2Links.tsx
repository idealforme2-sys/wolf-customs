import { useMemo } from "react";
import { motion } from "framer-motion";
import { useSiteContent } from "./SiteContentProvider";

const urlsGlob = import.meta.glob<{ default: string }>("../assets/Instagram reels and posts/**/url.txt", {
  eager: true,
  query: "?raw",
});

interface EmbedItem {
  id: string;
  type: "post" | "reel";
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

const getFolderName = (path: string) => {
  const parts = path.split("/");
  return parts[parts.length - 2];
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

const normalizeInstagramUrl = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  try {
    const parsed = new URL(trimmed);
    const cleanedPath = parsed.pathname.endsWith("/") ? parsed.pathname : `${parsed.pathname}/`;
    return `${parsed.origin}${cleanedPath}`;
  } catch {
    return "";
  }
};

const getEmbedUrl = (url: string) => {
  const normalized = normalizeInstagramUrl(url);
  if (!normalized) {
    return "";
  }

  try {
    const parsed = new URL(normalized);
    return `${parsed.origin}${parsed.pathname}embed/`;
  } catch {
    return "";
  }
};

const fallbackEmbedItems: EmbedItem[] = Object.entries(urlsGlob)
  .map(([path, module]) => {
    const folder = getFolderName(path);
    return {
      id: folder,
      type: (folder.startsWith("Reel") ? "reel" : "post") as EmbedItem["type"],
      link: normalizeInstagramUrl(module.default),
    };
  })
  .filter((item) => item.link)
  .sort((a, b) => compareFolders(a.id, b.id));

function EmbedCard({ item }: { item: EmbedItem }) {
  const embedUrl = getEmbedUrl(item.link);
  const crop = EMBED_CROP_MAP[item.id] ?? (item.type === "reel"
    ? { frame: "h-[610px] md:h-[690px]", iframe: "h-[980px] md:h-[1060px]" }
    : { frame: "h-[500px] md:h-[560px]", iframe: "h-[820px] md:h-[900px]" });

  return (
    <div className="break-inside-avoid overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
      <div className="bg-[radial-gradient(circle_at_top,rgba(230,0,0,0.08),transparent_32%),linear-gradient(180deg,#141414,#090909)] p-2">
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

export default function PortfolioV2Links() {
  const { content } = useSiteContent();

  const embedItems = useMemo<EmbedItem[]>(() => {
    const managedItems = content.portfolio.items
      .map((item, index) => {
        const normalizedLink = normalizeInstagramUrl(item.link);
        if (!normalizedLink) {
          return null;
        }

        return {
          id: item.label.trim() || `${item.type === "reel" ? "Reel" : "Post"} ${index + 1}`,
          type: item.type,
          link: normalizedLink,
        } satisfies EmbedItem;
      })
      .filter((item): item is EmbedItem => item !== null);

    return managedItems.length ? managedItems : fallbackEmbedItems;
  }, [content.portfolio.items]);

  return (
    <section id="portfolio-v2" className="relative bg-[linear-gradient(180deg,#070707,#020202)] py-28 text-white">
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
              Latest <span className="text-wolf-red">Work</span>
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
                <EmbedCard item={item} />
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
