export type PortfolioInstagramItem = {
  label: string;
  type: "post" | "reel";
  media: string[];
  link: string;
};

const urlsGlob = import.meta.glob<{ default: string }>("../assets/Instagram reels and posts/**/url.txt", {
  eager: true,
  query: "?raw",
});

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

export const normalizeInstagramUrl = (value: string) => {
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

export const getInstagramEmbedUrl = (url: string) => {
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

export const getInstagramItemType = (value: string): "post" | "reel" => {
  const normalized = normalizeInstagramUrl(value);
  return normalized.includes("/reel/") ? "reel" : "post";
};

export const fallbackPortfolioItems: PortfolioInstagramItem[] = Object.entries(urlsGlob)
  .map(([path, module]) => {
    const label = getFolderName(path);
    return {
      label,
      type: (label.startsWith("Reel") ? "reel" : "post") as PortfolioInstagramItem["type"],
      media: [""],
      link: normalizeInstagramUrl(module.default),
    };
  })
  .filter((item) => item.link)
  .sort((a, b) => compareFolders(a.label, b.label));

export const clonePortfolioItems = (items: PortfolioInstagramItem[]) =>
  items.map((item) => ({
    ...item,
    media: item.media.length ? [...item.media] : [""],
  }));

export const resolvePortfolioItems = <T extends PortfolioInstagramItem>(items: T[], useCustomItems = false) =>
  useCustomItems || items.length ? items : (clonePortfolioItems(fallbackPortfolioItems) as T[]);
