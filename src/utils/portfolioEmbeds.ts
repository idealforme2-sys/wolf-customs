export type PortfolioEmbedItem = {
  label: string;
  type: "post" | "reel";
  media: string[];
  link: string;
};

type PortfolioPlatform = "instagram" | "facebook";

type ParsedPortfolioSource = {
  embedUrl: string | null;
  targetUrl: URL;
};

const urlsGlob = import.meta.glob<{ default: string }>("../assets/Instagram reels and posts/**/url.txt", {
  eager: true,
  query: "?raw",
});

const facebookShowcaseLinksGlob = import.meta.glob<{ default: string }>("/facebook portoflio showcase/**/*.txt", {
  eager: true,
  query: "?raw",
});

const facebookShowcaseMediaGlob = import.meta.glob<{ default: string }>(
  "/facebook portoflio showcase/**/*.{jpg,jpeg,png,webp,avif,mp4,webm,mov}",
  { eager: true },
);

const FACEBOOK_HOSTS = new Set(["facebook.com", "www.facebook.com", "m.facebook.com", "web.facebook.com"]);
const INSTAGRAM_HOSTS = new Set(["instagram.com", "www.instagram.com", "m.instagram.com"]);

const getFolderName = (path: string) => {
  const parts = path.split("/");
  return parts[parts.length - 2];
};

const getFolderNumber = (value: string) => parseInt(value.replace(/\D/g, ""), 10) || 0;

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

const compareShowcaseFolders = (a: string, b: string) => getFolderNumber(a) - getFolderNumber(b);

const isVideoFile = (path: string) => /\.(mp4|webm|mov)$/i.test(path);

const normalizeFacebookHost = (host: string) => {
  if (FACEBOOK_HOSTS.has(host)) {
    return "www.facebook.com";
  }

  return host;
};

const normalizeInstagramHost = (host: string) => {
  if (INSTAGRAM_HOSTS.has(host)) {
    return "www.instagram.com";
  }

  return host;
};

const extractIframeSrc = (value: string) => {
  const match = value.match(/src=(["'])(.*?)\1/i);
  return match?.[2]?.trim() ?? null;
};

const parsePortfolioSource = (value: string): ParsedPortfolioSource | null => {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const candidate = extractIframeSrc(trimmed) ?? trimmed;

  try {
    const parsed = new URL(candidate);
    const isFacebookPlugin =
      FACEBOOK_HOSTS.has(parsed.hostname.toLowerCase()) &&
      (parsed.pathname === "/plugins/post.php" || parsed.pathname === "/plugins/video.php");

    if (isFacebookPlugin) {
      const href = parsed.searchParams.get("href");
      if (!href) {
        return null;
      }

      const targetUrl = new URL(href);
      parsed.hash = "";
      parsed.hostname = normalizeFacebookHost(parsed.hostname.toLowerCase());
      return {
        embedUrl: parsed.toString(),
        targetUrl,
      };
    }

    return {
      embedUrl: null,
      targetUrl: parsed,
    };
  } catch {
    return null;
  }
};

const getPortfolioPlatform = (value: URL): PortfolioPlatform | null => {
  const host = value.hostname.toLowerCase();

  if (FACEBOOK_HOSTS.has(host)) {
    return "facebook";
  }

  if (INSTAGRAM_HOSTS.has(host)) {
    return "instagram";
  }

  return null;
};

export const normalizePortfolioUrl = (value: string) => {
  const parsedSource = parsePortfolioSource(value);
  if (!parsedSource) {
    return "";
  }

  const parsed = parsedSource.targetUrl;
  const platform = getPortfolioPlatform(parsed);

  if (!platform) {
    return "";
  }

  parsed.hash = "";

  if (platform === "instagram") {
    parsed.hostname = normalizeInstagramHost(parsed.hostname.toLowerCase());
    parsed.search = "";
    parsed.pathname = parsed.pathname.endsWith("/") ? parsed.pathname : `${parsed.pathname}/`;
    return `${parsed.origin}${parsed.pathname}`;
  }

  parsed.hostname = normalizeFacebookHost(parsed.hostname.toLowerCase());
  parsed.pathname = parsed.pathname.endsWith("/") ? parsed.pathname : `${parsed.pathname}/`;
  return `${parsed.origin}${parsed.pathname}${parsed.search}`;
};

export const getPortfolioEmbedUrl = (url: string) => {
  const parsedSource = parsePortfolioSource(url);
  if (parsedSource?.embedUrl) {
    return parsedSource.embedUrl;
  }

  const normalized = normalizePortfolioUrl(url);
  if (!normalized) {
    return "";
  }

  try {
    const parsed = new URL(normalized);
    const platform = getPortfolioPlatform(parsed);

    if (platform === "instagram") {
      return `${parsed.origin}${parsed.pathname}embed/`;
    }

    if (parsed.pathname.includes("/reel/") || parsed.pathname.includes("/videos/")) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(normalized)}&show_text=false&width=267&height=476&t=0`;
    }

    return `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(normalized)}&show_text=true&width=500`;
  } catch {
    return "";
  }
};

export const getPortfolioItemType = (value: string): "post" | "reel" => {
  const normalized = normalizePortfolioUrl(value);
  return normalized.includes("instagram.com/reel/") || normalized.includes("facebook.com/reel/") || normalized.includes("facebook.com/videos/")
    ? "reel"
    : "post";
};

const facebookShowcaseItems: PortfolioEmbedItem[] = (() => {
  const linksByFolder = new Map<string, string>();
  const mediaByFolder = new Map<string, string[]>();

  Object.entries(facebookShowcaseLinksGlob).forEach(([path, module]) => {
    const folder = getFolderName(path);
    linksByFolder.set(folder, normalizePortfolioUrl(module.default));
  });

  Object.entries(facebookShowcaseMediaGlob)
    .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
    .forEach(([path, module]) => {
      const folder = getFolderName(path);
      const current = mediaByFolder.get(folder) ?? [];
      current.push(module.default);
      mediaByFolder.set(folder, current);
    });

  return Array.from(new Set([...linksByFolder.keys(), ...mediaByFolder.keys()]))
    .sort(compareShowcaseFolders)
    .map((folder) => {
      const media = mediaByFolder.get(folder) ?? [];
      const labelNumber = getFolderNumber(folder) || 0;
      const hasVideo = media.some((value) => isVideoFile(value));
      return {
        label: `Showcase ${labelNumber || folder}`,
        type: hasVideo ? "reel" : "post",
        media,
        link: linksByFolder.get(folder) ?? "",
      } satisfies PortfolioEmbedItem;
    })
    .filter((item) => item.media.length > 0);
})();

const legacyEmbedItems: PortfolioEmbedItem[] = Object.entries(urlsGlob)
  .map(([path, module]) => {
    const label = getFolderName(path);
    return {
      label,
      type: (label.startsWith("Reel") ? "reel" : "post") as PortfolioEmbedItem["type"],
      media: [""],
      link: normalizePortfolioUrl(module.default),
    };
  })
  .filter((item) => item.link)
  .sort((a, b) => compareFolders(a.label, b.label));

export const fallbackPortfolioItems: PortfolioEmbedItem[] = facebookShowcaseItems.length ? facebookShowcaseItems : legacyEmbedItems;

export const clonePortfolioItems = (items: PortfolioEmbedItem[]) =>
  items.map((item) => ({
    ...item,
    media: item.media.length ? [...item.media] : [""],
  }));

export const resolvePortfolioItems = <T extends PortfolioEmbedItem>(items: T[], useCustomItems = false) =>
  useCustomItems || items.length ? items : (clonePortfolioItems(fallbackPortfolioItems) as T[]);
