import { useEffect, useMemo, useState, type ReactNode } from "react";
import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import {
  Blocks,
  Building2,
  Camera,
  CheckCircle2,
  ChevronDown,
  Film,
  Globe,
  House,
  ImagePlus,
  LayoutTemplate,
  Loader2,
  MapPin,
  MessageSquareText,
  Phone,
  Plus,
  RefreshCw,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  Undo2,
  Upload,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { defaultSiteContent, mergeSiteContent, type SiteContent } from "../siteContent";
import {
  clonePortfolioItems,
  getPortfolioEmbedUrl,
  getPortfolioItemType as getPortfolioItemTypeFromUrl,
  normalizePortfolioUrl,
  resolvePortfolioItems,
} from "../utils/portfolioEmbeds";
import { uploadToCloudinary } from "../utils/cloudinary";

type SectionId =
  | "top-banner"
  | "hero"
  | "feature-highlights"
  | "services"
  | "before-after"
  | "gallery"
  | "portfolio"
  | "faq"
  | "cta"
  | "contact";

type SectionStatus = "live" | "draft";

type SectionDefinition = {
  id: SectionId;
  group: string;
  navLabel: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

const fieldClassName =
  "w-full rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(206,214,225,0.06),rgba(10,7,3,0.58))] px-4 py-3.5 text-sm text-white shadow-[inset_0_1px_0_rgba(221,228,236,0.05),0_14px_30px_rgba(0,0,0,0.16)] placeholder:text-gray-600 transition-colors focus:border-wolf-red focus:outline-none focus:ring-2 focus:ring-wolf-red/20";

const recommendedSectionOrder: SectionId[] = ["hero", "services", "portfolio", "contact"];

const sectionDefinitions: SectionDefinition[] = [
  { id: "top-banner", group: "Homepage", navLabel: "Top Bar Message", title: "Top Bar Message", description: "This slim bar sits above the menu and is useful for a quick message or phone number.", icon: Sparkles },
  { id: "hero", group: "Homepage", navLabel: "Website Intro", title: "Website Intro", description: "This is the first section visitors see when they land on your website.", icon: LayoutTemplate },
  { id: "feature-highlights", group: "Homepage", navLabel: "Why Customers Trust You", title: "Why Customers Trust You", description: "These quick highlights build trust before visitors scroll further.", icon: Sparkles },
  { id: "services", group: "Visual Showcase", navLabel: "Your Main Services", title: "Your Main Services", description: "Show the services you want customers to notice first, along with the visuals that represent them.", icon: Blocks },
  { id: "before-after", group: "Visual Showcase", navLabel: "Before & After Showcase", title: "Before & After Showcase", description: "This compares a before and after result so people can quickly see the impact of your work.", icon: Sparkles },
  { id: "gallery", group: "Visual Showcase", navLabel: "Featured Work", title: "Featured Work", description: "This row highlights selected work examples with supporting text.", icon: ImagePlus },
  { id: "portfolio", group: "Showcase & Trust", navLabel: "Facebook Showcase", title: "Facebook Showcase", description: "Manage the Facebook posts and custom previews you want to feature on the website showcase.", icon: MessageSquareText },
  { id: "faq", group: "Showcase & Trust", navLabel: "Questions Customers Ask", title: "Questions Customers Ask", description: "Answer the questions customers ask most often so they feel confident reaching out.", icon: MessageSquareText },
  { id: "cta", group: "Showcase & Trust", navLabel: "Get In Touch Section", title: "Get In Touch Section", description: "This section encourages visitors to contact you or request a quote.", icon: Sparkles },
  { id: "contact", group: "Business Details", navLabel: "Business Details", title: "Business Details", description: "Keep your contact details, address, hours, and social links up to date.", icon: MapPin },
];

const sectionDefinitionMap = Object.fromEntries(sectionDefinitions.map((section) => [section.id, section])) as Record<SectionId, SectionDefinition>;
const sectionGroupDescriptions: Record<string, string> = {
  Homepage: "Top-of-page messaging, intro copy, and trust-building highlights.",
  "Visual Showcase": "Core service visuals, before-and-after proof, and featured work.",
  "Showcase & Trust": "Social proof, common questions, and the main contact prompt.",
  "Business Details": "Contact details, social links, and advanced tap-to-call or map settings.",
};
const sectionGroupTitleParts: Record<string, [string, string?]> = {
  Homepage: ["HOME", "PAGE"],
  "Visual Showcase": ["VISUAL", "SHOWCASE"],
  "Showcase & Trust": ["SHOWCASE", "& TRUST"],
  "Business Details": ["BUSINESS", "DETAILS"],
};
const sectionGroupStyles: Record<
  string,
  {
    icon: LucideIcon;
  }
> = {
  Homepage: {
    icon: House,
  },
  "Visual Showcase": {
    icon: Camera,
  },
  "Showcase & Trust": {
    icon: ShieldCheck,
  },
  "Business Details": {
    icon: Building2,
  },
};

function serialize(value: unknown) {
  return JSON.stringify(value);
}

function truncateText(value: string, max = 120) {
  if (!value) return "No summary yet.";
  return value.length > max ? `${value.slice(0, max - 1)}...` : value;
}

function formatPublishedLabel(value: Date | null) {
  if (!value) return "Not published yet";
  return value.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

const getResolvedPortfolioItems = (source: SiteContent) =>
  resolvePortfolioItems(source.portfolio.items, source.portfolio.useCustomItems);

const getPortfolioItemType = (item: SiteContent["portfolio"]["items"][number]) => {
  const hasUploadedMedia = item.media.some((mediaUrl) => mediaUrl.trim());
  if (hasUploadedMedia) {
    return item.type === "reel" ? "reel" : "post";
  }

  return normalizePortfolioUrl(item.link) ? getPortfolioItemTypeFromUrl(item.link) : "post";
};

function buildSectionSnapshots(source: SiteContent): Record<SectionId, unknown> {
  return {
    "top-banner": source.topBanner,
    hero: source.hero,
    "feature-highlights": source.services.features,
    services: {
      eyebrow: source.services.eyebrow,
      title: source.services.title,
      highlight: source.services.highlight,
      description: source.services.description,
      items: source.services.items,
    },
    "before-after": source.beforeAfter,
    gallery: source.gallery,
    portfolio: source.portfolio,
    faq: source.faq,
    cta: source.cta,
    contact: {
      contact: source.contact,
      business: source.business,
    },
  };
}

function buildSectionSummaries(source: SiteContent): Record<SectionId, string> {
  const portfolioItems = getResolvedPortfolioItems(source).filter(
    (item) => item.link.trim() || item.media.some((mediaUrl) => mediaUrl.trim()),
  );
  const portfolioCustomCount = portfolioItems.filter((item) => item.media.some((mediaUrl) => mediaUrl.trim())).length;

  return {
    "top-banner": truncateText(source.topBanner.text),
    hero: truncateText(source.hero.description),
    "feature-highlights": source.services.features.map((feature) => feature.title).filter(Boolean).join(" • ") || "Trust highlights ready",
    services: `${source.services.items.length} service cards ready`,
    "before-after": `${source.beforeAfter.beforeLabel} to ${source.beforeAfter.afterLabel}`,
    gallery: `${source.gallery.items.length} showcase cards`,
    portfolio: portfolioItems.length
      ? `${portfolioItems.length} selected item${portfolioItems.length === 1 ? "" : "s"} • ${portfolioCustomCount} custom preview${portfolioCustomCount === 1 ? "" : "s"}`
      : "Default showcase embed setup",
    faq: `${source.faq.items.length} common question${source.faq.items.length === 1 ? "" : "s"}`,
    cta: truncateText(source.cta.buttonLabel || source.cta.description, 70),
    contact: [source.business.phoneDisplay, source.business.email].filter(Boolean).join(" • ") || "Business details ready",
  };
}

function buildPremiumSectionSummaries(source: SiteContent): Record<SectionId, string> {
  const portfolioItems = getResolvedPortfolioItems(source).filter(
    (item) => item.link.trim() || item.media.some((mediaUrl) => mediaUrl.trim()),
  );
  const portfolioCustomCount = portfolioItems.filter((item) => item.media.some((mediaUrl) => mediaUrl.trim())).length;

  return {
    "top-banner": truncateText(source.topBanner.text),
    hero: truncateText(source.hero.description),
    "feature-highlights": source.services.features.map((feature) => feature.title).filter(Boolean).join(" | ") || "Trust highlights ready",
    services: `${source.services.items.length} service cards ready`,
    "before-after": `${source.beforeAfter.beforeLabel} to ${source.beforeAfter.afterLabel}`,
    gallery: `${source.gallery.items.length} showcase cards`,
    portfolio: portfolioItems.length
      ? `${portfolioItems.length} selected item${portfolioItems.length === 1 ? "" : "s"} | ${portfolioCustomCount} custom preview${portfolioCustomCount === 1 ? "" : "s"}`
      : "Default showcase embed setup",
    faq: `${source.faq.items.length} common question${source.faq.items.length === 1 ? "" : "s"}`,
    cta: truncateText(source.cta.buttonLabel || source.cta.description, 70),
    contact: [source.business.phoneDisplay, source.business.email].filter(Boolean).join(" | ") || "Business details ready",
  };
}

function ProgressRing({ completed, total }: { completed: number; total: number }) {
  const percentage = total ? Math.round((completed / total) * 100) : 0;
  const degrees = Math.round((percentage / 100) * 360);

  return (
    <div
      className="relative h-16 w-16 rounded-full"
      style={{ background: `conic-gradient(#d6b163 ${degrees}deg, rgba(252,242,220,0.08) ${degrees}deg)` }}
    >
      <div className="absolute inset-[6px] flex items-center justify-center rounded-full border border-white/8 bg-[#0b0703] text-center shadow-[inset_0_1px_0_rgba(255,250,237,0.06)]">
        <div>
          <p className="text-sm font-heading font-bold text-white">{completed}</p>
          <p className="text-[9px] uppercase tracking-[0.18em] text-gray-500">of {total}</p>
        </div>
      </div>
    </div>
  );
}

function CompactSectionPreview({ sectionId, content }: { sectionId: SectionId; content: SiteContent }) {
  switch (sectionId) {
    case "top-banner":
      return (
        <div className="rounded-[20px] border border-white/10 bg-black/35 px-3 py-2.5">
          <div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.18em] text-gray-500">
            <span>Top bar</span>
            <span className="rounded-full border border-white/10 px-2 py-0.5 text-[9px] text-gray-400">Live layout</span>
          </div>
          <p className="mt-2 truncate text-xs text-gray-200">{content.topBanner.text || "Notice message"}</p>
        </div>
      );
    case "hero":
      return (
        <div className="rounded-[20px] border border-white/10 bg-black/35 p-3">
          <p className="text-[10px] uppercase tracking-[0.2em] text-wolf-red">{content.hero.eyebrow || "Website intro"}</p>
          <div className="mt-2 space-y-2">
            <div className="h-2 w-4/5 rounded-full bg-white/90" />
            <div className="h-2 w-full rounded-full bg-white/25" />
            <div className="h-2 w-3/4 rounded-full bg-white/25" />
          </div>
          <div className="mt-3 flex gap-2">
            <span className="rounded-full bg-wolf-red px-2.5 py-1 text-[10px] text-white">{content.hero.primaryCtaLabel || "Main button"}</span>
            <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-gray-300">{content.hero.secondaryCtaLabel || "Second"}</span>
          </div>
        </div>
      );
    case "feature-highlights":
      return (
        <div className="grid grid-cols-2 gap-2">
          {content.services.features.slice(0, 4).map((feature, index) => (
            <div key={index} className="rounded-[18px] border border-white/10 bg-black/35 px-3 py-2">
              <p className="truncate text-[11px] font-semibold text-white">{feature.title || `Highlight ${index + 1}`}</p>
              <p className="mt-1 truncate text-[10px] text-gray-500">{feature.desc || "Supporting line"}</p>
            </div>
          ))}
        </div>
      );
    case "services":
      return (
        <div className="grid grid-cols-3 gap-2">
          {content.services.items.slice(0, 3).map((item, index) => (
            <div key={index} className="rounded-[18px] border border-white/10 bg-black/35 p-2">
              <div className="h-12 rounded-[12px] bg-[linear-gradient(135deg,rgba(250,231,178,0.38),rgba(214,177,99,0.16),rgba(255,255,255,0.04))]" />
              <p className="mt-2 truncate text-[10px] font-semibold text-white">{item.title || `Service ${index + 1}`}</p>
            </div>
          ))}
        </div>
      );
    case "before-after":
      return (
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-[18px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(0,0,0,0.25))] p-3">
            <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500">{content.beforeAfter.beforeLabel || "Before"}</p>
          </div>
          <div className="rounded-[18px] border border-wolf-red/20 bg-[linear-gradient(135deg,rgba(250,231,178,0.22),rgba(214,177,99,0.12),rgba(0,0,0,0.2))] p-3">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white">{content.beforeAfter.afterLabel || "After"}</p>
          </div>
        </div>
      );
    case "gallery":
      return (
        <div className="grid grid-cols-3 gap-2">
          {content.gallery.items.slice(0, 3).map((item, index) => (
            <div key={index} className="rounded-[18px] border border-white/10 bg-black/35 p-2">
              <div className="h-14 rounded-[12px] bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(214,177,99,0.18))]" />
              <p className="mt-2 truncate text-[10px] text-white">{item.title || `Work ${index + 1}`}</p>
            </div>
          ))}
        </div>
      );
    case "portfolio":
      const portfolioItems = getResolvedPortfolioItems(content);
      return (
        <div className="grid grid-cols-3 gap-2">
          {portfolioItems.length ? (
            portfolioItems.slice(0, 3).map((item, index) => (
              <div key={index} className="rounded-[18px] border border-white/10 bg-black/35 p-2">
                <div className={`rounded-[12px] ${getPortfolioItemType(item) === "reel" ? "aspect-[9/14]" : "aspect-[4/5]"} bg-[linear-gradient(135deg,rgba(250,231,178,0.24),rgba(214,177,99,0.18),rgba(255,255,255,0.06))]`} />
                <p className="mt-2 truncate text-[10px] text-white">{item.label || `${getPortfolioItemType(item) === "reel" ? "Reel" : "Post"} ${index + 1}`}</p>
              </div>
            ))
          ) : (
            <>
              <div className="rounded-[18px] border border-white/10 bg-black/35 p-2">
                <div className="aspect-[4/5] rounded-[12px] bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(214,177,99,0.12))]" />
              </div>
              <div className="rounded-[18px] border border-white/10 bg-black/35 p-2">
                <div className="aspect-[9/14] rounded-[12px] bg-[linear-gradient(135deg,rgba(250,231,178,0.22),rgba(214,177,99,0.15),rgba(255,255,255,0.06))]" />
              </div>
              <div className="rounded-[18px] border border-white/10 bg-black/35 p-2">
                <div className="aspect-[4/5] rounded-[12px] bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(214,177,99,0.12))]" />
              </div>
            </>
          )}
        </div>
      );
    case "faq":
      return (
        <div className="space-y-2">
          {content.faq.items.slice(0, 3).map((item, index) => (
            <div key={index} className="flex items-center justify-between rounded-[16px] border border-white/10 bg-black/35 px-3 py-2">
              <p className="truncate pr-3 text-[10px] text-white">{item.question || `Question ${index + 1}`}</p>
              <div className="h-2 w-2 rounded-full bg-wolf-red" />
            </div>
          ))}
        </div>
      );
    case "cta":
      return (
        <div className="rounded-[20px] border border-white/10 bg-black/35 p-3">
          <p className="text-[10px] uppercase tracking-[0.18em] text-wolf-red">{content.cta.eyebrow || "Get in touch"}</p>
          <div className="mt-2 space-y-2">
            <div className="h-2 w-3/4 rounded-full bg-white/85" />
            <div className="h-2 w-full rounded-full bg-white/20" />
          </div>
          <span className="mt-3 inline-flex rounded-full bg-wolf-red px-2.5 py-1 text-[10px] text-white">{content.cta.buttonLabel || "Button"}</span>
        </div>
      );
    case "contact":
      return (
        <div className="grid gap-2">
          <div className="rounded-[16px] border border-white/10 bg-black/35 px-3 py-2">
            <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500">Phone</p>
            <p className="mt-1 text-xs text-white">{content.business.phoneDisplay || "Phone number"}</p>
          </div>
          <div className="rounded-[16px] border border-white/10 bg-black/35 px-3 py-2">
            <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500">Email</p>
            <p className="mt-1 truncate text-xs text-white">{content.business.email || "Business email"}</p>
          </div>
        </div>
      );
    default:
      return null;
  }
}

function PublishReviewModal({
  open,
  onClose,
  onConfirm,
  saving,
  changedSections,
  mediaChangeCount,
  portfolioPreparedCount,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  saving: boolean;
  changedSections: SectionDefinition[];
  mediaChangeCount: number;
  portfolioPreparedCount: number;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 overflow-y-auto bg-black/70 px-4 backdrop-blur-sm sm:px-6"
      style={{
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 1rem)",
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)",
      }}
    >
      <div className="flex min-h-full items-center justify-center">
        <div className="relative w-full max-w-3xl overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,250,239,0.08),rgba(10,7,3,0.92))] shadow-[0_40px_120px_rgba(0,0,0,0.55)] sm:rounded-[34px]">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(250,231,178,0.62)] to-transparent" />
          <div className="max-h-[calc(100dvh-2rem)] overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 md:px-8">
          <p className="text-[11px] uppercase tracking-[0.28em] text-wolf-red">Review & Publish</p>
          <h2 className="mt-3 text-2xl font-luxury font-black uppercase tracking-[0.12em] text-white sm:text-3xl">Ready to update the website?</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-400">
            Take one last look before publishing. Nothing changes on the live website until you confirm.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,250,237,0.05),rgba(10,7,3,0.56))] p-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500">Sections updated</p>
              <p className="mt-2 text-2xl font-heading font-bold text-white">{changedSections.length}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,250,237,0.05),rgba(10,7,3,0.56))] p-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500">Media changes</p>
              <p className="mt-2 text-2xl font-heading font-bold text-white">{mediaChangeCount}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,250,237,0.05),rgba(10,7,3,0.56))] p-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500">Showcase items</p>
              <p className="mt-2 text-2xl font-heading font-bold text-white">{portfolioPreparedCount}</p>
            </div>
          </div>

          <div className="mt-6 rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,250,237,0.05),rgba(10,7,3,0.58))] p-5">
            <p className="text-sm font-semibold text-white">What will go live</p>
            {changedSections.length ? (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {changedSections.map((section) => (
                  <div key={section.id} className="rounded-[20px] border border-wolf-red/15 bg-wolf-red/8 px-4 py-3">
                    <p className="text-sm font-semibold text-white">{section.navLabel}</p>
                    <p className="mt-1 text-xs leading-relaxed text-gray-400">{section.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-gray-400">There are no unpublished changes right now.</p>
            )}
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm text-gray-300 transition-colors hover:border-wolf-red hover:text-white sm:w-auto"
            >
              Keep editing
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={saving || !changedSections.length}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-wolf-red px-5 py-3 text-sm font-heading uppercase tracking-[0.18em] text-white transition-colors hover:bg-wolf-red-hover disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Publish to website
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

function OwnerField({
  label,
  value,
  onChange,
  multiline = false,
  placeholder = "",
  hint,
  rows = 4,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
  hint?: string;
  rows?: number;
  disabled?: boolean;
}) {
  return (
    <label className="block space-y-2.5">
      <span className={`block text-sm font-medium ${disabled ? "text-gray-500" : "text-white"}`}>{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={rows}
          placeholder={placeholder}
          disabled={disabled}
          className={`${fieldClassName} resize-y ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`${fieldClassName} ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
        />
      )}
      {hint ? <p className="text-xs leading-relaxed text-gray-500">{hint}</p> : null}
    </label>
  );
}

function SectionStatusPill({ status }: { status: SectionStatus }) {
  const classes =
    status === "draft"
      ? "border-wolf-red/25 bg-wolf-red/10 text-wolf-red"
      : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${classes}`}>
      {status === "draft" ? <Sparkles className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
      {status === "draft" ? "Draft" : "Live"}
    </span>
  );
}

function SummaryStatCard({ icon: Icon, label, value, hint }: { icon: LucideIcon; label: string; value: string; hint: string }) {
  return (
    <div className="group relative overflow-hidden rounded-[30px] border border-[rgba(255,225,171,0.08)] bg-[radial-gradient(circle_at_top_right,rgba(243,163,55,0.1),transparent_24%),linear-gradient(180deg,rgba(76,48,14,0.16),rgba(14,9,4,0.94))] p-4 shadow-[0_24px_64px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,224,168,0.03)] transition-all duration-500 hover:-translate-y-1 hover:border-wolf-red/30 hover:shadow-[0_32px_84px_rgba(243,163,55,0.12)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,208,124,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(255,208,124,0.07) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="pointer-events-none absolute -right-12 top-0 h-28 w-28 rounded-full bg-[rgba(243,163,55,0.16)] blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(214,177,99,0.26)] to-transparent transition-all duration-500 group-hover:via-[rgba(243,163,55,0.4)]" />
      <div className="relative flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex flex-1 items-start gap-2.5 text-[11px] uppercase tracking-[0.22em] text-gray-400 transition-colors group-hover:text-gray-300">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-wolf-red/15 bg-[linear-gradient(180deg,rgba(255,224,168,0.04),rgba(22,12,3,0.84))] shadow-[0_0_20px_rgba(243,163,55,0.08)] transition-transform duration-500 group-hover:scale-105">
            <Icon className="h-4 w-4 text-wolf-red transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />
          </div>
          <span className="min-w-0 whitespace-normal leading-snug">{label}</span>
        </div>
        <span className="mt-0.5 shrink-0 rounded-full border border-[rgba(255,225,171,0.08)] bg-[rgba(14,9,4,0.74)] px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-gray-500 shadow-[inset_0_1px_0_rgba(255,224,168,0.03)]">
          Overview
        </span>
      </div>
      <p className="relative mt-4 text-xl font-heading font-bold text-white">{value}</p>
      <p className="relative mt-1 text-sm leading-relaxed text-gray-400">{hint}</p>
    </div>
  );
}

function ControlSurfaceCard({
  icon: Icon,
  eyebrow,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-[30px] border border-[rgba(255,225,171,0.08)] bg-[radial-gradient(circle_at_top_right,rgba(243,163,55,0.12),transparent_28%),linear-gradient(180deg,rgba(76,48,14,0.16),rgba(14,9,4,0.94))] p-5 shadow-[0_24px_72px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,224,168,0.03)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,208,124,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,208,124,0.06) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="pointer-events-none absolute -right-10 top-0 h-32 w-32 rounded-full bg-[rgba(243,163,55,0.16)] blur-3xl" />
      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(214,177,99,0.28)] to-transparent" />
      <div className="relative flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] border border-wolf-red/15 bg-[linear-gradient(180deg,rgba(255,224,168,0.04),rgba(24,13,3,0.84))] shadow-[0_0_22px_rgba(243,163,55,0.08)]">
          <Icon className="h-5 w-5 text-wolf-red" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.24em] text-wolf-red">{eyebrow}</p>
          <p className="mt-1.5 text-xl font-heading font-bold text-white">{title}</p>
          {description ? <p className="mt-1.5 text-sm leading-relaxed text-gray-400">{description}</p> : null}
        </div>
      </div>
      <div className="relative mt-4">{children}</div>
    </div>
  );
}

function PreviewTile({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(206,214,225,0.06),rgba(10,7,3,0.64))] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(221,228,236,0.04)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500">{label}</p>
        <div className="flex gap-2 text-[10px] uppercase tracking-[0.14em] text-gray-500">
          <span className="rounded-full border border-white/10 px-2.5 py-1 text-white">Desktop</span>
          <span className="rounded-full border border-white/10 px-2.5 py-1">Mobile</span>
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function EmptyStateCard({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="rounded-[28px] border border-dashed border-white/10 bg-[linear-gradient(180deg,rgba(206,214,225,0.035),rgba(10,7,3,0.64))] p-8">
      <p className="text-lg font-heading font-bold text-white">{title}</p>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-400">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

function MediaReplaceCard({
  label,
  liveValue,
  draftValue,
  onUpload,
  onClear,
  uploading,
  hint,
}: {
  label: string;
  liveValue?: string;
  draftValue?: string;
  onUpload: (file: File) => void;
  onClear: () => void;
  uploading: boolean;
  hint?: string;
}) {
  const hasDraftChange = liveValue !== draftValue;
  const canReset = Boolean(draftValue || liveValue);

  const renderPreview = (value?: string, emptyMessage = "No image selected") => {
    if (!value) {
      return <div className="flex h-full items-center justify-center px-5 text-center text-xs leading-relaxed text-gray-500">{emptyMessage}</div>;
    }

    return <img src={value} alt={label} className="h-full w-full object-cover" />;
  };

  return (
    <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(206,214,225,0.05),rgba(10,7,3,0.62))] p-5 shadow-[0_18px_44px_rgba(0,0,0,0.22)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-base font-heading font-bold text-white">{label}</p>
          <p className="mt-1 text-sm leading-relaxed text-gray-400">
            {hint || "Replace the section image here. Your live website will stay unchanged until you publish."}
          </p>
        </div>
        <SectionStatusPill status={hasDraftChange ? "draft" : "live"} />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-[22px] border border-white/8 bg-[linear-gradient(180deg,rgba(206,214,225,0.04),rgba(10,7,3,0.56))] p-3">
          <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500">Live now</p>
          <div className="mt-3 h-40 overflow-hidden rounded-[18px] border border-white/10 bg-black/40">
            {renderPreview(liveValue, "This section is using the current website image.")}
          </div>
        </div>
        <div className="rounded-[22px] border border-white/8 bg-[linear-gradient(180deg,rgba(206,214,225,0.04),rgba(10,7,3,0.56))] p-3">
          <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500">Draft preview</p>
          <div className="mt-3 h-40 overflow-hidden rounded-[18px] border border-white/10 bg-black/40">
            {hasDraftChange ? renderPreview(draftValue, "This draft will switch back to the current website image.") : renderPreview(undefined, "No new image selected yet.")}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200 transition-colors hover:border-wolf-red hover:text-white">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Replace image
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onUpload(file);
              event.target.value = "";
            }}
          />
        </label>
        <button
          type="button"
          onClick={onClear}
          disabled={!canReset}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm text-gray-300 transition-colors hover:border-wolf-red hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Undo2 className="h-4 w-4" />
          Use current website image
        </button>
      </div>
    </div>
  );
}

function EditableSectionCard({
  id,
  title,
  description,
  summary,
  status,
  isOpen,
  onOpen,
  headerPreview,
  children,
}: {
  id: SectionId;
  title: string;
  description: string;
  summary: string;
  status: SectionStatus;
  isOpen: boolean;
  onOpen: () => void;
  headerPreview?: ReactNode;
  children: ReactNode;
}) {
  const section = sectionDefinitionMap[id];
  const Icon = section.icon;

  return (
    <section
      id={id}
      className={`relative min-w-0 overflow-hidden rounded-[30px] border shadow-[0_24px_64px_rgba(0,0,0,0.34)] scroll-mt-32 ${
        isOpen
          ? "border-wolf-red/25 bg-[linear-gradient(180deg,rgba(206,214,225,0.05),rgba(214,177,99,0.06),rgba(10,7,3,0.76))]"
          : "border-white/10 bg-[linear-gradient(180deg,rgba(206,214,225,0.045),rgba(10,7,3,0.64))]"
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(214,177,99,0.46)] to-transparent" />
      <button type="button" onClick={onOpen} className="group w-full px-4 py-4 text-left outline-none md:px-7 md:py-5">
        <div className="flex flex-col sm:flex-row gap-4 xl:items-start xl:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] border border-white/10 bg-[linear-gradient(180deg,rgba(206,214,225,0.05),rgba(10,7,3,0.58))] group-hover:border-wolf-red/30 transition-colors">
                <Icon className="h-5 w-5 text-wolf-red" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-heading font-bold uppercase tracking-[0.18em] text-white">{title}</h2>
                  {recommendedSectionOrder.includes(id) ? (
                    <span className="rounded-full border border-wolf-red/20 bg-wolf-red/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-wolf-red">
                      Recommended
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-400">{description}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto mt-2 sm:mt-0 gap-3 xl:max-w-[420px] pt-4 sm:pt-0 border-t border-white/5 sm:border-0">
            <div className="hidden min-w-[260px] rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(206,214,225,0.04),rgba(10,7,3,0.6))] p-4 text-left lg:block">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500">Section preview</p>
                <SectionStatusPill status={status} />
              </div>
              <div className="mt-4">{headerPreview}</div>
              <p className="mt-4 text-xs leading-relaxed text-gray-400">{summary}</p>
            </div>
            <div className="flex flex-col items-end gap-3 lg:hidden">
              <SectionStatusPill status={status} />
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(206,214,225,0.04),rgba(10,7,3,0.58))]">
              <ChevronDown className={`h-4 w-4 text-gray-300 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </div>
          </div>
        </div>
      </button>

      {isOpen ? <div className="border-t border-white/8 px-6 pb-6 pt-6 md:px-7">{children}</div> : null}
    </section>
  );
}

function SectionGroupIntro({
  title,
  description,
  sections,
  activeSectionId,
}: {
  title: string;
  description: string;
  sections: SectionDefinition[];
  activeSectionId: SectionId | null;
}) {
  const style = sectionGroupStyles[title] ?? { icon: LayoutTemplate };
  const Icon = style.icon;
  const [titleLead, titleTail] = sectionGroupTitleParts[title] ?? [title, undefined];

  return (
    <div className="relative px-1">
      <div className="relative overflow-hidden rounded-[32px] border border-[rgba(255,225,171,0.08)] bg-[linear-gradient(180deg,rgba(255,217,142,0.08),rgba(16,10,4,0.9))] p-[1px] shadow-[0_34px_96px_rgba(0,0,0,0.4)]">
        <div className="relative overflow-hidden rounded-[31px] bg-[radial-gradient(circle_at_top_right,rgba(255,190,90,0.14),transparent_28%),linear-gradient(180deg,rgba(76,48,14,0.16),rgba(15,10,4,0.94))] px-5 py-5 md:px-6 md:py-6">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,208,124,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,208,124,0.07) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-[rgba(255,198,102,0.18)] blur-3xl" />
          <div className="pointer-events-none absolute left-6 top-6 h-16 w-16 rounded-[22px] border border-wolf-red/10 opacity-40" />
          <div className="pointer-events-none absolute bottom-5 right-6 h-20 w-20 rounded-[26px] border border-wolf-red/10 opacity-30" />
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,208,124,0.44)] to-transparent" />
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] border border-wolf-red/18 bg-[linear-gradient(180deg,rgba(255,224,168,0.04),rgba(24,13,3,0.86))] shadow-[0_0_24px_rgba(243,163,55,0.08)]">
                <div className="absolute inset-[4px] rounded-[14px] border border-wolf-red/10" />
                <Icon className="h-5 w-5 text-wolf-red" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.24em] text-wolf-red">Section Group</p>
                <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h2 className="text-2xl font-luxury font-black uppercase tracking-[0.16em] text-wolf-red drop-shadow-[0_0_18px_rgba(243,163,55,0.2)]">
                    {titleLead}
                  </h2>
                  {titleTail ? (
                    <h2 className="text-2xl font-luxury font-black uppercase tracking-[0.16em] text-white">
                      {titleTail}
                    </h2>
                  ) : null}
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-400">{description}</p>
              </div>
            </div>

            <div className="flex items-center lg:justify-end">
              <span className="rounded-full border border-wolf-red/30 bg-wolf-red/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white shadow-[0_0_24px_rgba(214,177,99,0.16)]">
                {sections.length} section{sections.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>

          <div className="relative mt-5 overflow-hidden rounded-[24px] border border-[rgba(255,225,171,0.08)] bg-[linear-gradient(180deg,rgba(255,224,168,0.03),rgba(12,8,3,0.84))] p-4 shadow-[inset_0_1px_0_rgba(255,224,168,0.03)]">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, rgba(255,208,124,0.12) 0, rgba(255,208,124,0.12) 1px, transparent 1px, transparent 12px)",
                backgroundSize: "18px 18px",
              }}
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500">Includes</p>
              <p className="text-xs text-gray-500">These sections are grouped under this area.</p>
            </div>

            <div className="relative mt-3 flex flex-wrap gap-2">
              {sections.map((section) => (
                <span
                  key={section.id}
                  className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.18em] ${
                    section.id === activeSectionId
                      ? "border-wolf-red/30 bg-wolf-red/10 text-white shadow-[0_0_20px_rgba(214,177,99,0.16)]"
                      : "border-wolf-red/20 bg-wolf-red/8 text-gray-200"
                  }`}
                >
                  {section.navLabel}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContentDashboard() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [savedContent, setSavedContent] = useState<SiteContent>(defaultSiteContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState("");
  const [status, setStatus] = useState("");
  const [openSection, setOpenSection] = useState<SectionId | null>(null);
  const [publishReviewOpen, setPublishReviewOpen] = useState(false);
  const [lastPublishedAt, setLastPublishedAt] = useState<Date | null>(null);
  const [lastPublishedBy, setLastPublishedBy] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "siteContent", "homepage"),
      (snapshot) => {
        const rawData = snapshot.exists() ? (snapshot.data() as Partial<SiteContent> & { updatedAt?: { toDate?: () => Date }; updatedBy?: string | null }) : undefined;
        const merged = mergeSiteContent(rawData);

        setContent(merged);
        setSavedContent(merged);
        setLastPublishedAt(rawData?.updatedAt?.toDate?.() ?? null);
        setLastPublishedBy(rawData?.updatedBy ?? "");
        setLoading(false);
      },
      (error) => {
        console.error("Failed to load content dashboard:", error);
        setStatus("We couldn't load your website details. Check your Firebase permissions and try again.");
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const isDirty = useMemo(() => serialize(content) !== serialize(savedContent), [content, savedContent]);

  useEffect(() => {
    if (!isDirty) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const currentSnapshots = useMemo(() => buildSectionSnapshots(content), [content]);
  const savedSnapshots = useMemo(() => buildSectionSnapshots(savedContent), [savedContent]);
  const sectionSummaries = useMemo(() => buildPremiumSectionSummaries(content), [content]);

  const sectionStatusMap = useMemo(() => {
    return Object.fromEntries(
      sectionDefinitions.map((section) => [
        section.id,
        serialize(currentSnapshots[section.id]) !== serialize(savedSnapshots[section.id]) ? "draft" : "live",
      ]),
    ) as Record<SectionId, SectionStatus>;
  }, [currentSnapshots, savedSnapshots]);

  const changedSections = useMemo(
    () => sectionDefinitions.filter((section) => sectionStatusMap[section.id] === "draft"),
    [sectionStatusMap],
  );
  const completedSections = sectionDefinitions.length - changedSections.length;
  const activeSection = openSection ? sectionDefinitionMap[openSection] : null;
  const ActiveSectionIcon = activeSection?.icon ?? LayoutTemplate;

  const sectionGroups = useMemo(() => {
    const groups = Array.from(new Set(sectionDefinitions.map((section) => section.group)));

    return groups.map((group) => ({
      title: group,
      description: sectionGroupDescriptions[group] ?? "Grouped website sections for this editor area.",
      sections: sectionDefinitions.filter((section) => section.group === group),
    }));
  }, []);
  const homepageGroup = sectionGroups.find((group) => group.title === "Homepage") ?? null;
  const visualShowcaseGroup = sectionGroups.find((group) => group.title === "Visual Showcase") ?? null;
  const instagramTrustGroup = sectionGroups.find((group) => group.title === "Showcase & Trust") ?? null;
  const businessDetailsGroup = sectionGroups.find((group) => group.title === "Business Details") ?? null;

  const publishingLabel =
    status || (isDirty ? "You have unpublished changes in this editor. Your live website stays unchanged until you publish." : "Everything here matches the live website.");

  const mediaChangeCount = useMemo(() => {
    let count = 0;

    content.services.items.forEach((item, index) => {
      if ((item.imageUrl ?? "") !== (savedContent.services.items[index]?.imageUrl ?? "")) count += 1;
    });
    content.gallery.items.forEach((item, index) => {
      if ((item.imageUrl ?? "") !== (savedContent.gallery.items[index]?.imageUrl ?? "")) count += 1;
    });
    if ((content.beforeAfter.beforeImageUrl ?? "") !== (savedContent.beforeAfter.beforeImageUrl ?? "")) count += 1;
    if ((content.beforeAfter.afterImageUrl ?? "") !== (savedContent.beforeAfter.afterImageUrl ?? "")) count += 1;

    const currentPortfolioItems = getResolvedPortfolioItems(content);
    const savedPortfolioItems = getResolvedPortfolioItems(savedContent);

    currentPortfolioItems.forEach((item, itemIndex) => {
      const savedItem = savedPortfolioItems[itemIndex];
      const mediaSlots = Math.max(item.media.length, savedItem?.media.length ?? 0);
      for (let mediaIndex = 0; mediaIndex < mediaSlots; mediaIndex += 1) {
        if ((item.media[mediaIndex] ?? "") !== (savedItem?.media[mediaIndex] ?? "")) count += 1;
      }
    });

    return count;
  }, [content, savedContent]);

  const portfolioEditorItems = useMemo(() => getResolvedPortfolioItems(content), [content.portfolio.items]);

  const portfolioPreparedCount = useMemo(
    () => portfolioEditorItems.filter((item) => item.link.trim() || item.media.some((mediaUrl) => mediaUrl.trim())).length,
    [portfolioEditorItems],
  );

  const setSectionField = (section: keyof SiteContent, field: string, value: string) => {
    setContent((current) => ({
      ...current,
      [section]: {
        ...(current[section] as Record<string, unknown>),
        [field]: value,
      },
    }));
  };

  const setArrayItemField = (section: keyof SiteContent, arrayField: string, index: number, field: string, value: string) => {
    setContent((current) => {
      const sectionValue = current[section] as Record<string, unknown>;
      const currentItems = (sectionValue[arrayField] as Record<string, unknown>[]).map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      );

      return {
        ...current,
        [section]: {
          ...sectionValue,
          [arrayField]: currentItems,
        },
      };
    });
  };

  const updatePortfolioItems = (
    updater: (items: SiteContent["portfolio"]["items"]) => SiteContent["portfolio"]["items"],
  ) => {
    setContent((current) => ({
      ...current,
      portfolio: {
        ...current.portfolio,
        useCustomItems: true,
        items: updater(current.portfolio.items.length ? current.portfolio.items : clonePortfolioItems(getResolvedPortfolioItems(current))),
      },
    }));
  };

  const setPortfolioItem = (index: number, updates: Partial<SiteContent["portfolio"]["items"][number]>) => {
    updatePortfolioItems((items) => items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...updates } : item)));
  };

  const setPortfolioLink = (itemIndex: number, value: string) => {
    const normalized = normalizePortfolioUrl(value);
    setPortfolioItem(itemIndex, {
      link: value,
      type: normalized ? getPortfolioItemTypeFromUrl(normalized) : "post",
    });
  };

  const setPortfolioMedia = (itemIndex: number, mediaIndex: number, value: string) => {
    updatePortfolioItems((items) =>
      items.map((item, currentIndex) =>
          currentIndex === itemIndex
            ? {
                ...item,
                media: item.media.map((mediaValue, currentMediaIndex) => (currentMediaIndex === mediaIndex ? value : mediaValue)),
              }
            : item,
        ),
    );
  };

  const addPortfolioItem = () => {
    updatePortfolioItems((items) => [
      ...items,
          {
            label: `Showcase item ${items.length + 1}`,
            type: "post",
            media: [""],
            link: "",
          },
        ]);
    setOpenSection("portfolio");
  };

  const removePortfolioItem = (index: number) => {
    updatePortfolioItems((items) => items.filter((_, itemIndex) => itemIndex !== index));
  };

  const clearPortfolioLink = (itemIndex: number) => {
    setPortfolioItem(itemIndex, { link: "" });
  };

  const clearPortfolioMedia = (itemIndex: number) => {
    updatePortfolioItems((items) =>
      items.map((item, currentIndex) => (currentIndex === itemIndex ? { ...item, media: [""] } : item)),
    );
  };

  const addPortfolioMediaSlot = (itemIndex: number) => {
    updatePortfolioItems((items) =>
      items.map((item, currentIndex) => (currentIndex === itemIndex ? { ...item, media: [...item.media, ""] } : item)),
    );
  };

  const removePortfolioMediaSlot = (itemIndex: number, mediaIndex: number) => {
    updatePortfolioItems((items) =>
      items.map((item, currentIndex) =>
          currentIndex === itemIndex
            ? {
                ...item,
                media: item.media.length > 1 ? item.media.filter((_, currentMediaIndex) => currentMediaIndex !== mediaIndex) : [""],
              }
            : item,
        ),
    );
  };

  const uploadAsset = async (fieldKey: string, onComplete: (url: string) => void, file: File) => {
    setUploadingField(fieldKey);
    setStatus("Uploading your media...");

    try {
      const url = await uploadToCloudinary(file);
      onComplete(url);
      setStatus("Upload ready. Review and publish when you're happy with how everything looks.");
    } catch (error) {
      console.error("Media upload failed:", error);
      setStatus("We couldn't upload that file. Please check the file and try again.");
    } finally {
      setUploadingField("");
    }
  };

  const handlePortfolioMediaUpload = (itemIndex: number, mediaIndex: number, file: File) => {
    const nextType = file.type.startsWith("video/") ? "reel" : "post";

    uploadAsset(
      `portfolio-${itemIndex}-${mediaIndex}`,
      (url) => {
        updatePortfolioItems((items) =>
          items.map((item, currentIndex) => {
            if (currentIndex !== itemIndex) {
              return item;
            }

            if (nextType === "reel") {
              return {
                ...item,
                type: "reel",
                link: "",
                media: [url],
              };
            }

            const media = item.media.length ? [...item.media] : [""];
            const nextMedia = media.map((mediaValue, currentMediaIndex) =>
              currentMediaIndex === mediaIndex ? url : mediaValue,
            );

            return {
              ...item,
              type: "post",
              link: "",
              media: nextMedia,
            };
          }),
        );
      },
      file,
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus("Publishing your changes...");

    try {
      await setDoc(
        doc(db, "siteContent", "homepage"),
        {
          ...content,
          updatedAt: serverTimestamp(),
          updatedBy: auth.currentUser?.email ?? null,
        },
        { merge: true },
      );
      setPublishReviewOpen(false);
      setStatus("Your changes are now live.");
    } catch (error) {
      console.error("Failed to save content:", error);
      setStatus("We couldn't publish your changes. Please check your permissions and try again.");
    } finally {
      setSaving(false);
    }
  };

  const requestPublish = () => {
    if (!isDirty || saving) {
      return;
    }

    setPublishReviewOpen(true);
  };

  const handleResetDraft = () => {
    if (!isDirty) {
      return;
    }

    const shouldReset = window.confirm("Remove your unpublished changes and return to the current live website version?");
    if (!shouldReset) {
      return;
    }

    setContent(savedContent);
    setStatus("Unpublished changes were cleared.");
  };

  const scrollSectionToTop = (sectionId: SectionId) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const sectionElement = document.getElementById(sectionId);
        if (!sectionElement) {
          return;
        }

        const sectionTop = sectionElement.getBoundingClientRect().top + window.scrollY - 96;
        window.scrollTo({ top: Math.max(0, sectionTop), behavior: "smooth" });
      });
    });
  };

  const addFaqItem = () => {
    setContent((current) => ({
      ...current,
      faq: {
        ...current.faq,
        items: [
          ...current.faq.items,
          {
            question: "",
            answer: "",
          },
        ],
      },
    }));
    setOpenSection("faq");
  };

  const removeFaqItem = (index: number) => {
    setContent((current) => ({
      ...current,
      faq: {
        ...current.faq,
        items: current.faq.items.length > 1 ? current.faq.items.filter((_, itemIndex) => itemIndex !== index) : current.faq.items,
      },
    }));
  };

  const focusSection = (sectionId: SectionId) => {
    setOpenSection(sectionId);
    scrollSectionToTop(sectionId);
  };

  const toggleSection = (sectionId: SectionId) => {
    const willOpen = openSection !== sectionId;
    setOpenSection(willOpen ? sectionId : null);

    if (willOpen) {
      scrollSectionToTop(sectionId);
    }
  };

  if (loading) {
    return (
      <div className="content-dashboard flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-wolf-red" />
      </div>
    );
  }

  return (
    <div className="content-dashboard min-h-full pb-40 sm:pb-32 xl:pb-12">
      <div className="mx-auto max-w-[1700px] px-4 py-5 md:px-8 md:py-8">
        <section className="relative overflow-hidden rounded-[36px] border border-[rgba(255,225,171,0.08)] bg-[linear-gradient(180deg,rgba(255,218,144,0.08),rgba(18,11,4,0.9))] p-[1px] shadow-[0_42px_116px_rgba(0,0,0,0.46)]">
          <div className="relative overflow-hidden rounded-[35px] bg-[radial-gradient(circle_at_top_right,rgba(255,186,82,0.2),transparent_30%),linear-gradient(135deg,rgba(76,48,14,0.18),rgba(243,163,55,0.06),rgba(10,7,3,0.94))]">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,208,124,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,208,124,0.06) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            <div className="pointer-events-none absolute -right-16 top-0 h-56 w-56 rounded-full bg-wolf-red/14 blur-3xl" />
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,208,124,0.42)] to-transparent" />
            <div className="grid gap-5 px-4 py-6 sm:px-6 sm:py-7 xl:grid-cols-[1.35fr_1fr] xl:px-8 xl:py-10">
            <div>
              <div className="inline-flex rounded-full border border-wolf-red/20 bg-black/25 px-3 py-1.5 text-[11px] uppercase tracking-[0.24em] text-wolf-red shadow-[0_0_24px_rgba(214,177,99,0.16)]">
                Owner Website Control Center
              </div>
              <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-2">
                <h1 className="text-3xl font-luxury font-black uppercase tracking-[0.12em] text-wolf-red drop-shadow-[0_0_20px_rgba(243,163,55,0.24)] md:text-5xl">
                  Website
                </h1>
                <h1 className="text-3xl font-luxury font-black uppercase tracking-[0.12em] text-white md:text-5xl">
                  Control Center
                </h1>
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-300 md:text-base">
                Update your website content, visuals, and Facebook showcase with confidence. Your live website stays untouched until you publish.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[22px] border border-[rgba(255,225,171,0.08)] bg-[linear-gradient(180deg,rgba(255,224,168,0.03),rgba(12,8,3,0.82))] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,224,168,0.03)]">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500">Mode</p>
                  <p className="mt-2 text-sm font-semibold text-white">Guided editing</p>
                </div>
                <div className="rounded-[22px] border border-[rgba(255,225,171,0.08)] bg-[linear-gradient(180deg,rgba(255,224,168,0.03),rgba(12,8,3,0.82))] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,224,168,0.03)]">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500">Safety</p>
                  <p className="mt-2 text-sm font-semibold text-white">Draft-safe changes</p>
                </div>
                <div className="rounded-[22px] border border-wolf-red/18 bg-[linear-gradient(180deg,rgba(255,226,171,0.06),rgba(39,19,3,0.82))] px-4 py-3 shadow-[0_0_20px_rgba(214,177,99,0.1)]">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-wolf-red">Audience</p>
                  <p className="mt-2 text-sm font-semibold text-white">Built for owners</p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <SummaryStatCard icon={LayoutTemplate} label="Website Status" value={isDirty ? "Draft in progress" : "Live"} hint={isDirty ? "You have unpublished changes ready to review." : "Your website is fully in sync with this editor."} />
              <SummaryStatCard
                icon={Sparkles}
                label="Draft Changes"
                value={changedSections.length ? `${changedSections.length} section${changedSections.length === 1 ? "" : "s"}` : "No draft changes"}
                hint={changedSections.length ? "These updates are safely waiting in draft." : "Nothing new is waiting to be published."}
              />
              <SummaryStatCard
                icon={Phone}
                label="Last Published"
                value={formatPublishedLabel(lastPublishedAt)}
                hint={lastPublishedBy ? `Last updated by ${lastPublishedBy}` : "Your first update will show here once it goes live."}
              />
              <SummaryStatCard
                icon={MessageSquareText}
                label="Facebook Showcase"
                value={portfolioPreparedCount ? `${portfolioPreparedCount} item${portfolioPreparedCount === 1 ? "" : "s"}` : "Default setup"}
                hint="Choose handpicked Facebook posts or keep the current showcase setup."
              />
            </div>
          </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.05fr_1fr_0.8fr]">
          <ControlSurfaceCard
            icon={Save}
            eyebrow="Draft & Publish"
            title={isDirty ? `${changedSections.length} section${changedSections.length === 1 ? "" : "s"} ready` : "Everything is live"}
            description={publishingLabel}
          >
            <div className="flex flex-wrap gap-3">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200 transition-colors hover:border-wolf-red hover:text-white"
              >
                <Globe className="h-4 w-4" />
                View live website
              </Link>
              <button
                type="button"
                onClick={handleResetDraft}
                disabled={!isDirty}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm text-gray-300 transition-colors hover:border-wolf-red hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RefreshCw className="h-4 w-4" />
                Remove draft changes
              </button>
              <button
                type="button"
                onClick={requestPublish}
                disabled={saving || !isDirty}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-wolf-red px-4 py-3 text-sm font-heading uppercase tracking-[0.18em] text-white shadow-[0_0_24px_rgba(214,177,99,0.18)] transition-colors hover:bg-wolf-red-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Review & Publish
              </button>
            </div>
          </ControlSurfaceCard>

          <ControlSurfaceCard
            icon={Sparkles}
            eyebrow="What Will Change"
            title={changedSections.length ? `${changedSections.length} section${changedSections.length === 1 ? "" : "s"} lined up` : "Nothing queued"}
            description={changedSections.length ? "These unpublished edits are ready for review before they go live." : "No unpublished changes at the moment. Once you edit a section, it will appear here."}
          >
            {changedSections.length ? (
              <div className="space-y-3">
                {changedSections.map((section) => (
                  <div key={section.id} className="rounded-[20px] border border-wolf-red/15 bg-wolf-red/8 px-4 py-3">
                    <p className="text-sm font-semibold text-white">{section.navLabel}</p>
                    <p className="mt-1 text-xs leading-relaxed text-gray-400">{sectionSummaries[section.id]}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </ControlSurfaceCard>

          <ControlSurfaceCard
            icon={CheckCircle2}
            eyebrow="Helpful Note"
            title="Draft-safe workflow"
            description="Uploads and text edits stay inside this editor until you publish. If you leave the page before publishing, those draft changes will be lost."
          >
            <div className="mt-1 border-t border-white/8 pt-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-wolf-red">Before you publish</p>
              <p className="mt-1.5 text-sm leading-relaxed text-white">
                Check your text, images, and section previews first. Publish once everything looks right on the page.
              </p>
            </div>
          </ControlSurfaceCard>
        </section>

        <div className="mt-6 grid min-w-0 gap-6 xl:grid-cols-[320px_minmax(0,1fr)] 2xl:grid-cols-[320px_minmax(0,1fr)_320px]">
          <aside className="hidden xl:block">
            <div className="sticky top-6 space-y-4">
              <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,249,236,0.08),rgba(10,7,3,0.58))] p-5 shadow-[0_22px_54px_rgba(0,0,0,0.24)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.26em] text-gray-500">Editor Progress</p>
                    <p className="mt-3 text-2xl font-heading font-bold text-white">{completedSections}/{sectionDefinitions.length}</p>
                    <p className="mt-2 text-sm leading-relaxed text-gray-400">
                      Sections currently matching the live website.
                    </p>
                  </div>
                  <ProgressRing completed={completedSections} total={sectionDefinitions.length} />
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,249,236,0.08),rgba(10,7,3,0.58))] p-5 shadow-[0_22px_54px_rgba(0,0,0,0.24)]">
                <p className="text-[11px] uppercase tracking-[0.26em] text-gray-500">Suggested editing path</p>
                <div className="mt-4 space-y-2">
                  {recommendedSectionOrder.map((sectionId, index) => (
                    <div key={sectionId} className="flex items-center gap-3 rounded-[18px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,249,236,0.04),rgba(10,7,3,0.48))] px-3 py-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-[11px] font-semibold text-white">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{sectionDefinitionMap[sectionId].navLabel}</p>
                        <p className="text-[11px] text-gray-500">{sectionStatusMap[sectionId] === "draft" ? "Draft changes waiting" : "Ready to update"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {sectionGroups.map((group) => (
                <div key={group.title} className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,249,236,0.08),rgba(10,7,3,0.58))] p-4 shadow-[0_22px_54px_rgba(0,0,0,0.24)]">
                  <p className="px-2 text-[11px] uppercase tracking-[0.22em] text-gray-500">{group.title}</p>
                  <div className="mt-3 space-y-2">
                    {group.sections.map((section) => {
                      const Icon = section.icon;
                      const isActive = openSection === section.id;

                      return (
                        <button
                          key={section.id}
                          type="button"
                          onClick={() => focusSection(section.id)}
                          className={`w-full rounded-[22px] border px-3 py-3 text-left transition-colors ${
                            isActive ? "border-wolf-red/35 bg-wolf-red/10" : "border-white/8 bg-black/20 hover:border-white/15 hover:bg-black/30"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-start gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,249,236,0.05),rgba(10,7,3,0.52))]">
                                <Icon className="h-4 w-4 text-wolf-red" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="truncate text-sm font-semibold text-white">{section.navLabel}</p>
                                  {recommendedSectionOrder.includes(section.id) ? (
                                    <span className="rounded-full border border-wolf-red/20 bg-wolf-red/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.16em] text-wolf-red">
                                      Suggested
                                    </span>
                                  ) : null}
                                </div>
                                <p className="mt-1 text-xs text-gray-500">{sectionSummaries[section.id]}</p>
                                <div className="mt-2">
                                  <CompactSectionPreview sectionId={section.id} content={content} />
                                </div>
                              </div>
                            </div>
                            <div className="pt-1">
                              <SectionStatusPill status={sectionStatusMap[section.id]} />
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <main className="min-w-0 space-y-6 overflow-x-hidden">
            <div className="sticky top-3 z-20 min-w-0 xl:hidden">
              <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,250,239,0.12),rgba(10,7,3,0.78))] p-4 backdrop-blur-xl shadow-[0_18px_36px_rgba(0,0,0,0.24)]">
                <p className="text-[11px] uppercase tracking-[0.26em] text-gray-500">Quick navigation</p>
                <div className="mt-3 flex w-full gap-2 overflow-x-auto pb-1 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {sectionDefinitions.map((section) => (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => focusSection(section.id)}
                      className={`shrink-0 rounded-full border px-3 py-2 text-xs transition-colors ${
                        openSection === section.id
                          ? "border-wolf-red bg-wolf-red/10 text-white"
                          : "border-white/10 bg-black/30 text-gray-300 hover:border-wolf-red hover:text-white"
                      }`}
                    >
                      {section.navLabel}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {homepageGroup ? (
              <SectionGroupIntro
                title={homepageGroup.title}
                description={homepageGroup.description}
                sections={homepageGroup.sections}
                activeSectionId={openSection}
              />
            ) : null}

            <EditableSectionCard
              id="top-banner"
              title="Top Bar Message"
              description={sectionDefinitionMap["top-banner"].description}
              summary={sectionSummaries["top-banner"]}
              status={sectionStatusMap["top-banner"]}
              isOpen={openSection === "top-banner"}
              onOpen={() => toggleSection("top-banner")}
              headerPreview={<CompactSectionPreview sectionId="top-banner" content={content} />}
            >
              <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <OwnerField
                      label="Notice text"
                      value={content.topBanner.text}
                      onChange={(value) => setSectionField("topBanner", "text", value)}
                      multiline
                      rows={3}
                      hint="This is the short message visitors see at the very top of the website."
                    />
                  </div>
                  <OwnerField
                    label="Phone number shown"
                    value={content.topBanner.phoneDisplay}
                    onChange={(value) => setSectionField("topBanner", "phoneDisplay", value)}
                    hint="This is the phone number people see in the top notice."
                  />
                  <OwnerField
                    label="Phone link"
                    value={content.topBanner.phoneHref}
                    onChange={(value) => setSectionField("topBanner", "phoneHref", value)}
                    hint="Use the phone number format people should call when they tap this link."
                  />
                </div>

                <PreviewTile label="Live preview">
                  <div className="rounded-[24px] border border-wolf-red/15 bg-[linear-gradient(135deg,rgba(250,231,178,0.18),rgba(214,177,99,0.12),rgba(255,255,255,0.03))] p-4">
                    <p className="text-sm leading-relaxed text-white">{content.topBanner.text || "Your notice text will appear here."}</p>
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-2 text-sm text-gray-200">
                      <Phone className="h-4 w-4 text-wolf-red" />
                      {content.topBanner.phoneDisplay || "Phone number"}
                    </div>
                  </div>
                </PreviewTile>
              </div>
            </EditableSectionCard>

            <EditableSectionCard
              id="hero"
              title="Website Intro"
              description={sectionDefinitionMap.hero.description}
              summary={sectionSummaries.hero}
              status={sectionStatusMap.hero}
              isOpen={openSection === "hero"}
              onOpen={() => toggleSection("hero")}
              headerPreview={<CompactSectionPreview sectionId="hero" content={content} />}
            >
              <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="grid gap-5 md:grid-cols-2">
                  <OwnerField
                    label="Small heading"
                    value={content.hero.eyebrow}
                    onChange={(value) => setSectionField("hero", "eyebrow", value)}
                    hint="A short line that introduces the business."
                  />
                  <OwnerField
                    label="Rotating badge text"
                    value={content.hero.rotatingBadgeText}
                    onChange={(value) => setSectionField("hero", "rotatingBadgeText", value)}
                    hint="This sits in the moving badge area around the hero."
                  />
                  <OwnerField
                    label="Main button text"
                    value={content.hero.primaryCtaLabel}
                    onChange={(value) => setSectionField("hero", "primaryCtaLabel", value)}
                  />
                  <OwnerField
                    label="Second button text"
                    value={content.hero.secondaryCtaLabel}
                    onChange={(value) => setSectionField("hero", "secondaryCtaLabel", value)}
                  />
                  <div className="md:col-span-2">
                    <OwnerField
                      label="Main description"
                      value={content.hero.description}
                      onChange={(value) => setSectionField("hero", "description", value)}
                      multiline
                      hint="Keep this short and clear. It should quickly explain what the business does."
                    />
                  </div>
                </div>

                <PreviewTile label="Section preview">
                  <div className="rounded-[24px] border border-white/10 bg-black/35 p-5">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-wolf-red">{content.hero.eyebrow || "Small heading"}</p>
                    <p className="mt-4 text-base leading-relaxed text-white">
                      {content.hero.description || "Your main introduction text will appear here."}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <span className="rounded-full bg-wolf-red px-4 py-2 text-sm text-white">
                        {content.hero.primaryCtaLabel || "Main button"}
                      </span>
                      <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-gray-200">
                        {content.hero.secondaryCtaLabel || "Second button"}
                      </span>
                    </div>
                  </div>
                </PreviewTile>
              </div>
            </EditableSectionCard>

            <EditableSectionCard
              id="feature-highlights"
              title="Why Customers Trust You"
              description={sectionDefinitionMap["feature-highlights"].description}
              summary={sectionSummaries["feature-highlights"]}
              status={sectionStatusMap["feature-highlights"]}
              isOpen={openSection === "feature-highlights"}
              onOpen={() => toggleSection("feature-highlights")}
              headerPreview={<CompactSectionPreview sectionId="feature-highlights" content={content} />}
            >
              <div className="grid gap-4 md:grid-cols-2">
                {content.services.features.map((feature, index) => (
                  <div key={index} className="rounded-[24px] border border-white/10 bg-black/25 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-heading font-bold text-white">{feature.title || `Highlight ${index + 1}`}</p>
                        <p className="mt-1 text-sm text-gray-500">Quick trust point shown above the services section.</p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-gray-400">
                        Card {index + 1}
                      </span>
                    </div>
                    <div className="mt-4 grid gap-4">
                      <OwnerField
                        label="Highlight title"
                        value={feature.title}
                        onChange={(value) => setArrayItemField("services", "features", index, "title", value)}
                      />
                      <OwnerField
                        label="Short supporting line"
                        value={feature.desc}
                        onChange={(value) => setArrayItemField("services", "features", index, "desc", value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </EditableSectionCard>

            {visualShowcaseGroup ? (
              <SectionGroupIntro
                title={visualShowcaseGroup.title}
                description={visualShowcaseGroup.description}
                sections={visualShowcaseGroup.sections}
                activeSectionId={openSection}
              />
            ) : null}

            <EditableSectionCard
              id="services"
              title="Your Main Services"
              description={sectionDefinitionMap.services.description}
              summary={sectionSummaries.services}
              status={sectionStatusMap.services}
              isOpen={openSection === "services"}
              onOpen={() => toggleSection("services")}
              headerPreview={<CompactSectionPreview sectionId="services" content={content} />}
            >
              <div className="space-y-6">
                <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                  <div className="grid gap-5 md:grid-cols-3">
                    <OwnerField
                      label="Small heading"
                      value={content.services.eyebrow}
                      onChange={(value) => setSectionField("services", "eyebrow", value)}
                    />
                    <OwnerField
                      label="Main heading"
                      value={content.services.title}
                      onChange={(value) => setSectionField("services", "title", value)}
                    />
                    <OwnerField
                      label="Highlighted word"
                      value={content.services.highlight}
                      onChange={(value) => setSectionField("services", "highlight", value)}
                    />
                    <div className="md:col-span-3">
                      <OwnerField
                        label="Section description"
                        value={content.services.description}
                        onChange={(value) => setSectionField("services", "description", value)}
                        multiline
                      />
                    </div>
                  </div>

                  <PreviewTile label="Section preview">
                    <div className="rounded-[24px] border border-white/10 bg-black/35 p-5">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-wolf-red">{content.services.eyebrow || "Small heading"}</p>
                      <p className="mt-3 text-2xl font-heading font-black uppercase text-white">
                        {content.services.title || "Main"} <span className="text-wolf-red">{content.services.highlight || "Heading"}</span>
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-gray-400">{content.services.description || "Your services summary appears here."}</p>
                    </div>
                  </PreviewTile>
                </div>

                <div>
                  <p className="text-sm font-heading font-bold uppercase tracking-[0.18em] text-white">Service cards</p>
                  <p className="mt-1 text-sm text-gray-500">Each card highlights a service with its own text and image.</p>
                  <div className="mt-4 space-y-4">
                    {content.services.items.map((item, index) => (
                      <div key={index} className="rounded-[28px] border border-white/10 bg-black/25 p-5">
                        <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
                          <div className="space-y-4">
                            <div>
                              <p className="text-base font-heading font-bold text-white">{item.title || `Service ${index + 1}`}</p>
                              <p className="mt-1 text-sm text-gray-500">Update the wording shown on this service card.</p>
                            </div>
                            <OwnerField
                              label="Service name"
                              value={item.title}
                              onChange={(value) => setArrayItemField("services", "items", index, "title", value)}
                            />
                            <OwnerField
                              label="Service description"
                              value={item.description}
                              onChange={(value) => setArrayItemField("services", "items", index, "description", value)}
                              multiline
                            />
                          </div>

                          <MediaReplaceCard
                            label={`${item.title || `Service ${index + 1}`} image`}
                            liveValue={savedContent.services.items[index]?.imageUrl}
                            draftValue={item.imageUrl}
                            onClear={() => setArrayItemField("services", "items", index, "imageUrl", "")}
                            uploading={uploadingField === `service-image-${index}`}
                            onUpload={(file) =>
                              uploadAsset(`service-image-${index}`, (url) => setArrayItemField("services", "items", index, "imageUrl", url), file)
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </EditableSectionCard>

            <EditableSectionCard
              id="before-after"
              title="Before & After Showcase"
              description={sectionDefinitionMap["before-after"].description}
              summary={sectionSummaries["before-after"]}
              status={sectionStatusMap["before-after"]}
              isOpen={openSection === "before-after"}
              onOpen={() => toggleSection("before-after")}
              headerPreview={<CompactSectionPreview sectionId="before-after" content={content} />}
            >
              <div className="space-y-6">
                <div className="grid gap-5 md:grid-cols-2">
                  <OwnerField
                    label="Main heading"
                    value={content.beforeAfter.title}
                    onChange={(value) => setSectionField("beforeAfter", "title", value)}
                  />
                  <OwnerField
                    label="Highlighted word"
                    value={content.beforeAfter.highlight}
                    onChange={(value) => setSectionField("beforeAfter", "highlight", value)}
                  />
                  <OwnerField
                    label="Before label"
                    value={content.beforeAfter.beforeLabel}
                    onChange={(value) => setSectionField("beforeAfter", "beforeLabel", value)}
                  />
                  <OwnerField
                    label="After label"
                    value={content.beforeAfter.afterLabel}
                    onChange={(value) => setSectionField("beforeAfter", "afterLabel", value)}
                  />
                  <div className="md:col-span-2">
                    <OwnerField
                      label="Description"
                      value={content.beforeAfter.description}
                      onChange={(value) => setSectionField("beforeAfter", "description", value)}
                      multiline
                    />
                  </div>
                </div>

                <div className="grid gap-5 xl:grid-cols-2">
                  <MediaReplaceCard
                    label="Before image"
                    liveValue={savedContent.beforeAfter.beforeImageUrl}
                    draftValue={content.beforeAfter.beforeImageUrl}
                    onClear={() => setSectionField("beforeAfter", "beforeImageUrl", "")}
                    uploading={uploadingField === "before-image"}
                    onUpload={(file) => uploadAsset("before-image", (url) => setSectionField("beforeAfter", "beforeImageUrl", url), file)}
                  />
                  <MediaReplaceCard
                    label="After image"
                    liveValue={savedContent.beforeAfter.afterImageUrl}
                    draftValue={content.beforeAfter.afterImageUrl}
                    onClear={() => setSectionField("beforeAfter", "afterImageUrl", "")}
                    uploading={uploadingField === "after-image"}
                    onUpload={(file) => uploadAsset("after-image", (url) => setSectionField("beforeAfter", "afterImageUrl", url), file)}
                  />
                </div>
              </div>
            </EditableSectionCard>

            <EditableSectionCard
              id="gallery"
              title="Featured Work"
              description={sectionDefinitionMap.gallery.description}
              summary={sectionSummaries.gallery}
              status={sectionStatusMap.gallery}
              isOpen={openSection === "gallery"}
              onOpen={() => toggleSection("gallery")}
              headerPreview={<CompactSectionPreview sectionId="gallery" content={content} />}
            >
              <div className="space-y-6">
                <div className="grid gap-5 md:grid-cols-3">
                  <OwnerField
                    label="Small heading"
                    value={content.gallery.eyebrow}
                    onChange={(value) => setSectionField("gallery", "eyebrow", value)}
                  />
                  <OwnerField
                    label="Main heading"
                    value={content.gallery.title}
                    onChange={(value) => setSectionField("gallery", "title", value)}
                  />
                  <OwnerField
                    label="Highlighted word"
                    value={content.gallery.highlight}
                    onChange={(value) => setSectionField("gallery", "highlight", value)}
                  />
                  <OwnerField
                    label="Prompt heading"
                    value={content.gallery.ctaTitle}
                    onChange={(value) => setSectionField("gallery", "ctaTitle", value)}
                  />
                  <OwnerField
                    label="Prompt highlight"
                    value={content.gallery.ctaHighlight}
                    onChange={(value) => setSectionField("gallery", "ctaHighlight", value)}
                  />
                  <OwnerField
                    label="Button text"
                    value={content.gallery.ctaButtonLabel}
                    onChange={(value) => setSectionField("gallery", "ctaButtonLabel", value)}
                  />
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  {content.gallery.items.map((item, index) => (
                    <div key={index} className="rounded-[28px] border border-white/10 bg-black/25 p-5">
                      <div className="space-y-4">
                        <div>
                          <p className="text-base font-heading font-bold text-white">{item.title || `Showcase card ${index + 1}`}</p>
                          <p className="mt-1 text-sm text-gray-500">This card appears in the visual showcase row.</p>
                        </div>
                        <OwnerField
                          label="Card title"
                          value={item.title}
                          onChange={(value) => setArrayItemField("gallery", "items", index, "title", value)}
                        />
                        <OwnerField
                          label="Card subtitle"
                          value={item.subtitle}
                          onChange={(value) => setArrayItemField("gallery", "items", index, "subtitle", value)}
                        />
                        <MediaReplaceCard
                          label={`${item.title || `Showcase card ${index + 1}`} image`}
                          liveValue={savedContent.gallery.items[index]?.imageUrl}
                          draftValue={item.imageUrl}
                          onClear={() => setArrayItemField("gallery", "items", index, "imageUrl", "")}
                          uploading={uploadingField === `gallery-image-${index}`}
                          onUpload={(file) =>
                            uploadAsset(`gallery-image-${index}`, (url) => setArrayItemField("gallery", "items", index, "imageUrl", url), file)
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </EditableSectionCard>

            {instagramTrustGroup ? (
              <SectionGroupIntro
                title={instagramTrustGroup.title}
                description={instagramTrustGroup.description}
                sections={instagramTrustGroup.sections}
                activeSectionId={openSection}
              />
            ) : null}

            <EditableSectionCard
              id="portfolio"
              title="Facebook Showcase"
              description={sectionDefinitionMap.portfolio.description}
              summary={sectionSummaries.portfolio}
              status={sectionStatusMap.portfolio}
              isOpen={openSection === "portfolio"}
              onOpen={() => toggleSection("portfolio")}
              headerPreview={<CompactSectionPreview sectionId="portfolio" content={content} />}
            >
              <div className="space-y-6">
                <PreviewTile label="How this section works">
                  <div className="rounded-[24px] border border-white/10 bg-black/30 p-5">
                    <p className="text-sm leading-relaxed text-gray-300">
                      Each preview uses one source only. You can either paste a Facebook post link, reel link, or embed code to use the native embed style, or upload custom photos or video to use a custom preview style. To switch modes, remove the existing URL or uploaded media first.
                    </p>
                  </div>
                </PreviewTile>

                <div className="grid gap-5 md:grid-cols-3">
                  <OwnerField
                    label="Small heading"
                    value={content.portfolio.eyebrow}
                    onChange={(value) => setSectionField("portfolio", "eyebrow", value)}
                  />
                  <OwnerField
                    label="Main heading"
                    value={content.portfolio.title}
                    onChange={(value) => setSectionField("portfolio", "title", value)}
                  />
                  <OwnerField
                    label="Highlighted word"
                    value={content.portfolio.highlight}
                    onChange={(value) => setSectionField("portfolio", "highlight", value)}
                  />
                  <div className="md:col-span-3">
                    <OwnerField
                      label="Section description"
                      value={content.portfolio.description}
                      onChange={(value) => setSectionField("portfolio", "description", value)}
                      multiline
                    />
                  </div>
                </div>

                {portfolioEditorItems.length === 0 ? (
                  <EmptyStateCard
                    title="No showcase items yet"
                    description="Add your first Facebook post or reel to start building this section. Each new preview can use either a Facebook link or embed code, or uploaded media, depending on how you want it to appear on the website."
                  />
                ) : (
                  <div className="space-y-4">
                    {portfolioEditorItems.map((item, itemIndex) => {
                      const hasEmbedLink = Boolean(normalizePortfolioUrl(item.link));
                      const hasUploadedMedia = item.media.some((mediaUrl) => mediaUrl.trim());
                      const portfolioItemType = getPortfolioItemType(item);
                      const uploadAccept = hasUploadedMedia
                        ? portfolioItemType === "reel"
                          ? "video/*"
                          : "image/*"
                        : "image/*,video/*";
                      const uploadLabel = hasUploadedMedia
                        ? portfolioItemType === "reel"
                          ? "Upload video"
                          : "Upload image"
                        : "Upload image or video";
                      const uploadTitle = hasUploadedMedia
                        ? portfolioItemType === "reel"
                          ? "Reel video"
                          : `Post image`
                        : "Preview media";

                      return (
                      <div key={itemIndex} className="rounded-[30px] border border-white/10 bg-black/25 p-5">
                        <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
                          <div className="space-y-4">
                            <div className="rounded-[24px] border border-white/10 bg-black/35 p-3">
                              <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500">Preview</p>
                              <div className="mt-3 h-56 overflow-hidden rounded-[18px] border border-white/10 bg-black/40">
                                {item.media.some((mediaUrl) => mediaUrl.trim()) ? (
                                  portfolioItemType === "reel" ? (
                                    <video src={item.media.find((mediaUrl) => mediaUrl.trim())} className="h-full w-full object-cover" muted playsInline />
                                  ) : (
                                    <img
                                      src={item.media.find((mediaUrl) => mediaUrl.trim())}
                                      alt={item.label || `Portfolio item ${itemIndex + 1}`}
                                      className="h-full w-full object-cover"
                                    />
                                  )
                                ) : normalizePortfolioUrl(item.link) ? (
                                  <iframe
                                    title={item.label || `Portfolio item ${itemIndex + 1}`}
                                    src={getPortfolioEmbedUrl(item.link)}
                                    className="h-[520px] w-full border-0"
                                    loading="lazy"
                                    allowTransparency={true}
                                    allow="encrypted-media"
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center px-4 text-center text-sm text-gray-500">
                                    Add a Facebook post link to use the default embed style, or upload media to use the custom preview style.
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-3 rounded-[22px] border border-white/10 bg-black/30 px-4 py-3">
                              <div>
                                <p className="text-sm font-semibold text-white">{item.label || `Showcase item ${itemIndex + 1}`}</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-gray-400">
                                    {portfolioItemType === "reel" ? "Reel" : "Post"}
                                  </span>
                                  <span className="rounded-full border border-wolf-red/20 bg-wolf-red/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-wolf-red">
                                    {item.media.some((mediaUrl) => mediaUrl.trim()) ? "Custom preview style" : "Embed style"}
                                  </span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removePortfolioItem(itemIndex)}
                                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-gray-400 transition-colors hover:border-wolf-red hover:text-white"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </button>
                            </div>
                          </div>

                          <div className="space-y-5">
                            <div className="grid gap-5">
                              <OwnerField
                                label="Private label"
                                value={item.label}
                                onChange={(value) => setPortfolioItem(itemIndex, { label: value })}
                                placeholder="Example: Black Mustang reel"
                                hint="This is only visible in your dashboard."
                              />
                            </div>

                            <OwnerField
                              label="Facebook post or embed link"
                              value={item.link}
                              onChange={(value) => setPortfolioLink(itemIndex, value)}
                              disabled={hasUploadedMedia}
                              placeholder="Paste the Facebook post, reel, video, or embed link"
                              hint={
                                hasUploadedMedia
                                  ? "This preview is currently using uploaded media. Remove the uploaded media first if you want to switch this item back to URL embed mode."
                                  : "Paste a Facebook post link, reel link, plugin URL, or full iframe embed code here to use the native embed."
                              }
                            />
                            {hasEmbedLink ? (
                              <div className="flex flex-wrap gap-3">
                                <button
                                  type="button"
                                  onClick={() => clearPortfolioLink(itemIndex)}
                                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-gray-300 transition-colors hover:border-wolf-red hover:text-white"
                                >
                                  <Undo2 className="h-4 w-4" />
                                  Remove Facebook URL
                                </button>
                              </div>
                            ) : null}

                            <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <p className="text-base font-heading font-bold text-white">Uploaded preview media</p>
                                  <p className="mt-1 text-sm text-gray-500">
                                    {hasEmbedLink
                                      ? "This preview is currently using a Facebook URL. Remove that URL first if you want to upload custom preview media instead."
                                      : hasUploadedMedia
                                        ? portfolioItemType === "reel"
                                          ? "This preview is using uploaded video, so it behaves like a reel."
                                          : "This preview is using uploaded images, so one image stays as a post and multiple images become a carousel."
                                        : "Upload one image for a post, multiple images for a carousel, or one video for a reel-style preview."}
                                  </p>
                                </div>
                                {!hasEmbedLink && hasUploadedMedia && portfolioItemType === "post" ? (
                                  <button
                                    type="button"
                                    onClick={() => addPortfolioMediaSlot(itemIndex)}
                                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-gray-300 transition-colors hover:border-wolf-red hover:text-white"
                                  >
                                    <Plus className="h-4 w-4" />
                                    Add another photo
                                  </button>
                                ) : null}
                              </div>

                              {hasUploadedMedia ? (
                                <div className="mt-4 flex flex-wrap gap-3">
                                  <button
                                    type="button"
                                    onClick={() => clearPortfolioMedia(itemIndex)}
                                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-gray-300 transition-colors hover:border-wolf-red hover:text-white"
                                  >
                                    <Undo2 className="h-4 w-4" />
                                    Remove uploaded media
                                  </button>
                                </div>
                              ) : null}

                              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                                {item.media.map((mediaValue, mediaIndex) => (
                                  <div key={mediaIndex} className="rounded-[22px] border border-white/10 bg-black/35 p-4">
                                    <div className="flex items-start justify-between gap-3">
                                      <div>
                                        <p className="text-sm font-semibold text-white">
                                          {portfolioItemType === "reel"
                                            ? "Reel video"
                                            : hasUploadedMedia
                                              ? `Post image ${mediaIndex + 1}`
                                              : `${uploadTitle} ${mediaIndex + 1}`}
                                        </p>
                                        <p className="mt-1 text-xs leading-relaxed text-gray-500">
                                          {portfolioItemType === "reel"
                                            ? "This video is what people will see in the showcase."
                                            : hasUploadedMedia
                                              ? "This image becomes part of the post gallery."
                                              : "Choose an image or a video and the preview type will update automatically."}
                                        </p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => removePortfolioMediaSlot(itemIndex, mediaIndex)}
                                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-gray-400 transition-colors hover:border-wolf-red hover:text-white"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                        Remove
                                      </button>
                                    </div>

                                    <div className="mt-4 h-32 overflow-hidden rounded-[18px] border border-white/10 bg-black/40">
                                      {mediaValue ? (
                                        portfolioItemType === "reel" ? (
                                          <video src={mediaValue} className="h-full w-full object-cover" muted playsInline />
                                        ) : (
                                          <img src={mediaValue} alt={`Portfolio media ${mediaIndex + 1}`} className="h-full w-full object-cover" />
                                        )
                                      ) : (
                                        <div className="flex h-full items-center justify-center px-4 text-center text-sm text-gray-500">
                                          No uploaded media yet. This item will use the embed style until you add one.
                                        </div>
                                      )}
                                    </div>

                                    <label className={`mt-4 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200 transition-colors ${hasEmbedLink ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:border-wolf-red hover:text-white"}`}>
                                      {uploadingField === `portfolio-${itemIndex}-${mediaIndex}` ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : portfolioItemType === "reel" && hasUploadedMedia ? (
                                        <Film className="h-4 w-4" />
                                      ) : (
                                        <ImagePlus className="h-4 w-4" />
                                      )}
                                      {uploadLabel}
                                      <input
                                        type="file"
                                        accept={uploadAccept}
                                        disabled={hasEmbedLink}
                                        className="hidden"
                                        onChange={(event) => {
                                          const file = event.target.files?.[0];
                                          if (file) {
                                            handlePortfolioMediaUpload(itemIndex, mediaIndex, file);
                                          }
                                          event.target.value = "";
                                        }}
                                      />
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )})}
                  </div>
                )}

                <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(206,214,225,0.05),rgba(10,7,3,0.56))] p-5 shadow-[0_18px_44px_rgba(0,0,0,0.22)]">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-base font-heading font-bold text-white">Add another preview</p>
                      <p className="mt-1 max-w-2xl text-sm leading-relaxed text-gray-400">
                        Use this to append a brand new Facebook preview after the current ones. Each new preview can use either a Facebook URL or uploaded preview media, but not both at the same time.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addPortfolioItem}
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200 transition-colors hover:border-wolf-red hover:text-white"
                    >
                      <Plus className="h-4 w-4" />
                      Add another preview
                    </button>
                  </div>
                </div>
              </div>
            </EditableSectionCard>

            <EditableSectionCard
              id="faq"
              title="Questions Customers Ask"
              description={sectionDefinitionMap.faq.description}
              summary={sectionSummaries.faq}
              status={sectionStatusMap.faq}
              isOpen={openSection === "faq"}
              onOpen={() => toggleSection("faq")}
              headerPreview={<CompactSectionPreview sectionId="faq" content={content} />}
            >
              <div className="grid gap-5 md:grid-cols-3">
                <OwnerField
                  label="Small heading"
                  value={content.faq.eyebrow}
                  onChange={(value) => setSectionField("faq", "eyebrow", value)}
                />
                <OwnerField
                  label="Main heading"
                  value={content.faq.title}
                  onChange={(value) => setSectionField("faq", "title", value)}
                />
                <OwnerField
                  label="Highlighted word"
                  value={content.faq.highlight}
                  onChange={(value) => setSectionField("faq", "highlight", value)}
                />
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-white/10 bg-black/20 p-4">
                <div>
                  <p className="text-sm font-semibold text-white">FAQ entries</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Add as many common customer questions as you need. The website will show each one in this section.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addFaqItem}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200 transition-colors hover:border-wolf-red hover:text-white"
                >
                  <Plus className="h-4 w-4" />
                  Add question
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {content.faq.items.map((item, index) => (
                  <div key={index} className="rounded-[26px] border border-white/10 bg-black/25 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-base font-heading font-bold text-white">Question {index + 1}</p>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-gray-400">
                          FAQ
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFaqItem(index)}
                          disabled={content.faq.items.length <= 1}
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-gray-400 transition-colors hover:border-wolf-red hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-4">
                      <OwnerField
                        label="Question"
                        value={item.question}
                        onChange={(value) => setArrayItemField("faq", "items", index, "question", value)}
                      />
                      <OwnerField
                        label="Answer"
                        value={item.answer}
                        onChange={(value) => setArrayItemField("faq", "items", index, "answer", value)}
                        multiline
                      />
                    </div>
                  </div>
                ))}
              </div>
            </EditableSectionCard>

            <EditableSectionCard
              id="cta"
              title="Get In Touch Section"
              description={sectionDefinitionMap.cta.description}
              summary={sectionSummaries.cta}
              status={sectionStatusMap.cta}
              isOpen={openSection === "cta"}
              onOpen={() => toggleSection("cta")}
              headerPreview={<CompactSectionPreview sectionId="cta" content={content} />}
            >
              <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="grid gap-5 md:grid-cols-2">
                  <OwnerField
                    label="Small heading"
                    value={content.cta.eyebrow}
                    onChange={(value) => setSectionField("cta", "eyebrow", value)}
                  />
                  <OwnerField
                    label="Button text"
                    value={content.cta.buttonLabel}
                    onChange={(value) => setSectionField("cta", "buttonLabel", value)}
                  />
                  <OwnerField
                    label="Main heading"
                    value={content.cta.title}
                    onChange={(value) => setSectionField("cta", "title", value)}
                  />
                  <OwnerField
                    label="Highlighted word"
                    value={content.cta.highlight}
                    onChange={(value) => setSectionField("cta", "highlight", value)}
                  />
                  <div className="md:col-span-2">
                    <OwnerField
                      label="Description"
                      value={content.cta.description}
                      onChange={(value) => setSectionField("cta", "description", value)}
                      multiline
                    />
                  </div>
                </div>

                <PreviewTile label="Section preview">
                  <div className="rounded-[24px] border border-white/10 bg-black/35 p-5">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-wolf-red">{content.cta.eyebrow || "Small heading"}</p>
                    <p className="mt-3 text-2xl font-heading font-black uppercase text-white">
                      {content.cta.title || "Main"} <span className="text-wolf-red">{content.cta.highlight || "Heading"}</span>
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-gray-400">{content.cta.description || "Your booking prompt appears here."}</p>
                    <span className="mt-5 inline-flex rounded-full bg-wolf-red px-4 py-2 text-sm text-white">
                      {content.cta.buttonLabel || "Button text"}
                    </span>
                  </div>
                </PreviewTile>
              </div>
            </EditableSectionCard>

            {businessDetailsGroup ? (
              <SectionGroupIntro
                title={businessDetailsGroup.title}
                description={businessDetailsGroup.description}
                sections={businessDetailsGroup.sections}
                activeSectionId={openSection}
              />
            ) : null}

            <EditableSectionCard
              id="contact"
              title="Business Details"
              description={sectionDefinitionMap.contact.description}
              summary={sectionSummaries.contact}
              status={sectionStatusMap.contact}
              isOpen={openSection === "contact"}
              onOpen={() => toggleSection("contact")}
              headerPreview={<CompactSectionPreview sectionId="contact" content={content} />}
            >
              <div className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-[28px] border border-white/10 bg-black/25 p-5">
                  <p className="text-base font-heading font-bold text-white">Contact section copy</p>
                  <div className="mt-4 grid gap-4">
                    <OwnerField
                      label="Section heading"
                      value={content.contact.title}
                      onChange={(value) => setSectionField("contact", "title", value)}
                    />
                    <OwnerField
                      label="Highlighted word"
                      value={content.contact.highlight}
                      onChange={(value) => setSectionField("contact", "highlight", value)}
                    />
                    <OwnerField
                      label="Section description"
                      value={content.contact.description}
                      onChange={(value) => setSectionField("contact", "description", value)}
                      multiline
                    />
                    <OwnerField
                      label="Quote form title"
                      value={content.contact.quoteTitle}
                      onChange={(value) => setSectionField("contact", "quoteTitle", value)}
                    />
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-black/25 p-5">
                  <p className="text-base font-heading font-bold text-white">Business details</p>
                  <div className="mt-4 grid gap-4">
                    <OwnerField
                      label="Phone number shown"
                      value={content.business.phoneDisplay}
                      onChange={(value) => setSectionField("business", "phoneDisplay", value)}
                    />
                    <OwnerField
                      label="Business email"
                      value={content.business.email}
                      onChange={(value) => setSectionField("business", "email", value)}
                    />
                    <OwnerField
                      label="Business address"
                      value={content.business.address}
                      onChange={(value) => setSectionField("business", "address", value)}
                      multiline
                    />
                    <OwnerField
                      label="Opening hours"
                      value={content.business.hours}
                      onChange={(value) => setSectionField("business", "hours", value)}
                      multiline
                    />
                    <OwnerField
                      label="Footer description"
                      value={content.business.footerBlurb}
                      onChange={(value) => setSectionField("business", "footerBlurb", value)}
                      multiline
                    />
                    <OwnerField
                      label="Instagram link"
                      value={content.business.instagramUrl}
                      onChange={(value) => setSectionField("business", "instagramUrl", value)}
                    />
                    <OwnerField
                      label="Facebook link"
                      value={content.business.facebookUrl}
                      onChange={(value) => setSectionField("business", "facebookUrl", value)}
                    />
                    <OwnerField
                      label="Business ABN"
                      value={content.business.abn}
                      onChange={(value) => setSectionField("business", "abn", value)}
                    />
                  </div>
                </div>
              </div>

              <details className="mt-6 rounded-[24px] border border-white/10 bg-black/25 p-5">
                <summary className="cursor-pointer list-none text-sm font-semibold text-white">Advanced details</summary>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
                  Only change these if you need to adjust the tap-to-call number or the embedded Google map.
                </p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <OwnerField
                    label="Phone link"
                    value={content.business.phoneHref}
                    onChange={(value) => setSectionField("business", "phoneHref", value)}
                    hint="Usually formatted like tel:0412345678"
                  />
                  <OwnerField
                    label="Map embed link"
                    value={content.business.mapEmbedUrl}
                    onChange={(value) => setSectionField("business", "mapEmbedUrl", value)}
                    multiline
                    hint="Paste the Google Maps embed link here, not the normal page link."
                  />
                </div>
              </details>
            </EditableSectionCard>
          </main>

          <aside className="hidden 2xl:block">
            <div className="sticky top-6 space-y-4">
              <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,249,236,0.08),rgba(10,7,3,0.58))] p-5 shadow-[0_22px_64px_rgba(0,0,0,0.28)]">
                <p className="text-[11px] uppercase tracking-[0.26em] text-gray-500">Current focus</p>
                {activeSection ? (
                  <>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-[18px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,249,236,0.05),rgba(10,7,3,0.52))]">
                        <ActiveSectionIcon className="h-5 w-5 text-wolf-red" />
                      </div>
                      <div>
                        <p className="text-base font-heading font-bold text-white">{activeSection.navLabel}</p>
                        <p className="mt-1 text-sm text-gray-500">{sectionSummaries[activeSection.id]}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <CompactSectionPreview sectionId={activeSection.id} content={content} />
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-gray-400">{activeSection.description}</p>
                  </>
                ) : (
                  <div className="mt-4 rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,249,236,0.05),rgba(10,7,3,0.54))] p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-[18px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,249,236,0.05),rgba(10,7,3,0.52))]">
                        <ActiveSectionIcon className="h-5 w-5 text-wolf-red" />
                      </div>
                      <div>
                        <p className="text-base font-heading font-bold text-white">No section selected</p>
                        <p className="mt-1 text-sm text-gray-500">Open a section from the editor to see its details here.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,249,236,0.08),rgba(10,7,3,0.58))] p-5 shadow-[0_22px_64px_rgba(0,0,0,0.28)]">
                <p className="text-[11px] uppercase tracking-[0.26em] text-gray-500">Draft at a glance</p>
                <div className="mt-4 grid gap-3">
                  <div className="rounded-[20px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,249,236,0.05),rgba(10,7,3,0.5))] px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">Sections waiting</p>
                    <p className="mt-1 text-lg font-heading font-bold text-white">{changedSections.length}</p>
                  </div>
                  <div className="rounded-[20px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,249,236,0.05),rgba(10,7,3,0.5))] px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">Media updates</p>
                    <p className="mt-1 text-lg font-heading font-bold text-white">{mediaChangeCount}</p>
                  </div>
                  <div className="rounded-[20px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,249,236,0.05),rgba(10,7,3,0.5))] px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">Showcase items</p>
                    <p className="mt-1 text-lg font-heading font-bold text-white">{portfolioPreparedCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div
        className={`fixed inset-x-3 bottom-3 z-30 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,14,7,0.94),rgba(9,6,3,0.86))] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:inset-x-4 sm:bottom-4 xl:hidden ${isDirty || saving ? "" : "hidden"}`}
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" }}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500">Draft & Publish</p>
            <p className="mt-1 text-sm text-gray-200">{isDirty ? `${changedSections.length} section${changedSections.length === 1 ? "" : "s"} ready` : "Everything is live"}</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={handleResetDraft}
              disabled={!isDirty}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm text-gray-300 transition-colors hover:border-wolf-red hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
            >
              <RefreshCw className="h-4 w-4" />
              Remove draft
            </button>
            <button
              type="button"
              onClick={requestPublish}
              disabled={saving || !isDirty}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-wolf-red px-4 py-3 text-sm font-heading uppercase tracking-[0.16em] text-white transition-colors hover:bg-wolf-red-hover disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Review & Publish
            </button>
          </div>
        </div>
      </div>

      <div className={`fixed bottom-5 left-1/2 z-30 hidden w-[min(960px,calc(100%-48px))] -translate-x-1/2 items-center justify-between gap-6 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,14,7,0.94),rgba(9,6,3,0.86))] px-5 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.38)] backdrop-blur-xl xl:flex ${isDirty || saving ? "" : "pointer-events-none opacity-0"}`}>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-[18px] border border-wolf-red/20 bg-wolf-red/10">
            <Save className="h-5 w-5 text-wolf-red" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500">Draft ready</p>
            <p className="mt-1 text-sm text-white">
              {isDirty ? `${changedSections.length} section${changedSections.length === 1 ? "" : "s"} edited | ${mediaChangeCount} media change${mediaChangeCount === 1 ? "" : "s"}` : "Everything is live"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetDraft}
            disabled={!isDirty}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm text-gray-300 transition-colors hover:border-wolf-red hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RefreshCw className="h-4 w-4" />
            Remove draft changes
          </button>
          <button
            type="button"
            onClick={requestPublish}
            disabled={saving || !isDirty}
            className="inline-flex items-center gap-2 rounded-2xl bg-wolf-red px-5 py-3 text-sm font-heading uppercase tracking-[0.16em] text-white transition-colors hover:bg-wolf-red-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Review & Publish
          </button>
        </div>
      </div>

      <PublishReviewModal
        open={publishReviewOpen}
        onClose={() => setPublishReviewOpen(false)}
        onConfirm={handleSave}
        saving={saving}
        changedSections={changedSections}
        mediaChangeCount={mediaChangeCount}
        portfolioPreparedCount={portfolioPreparedCount}
      />
    </div>
  );
}
