import { useEffect, useMemo, useState, type ReactNode } from "react";
import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import {
  Loader2,
  RefreshCw,
  Save,
  Globe,
  Upload,
  Undo2,
  ImagePlus,
  Film,
  Plus,
  Trash2,
  Sparkles,
  LayoutTemplate,
  MessageSquareText,
} from "lucide-react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { defaultSiteContent, mergeSiteContent, SiteContent } from "../siteContent";
import { uploadToCloudinary } from "../utils/cloudinary";

function Field({
  label,
  value,
  onChange,
  multiline = false,
  placeholder = "",
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-[11px] font-heading uppercase tracking-[0.22em] text-gray-400">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={4}
          placeholder={placeholder}
          className="w-full rounded-2xl bg-black/45 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-wolf-red transition-colors resize-y"
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl bg-black/45 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-wolf-red transition-colors"
        />
      )}
      {hint ? <p className="text-xs text-gray-500">{hint}</p> : null}
    </label>
  );
}

function ImageField({
  label,
  value,
  onUpload,
  onClear,
  uploading,
  emptyText = "Current website image will stay in place until you upload a replacement.",
}: {
  label: string;
  value?: string;
  onUpload: (file: File) => void;
  onClear: () => void;
  uploading: boolean;
  emptyText?: string;
}) {
  return (
    <div className="space-y-3 rounded-[24px] border border-white/8 bg-black/30 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <span className="block text-[11px] font-heading uppercase tracking-[0.22em] text-gray-400">{label}</span>
          <p className="mt-1 text-xs text-gray-500">
            {value ? "Replacement media is ready for this section." : "This section is still using the image already on the website."}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-gray-300">
          <ImagePlus className="h-3.5 w-3.5 text-wolf-red" />
          {value ? "Custom image" : "Website image"}
        </div>
      </div>
      <div className="h-24 rounded-2xl border border-white/10 bg-black/50 overflow-hidden">
        {value ? (
          <img src={value} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-xs text-gray-500">
            {emptyText}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        <label className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl border border-white/10 bg-white/5 text-sm text-gray-200 hover:text-white hover:border-wolf-red transition-colors cursor-pointer">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          Upload Replacement
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
          className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl border border-white/10 text-sm text-gray-400 hover:text-white hover:border-wolf-red transition-colors"
        >
          <Undo2 className="w-4 h-4" />
          Revert To Website Image
        </button>
      </div>
    </div>
  );
}

function SectionCard({
  id,
  title,
  description,
  children,
}: {
  id?: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] shadow-[0_20px_60px_rgba(0,0,0,0.25)] scroll-mt-32"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-wolf-red/50 to-transparent" />
      <div className="border-b border-white/8 px-6 py-5">
        <h2 className="text-lg font-heading font-bold uppercase tracking-[0.18em] text-white">{title}</h2>
        <p className="text-sm text-gray-400 mt-1">{description}</p>
      </div>
      <div className="p-6 space-y-6">{children}</div>
    </section>
  );
}

export default function ContentDashboard() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [savedContent, setSavedContent] = useState<SiteContent>(defaultSiteContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "siteContent", "homepage"),
      (snapshot) => {
        const merged = mergeSiteContent(snapshot.exists() ? (snapshot.data() as Partial<SiteContent>) : undefined);
        setContent(merged);
        setSavedContent(merged);
        setLoading(false);
      },
      (error) => {
        console.error("Failed to load content dashboard:", error);
        setStatus("Could not load website content. Check your Firestore permissions.");
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const isDirty = useMemo(() => JSON.stringify(content) !== JSON.stringify(savedContent), [content, savedContent]);
  const sectionLinks = [
    { id: "top-banner", label: "Top Banner" },
    { id: "hero", label: "Hero" },
    { id: "feature-highlights", label: "Highlights" },
    { id: "services", label: "Services" },
    { id: "before-after", label: "Before / After" },
    { id: "gallery", label: "Gallery" },
    { id: "portfolio", label: "Portfolio" },
    { id: "faq", label: "FAQ" },
    { id: "cta", label: "Call To Action" },
    { id: "contact", label: "Contact" },
  ];

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

  const setPortfolioItem = (index: number, updates: Partial<SiteContent["portfolio"]["items"][number]>) => {
    setContent((current) => ({
      ...current,
      portfolio: {
        ...current.portfolio,
        items: current.portfolio.items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...updates } : item)),
      },
    }));
  };

  const setPortfolioMedia = (itemIndex: number, mediaIndex: number, value: string) => {
    setContent((current) => ({
      ...current,
      portfolio: {
        ...current.portfolio,
        items: current.portfolio.items.map((item, currentIndex) =>
          currentIndex === itemIndex
            ? {
                ...item,
                media: item.media.map((mediaValue, currentMediaIndex) => (currentMediaIndex === mediaIndex ? value : mediaValue)),
              }
            : item,
        ),
      },
    }));
  };

  const addPortfolioItem = () => {
    setContent((current) => ({
      ...current,
      portfolio: {
        ...current.portfolio,
        items: [
          ...current.portfolio.items,
          {
            label: `Item ${current.portfolio.items.length + 1}`,
            type: "post",
            media: [""],
            link: "",
          },
        ],
      },
    }));
  };

  const removePortfolioItem = (index: number) => {
    setContent((current) => ({
      ...current,
      portfolio: {
        ...current.portfolio,
        items: current.portfolio.items.filter((_, itemIndex) => itemIndex !== index),
      },
    }));
  };

  const addPortfolioMediaSlot = (itemIndex: number) => {
    setContent((current) => ({
      ...current,
      portfolio: {
        ...current.portfolio,
        items: current.portfolio.items.map((item, currentIndex) =>
          currentIndex === itemIndex ? { ...item, media: [...item.media, ""] } : item,
        ),
      },
    }));
  };

  const removePortfolioMediaSlot = (itemIndex: number, mediaIndex: number) => {
    setContent((current) => ({
      ...current,
      portfolio: {
        ...current.portfolio,
        items: current.portfolio.items.map((item, currentIndex) =>
          currentIndex === itemIndex
            ? { ...item, media: item.media.filter((_, currentMediaIndex) => currentMediaIndex !== mediaIndex) }
            : item,
        ),
      },
    }));
  };

  const uploadAsset = async (fieldKey: string, onComplete: (url: string) => void, file: File) => {
    setUploadingField(fieldKey);
    setStatus("Uploading media...");

    try {
      const url = await uploadToCloudinary(file);
      onComplete(url);
      setStatus("Upload complete. Click Save Content to publish it.");
    } catch (error) {
      console.error("Media upload failed:", error);
      setStatus("Upload failed. Check the Cloudinary settings or network access.");
    } finally {
      setUploadingField("");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus("");

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
      setStatus("Website content saved.");
    } catch (error) {
      console.error("Failed to save content:", error);
      setStatus("Save failed. Check Firestore write permissions for the owner account.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-wolf-red animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[radial-gradient(circle_at_top,rgba(230,0,0,0.08),transparent_35%),linear-gradient(180deg,#080808,#030303)]">
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
        <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(230,0,0,0.12),rgba(255,255,255,0.04))] shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <div className="grid gap-8 px-6 py-8 md:grid-cols-[1.5fr_1fr] md:px-8 md:py-10">
            <div>
              <p className="mb-3 text-[11px] font-heading uppercase tracking-[0.3em] text-wolf-red">Owner Control Panel</p>
              <h1 className="text-3xl font-heading font-black uppercase tracking-[0.12em] text-white md:text-5xl">
                Website Content
              </h1>
              <p className="mt-4 max-w-2xl text-sm text-gray-300 md:text-base">
                Update website words, swap section images, and manage portfolio posts without editing code.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
                <div className="flex items-center gap-2 text-[11px] font-heading uppercase tracking-[0.2em] text-gray-500">
                  <LayoutTemplate className="h-3.5 w-3.5" />
                  Edits Here
                </div>
                <p className="mt-2 text-2xl font-heading font-bold text-white">1</p>
                <p className="mt-1 text-sm text-gray-400">One place for copy and media.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
                <div className="flex items-center gap-2 text-[11px] font-heading uppercase tracking-[0.2em] text-gray-500">
                  <Sparkles className="h-3.5 w-3.5" />
                  Live Media
                </div>
                <p className="mt-2 text-2xl font-heading font-bold text-white">Upload</p>
                <p className="mt-1 text-sm text-gray-400">Replace section visuals from admin.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
                <div className="flex items-center gap-2 text-[11px] font-heading uppercase tracking-[0.2em] text-gray-500">
                  <MessageSquareText className="h-3.5 w-3.5" />
                  Portfolio
                </div>
                <p className="mt-2 text-2xl font-heading font-bold text-white">Posts</p>
                <p className="mt-1 text-sm text-gray-400">Add custom posts or reels below.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
                <div className="flex items-center gap-2 text-[11px] font-heading uppercase tracking-[0.2em] text-gray-500">
                  <Save className="h-3.5 w-3.5" />
                  Publish
                </div>
                <p className="mt-2 text-2xl font-heading font-bold text-white">Save</p>
                <p className="mt-1 text-sm text-gray-400">Uploads stage changes. Save makes them live.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="sticky top-4 z-20 flex flex-col gap-3 rounded-[24px] border border-white/10 bg-black/70 p-4 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-heading uppercase tracking-[0.26em] text-gray-500">Publishing Status</p>
            <p className="mt-1 text-sm text-gray-200">{status || (isDirty ? "You have unsaved changes." : "Everything is up to date.")}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200 transition-colors hover:border-wolf-red/35 hover:text-white"
            >
              <Globe className="w-4 h-4" />
              View Site
            </Link>
            <button
              type="button"
              onClick={() => {
                setContent(savedContent);
                setStatus("Unsaved changes cleared.");
              }}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200 transition-colors hover:border-wolf-red/35 hover:text-white"
            >
              <RefreshCw className="w-4 h-4" />
              Reset Draft
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !isDirty}
              className="inline-flex items-center gap-2 rounded-2xl bg-wolf-red px-5 py-3 text-sm font-heading uppercase tracking-[0.18em] text-white transition-colors hover:bg-wolf-red-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Content
            </button>
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[11px] font-heading uppercase tracking-[0.26em] text-gray-500">Quick Jump</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {sectionLinks.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="rounded-full border border-white/10 bg-black/30 px-3 py-2 text-xs text-gray-300 transition-colors hover:border-wolf-red hover:text-white"
              >
                {section.label}
              </a>
            ))}
          </div>
        </div>

      <SectionCard id="top-banner" title="Top Banner" description="This is the red strip above the navigation.">
        <div className="grid gap-6 md:grid-cols-3">
          <Field label="Banner Text" value={content.topBanner.text} onChange={(value) => setSectionField("topBanner", "text", value)} multiline />
          <Field label="Phone Display" value={content.topBanner.phoneDisplay} onChange={(value) => setSectionField("topBanner", "phoneDisplay", value)} />
          <Field label="Phone Link" value={content.topBanner.phoneHref} onChange={(value) => setSectionField("topBanner", "phoneHref", value)} />
        </div>
      </SectionCard>

      <SectionCard id="hero" title="Hero" description="Main intro section on the homepage.">
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Eyebrow" value={content.hero.eyebrow} onChange={(value) => setSectionField("hero", "eyebrow", value)} />
          <Field label="Rotating Badge Text" value={content.hero.rotatingBadgeText} onChange={(value) => setSectionField("hero", "rotatingBadgeText", value)} />
          <Field label="Primary Button" value={content.hero.primaryCtaLabel} onChange={(value) => setSectionField("hero", "primaryCtaLabel", value)} />
          <Field label="Secondary Button" value={content.hero.secondaryCtaLabel} onChange={(value) => setSectionField("hero", "secondaryCtaLabel", value)} />
          <div className="md:col-span-2">
            <Field label="Description" value={content.hero.description} onChange={(value) => setSectionField("hero", "description", value)} multiline />
          </div>
        </div>
      </SectionCard>

      <SectionCard id="feature-highlights" title="Feature Highlights" description="These are the small trust banners that sit above the service cards.">
        <div className="grid gap-4 md:grid-cols-2">
          {content.services.features.map((feature, index) => (
            <div key={index} className="rounded-[24px] border border-white/8 bg-black/30 p-5 space-y-4">
              <p className="text-sm font-heading font-bold uppercase tracking-[0.18em] text-white">
                {feature.title || `Feature ${index + 1}`}
              </p>
              <Field label="Title" value={feature.title} onChange={(value) => setArrayItemField("services", "features", index, "title", value)} />
              <Field label="Description" value={feature.desc} onChange={(value) => setArrayItemField("services", "features", index, "desc", value)} />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard id="services" title="Services" description="Main services section and the individual service cards underneath it.">
        <div className="grid gap-6 md:grid-cols-3">
          <Field label="Section Eyebrow" value={content.services.eyebrow} onChange={(value) => setSectionField("services", "eyebrow", value)} />
          <Field label="Heading Left" value={content.services.title} onChange={(value) => setSectionField("services", "title", value)} />
          <Field label="Heading Highlight" value={content.services.highlight} onChange={(value) => setSectionField("services", "highlight", value)} />
          <div className="md:col-span-3">
            <Field label="Section Description" value={content.services.description} onChange={(value) => setSectionField("services", "description", value)} multiline />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-heading uppercase tracking-widest text-gray-400">Service Cards</h3>
          <div className="space-y-4">
            {content.services.items.map((item, index) => (
              <div key={index} className="rounded-[24px] border border-white/8 bg-black/30 p-5 space-y-4">
                <p className="text-sm font-heading font-bold uppercase tracking-[0.18em] text-white">
                  {item.title || `Service ${index + 1}`}
                </p>
                <Field label="Service title" value={item.title} onChange={(value) => setArrayItemField("services", "items", index, "title", value)} />
                <Field label="Service description" value={item.description} onChange={(value) => setArrayItemField("services", "items", index, "description", value)} multiline />
                <ImageField
                  label={`${item.title || `Service ${index + 1}`} image`}
                  value={item.imageUrl}
                  onClear={() => setArrayItemField("services", "items", index, "imageUrl", "")}
                  uploading={uploadingField === `service-image-${index}`}
                  onUpload={(file) =>
                    uploadAsset(`service-image-${index}`, (url) => setArrayItemField("services", "items", index, "imageUrl", url), file)
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard id="before-after" title="Before / After" description="Controls the transformation slider and its images.">
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Heading Left" value={content.beforeAfter.title} onChange={(value) => setSectionField("beforeAfter", "title", value)} />
          <Field label="Heading Highlight" value={content.beforeAfter.highlight} onChange={(value) => setSectionField("beforeAfter", "highlight", value)} />
          <Field label="Before Label" value={content.beforeAfter.beforeLabel} onChange={(value) => setSectionField("beforeAfter", "beforeLabel", value)} />
          <Field label="After Label" value={content.beforeAfter.afterLabel} onChange={(value) => setSectionField("beforeAfter", "afterLabel", value)} />
          <div className="md:col-span-2">
            <Field label="Description" value={content.beforeAfter.description} onChange={(value) => setSectionField("beforeAfter", "description", value)} multiline />
          </div>
          <ImageField
            label="Before Image"
            value={content.beforeAfter.beforeImageUrl}
            onClear={() => setSectionField("beforeAfter", "beforeImageUrl", "")}
            uploading={uploadingField === "before-image"}
            onUpload={(file) => uploadAsset("before-image", (url) => setSectionField("beforeAfter", "beforeImageUrl", url), file)}
          />
          <ImageField
            label="After Image"
            value={content.beforeAfter.afterImageUrl}
            onClear={() => setSectionField("beforeAfter", "afterImageUrl", "")}
            uploading={uploadingField === "after-image"}
            onUpload={(file) => uploadAsset("after-image", (url) => setSectionField("beforeAfter", "afterImageUrl", url), file)}
          />
        </div>
      </SectionCard>

      <SectionCard id="gallery" title="Gallery" description="Overrides for the horizontal showcase cards.">
        <div className="grid gap-6 md:grid-cols-3">
          <Field label="Section Eyebrow" value={content.gallery.eyebrow} onChange={(value) => setSectionField("gallery", "eyebrow", value)} />
          <Field label="Heading Left" value={content.gallery.title} onChange={(value) => setSectionField("gallery", "title", value)} />
          <Field label="Heading Highlight" value={content.gallery.highlight} onChange={(value) => setSectionField("gallery", "highlight", value)} />
          <Field label="CTA Left" value={content.gallery.ctaTitle} onChange={(value) => setSectionField("gallery", "ctaTitle", value)} />
          <Field label="CTA Highlight" value={content.gallery.ctaHighlight} onChange={(value) => setSectionField("gallery", "ctaHighlight", value)} />
          <Field label="CTA Button" value={content.gallery.ctaButtonLabel} onChange={(value) => setSectionField("gallery", "ctaButtonLabel", value)} />
        </div>

        <div className="space-y-4">
          {content.gallery.items.map((item, index) => (
            <div key={index} className="rounded-[24px] border border-white/8 bg-black/30 p-5 space-y-4">
              <p className="text-sm font-heading font-bold uppercase tracking-[0.18em] text-white">
                {item.title || `Gallery ${index + 1}`}
              </p>
              <Field label="Card title" value={item.title} onChange={(value) => setArrayItemField("gallery", "items", index, "title", value)} />
              <Field label="Card subtitle" value={item.subtitle} onChange={(value) => setArrayItemField("gallery", "items", index, "subtitle", value)} />
              <ImageField
                label={`${item.title || `Gallery ${index + 1}`} image`}
                value={item.imageUrl}
                onClear={() => setArrayItemField("gallery", "items", index, "imageUrl", "")}
                uploading={uploadingField === `gallery-image-${index}`}
                onUpload={(file) =>
                  uploadAsset(`gallery-image-${index}`, (url) => setArrayItemField("gallery", "items", index, "imageUrl", url), file)
                }
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard id="portfolio" title="Portfolio" description="Add custom posts or reels. If this stays empty, the site keeps using the current built-in portfolio feed.">
        <div className="grid gap-6 md:grid-cols-3">
          <Field label="Section Eyebrow" value={content.portfolio.eyebrow} onChange={(value) => setSectionField("portfolio", "eyebrow", value)} />
          <Field label="Heading Left" value={content.portfolio.title} onChange={(value) => setSectionField("portfolio", "title", value)} />
          <Field label="Heading Highlight" value={content.portfolio.highlight} onChange={(value) => setSectionField("portfolio", "highlight", value)} />
          <div className="md:col-span-3">
            <Field label="Section Description" value={content.portfolio.description} onChange={(value) => setSectionField("portfolio", "description", value)} multiline />
          </div>
        </div>

        <div className="flex justify-start">
          <button
            type="button"
            onClick={addPortfolioItem}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl border border-white/10 bg-white/5 text-sm text-gray-200 hover:text-white hover:border-wolf-red transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Portfolio Item
          </button>
        </div>

        {content.portfolio.items.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-white/10 bg-black/25 p-8 text-sm text-gray-400">
            No custom portfolio items yet. Add a post or reel if the owner wants to replace the current built-in portfolio feed.
          </div>
        ) : (
          <div className="space-y-4">
            {content.portfolio.items.map((item, itemIndex) => (
              <div key={itemIndex} className="rounded-[24px] border border-white/8 bg-black/30 p-5 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-heading font-bold uppercase tracking-[0.18em] text-white">
                    {item.label || `Portfolio Item ${itemIndex + 1}`}
                  </p>
                  <button
                    type="button"
                    onClick={() => removePortfolioItem(itemIndex)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 text-xs text-gray-400 hover:text-white hover:border-wolf-red transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove Item
                  </button>
                </div>

                <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
                  <Field
                    label="Item Label"
                    value={item.label}
                    onChange={(value) => setPortfolioItem(itemIndex, { label: value })}
                    placeholder="Example: Black Mustang Reel"
                    hint="This label is for the admin only."
                  />
                  <label className="block space-y-2">
                    <span className="text-[11px] font-heading uppercase tracking-[0.22em] text-gray-400">Type</span>
                    <select
                      value={item.type}
                      onChange={(event) =>
                        setPortfolioItem(itemIndex, {
                          type: event.target.value === "reel" ? "reel" : "post",
                          media: event.target.value === "reel" ? [item.media[0] ?? ""] : item.media.length ? item.media : [""],
                        })
                      }
                      className="w-full rounded-2xl bg-black/45 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-wolf-red transition-colors"
                    >
                      <option value="post">Post</option>
                      <option value="reel">Reel</option>
                    </select>
                  </label>
                </div>

                <Field
                  label="Open Link"
                  value={item.link}
                  onChange={(value) => setPortfolioItem(itemIndex, { link: value })}
                  placeholder="Instagram or external link"
                  hint="Optional. Use this if clicking the post should open Instagram or another page."
                />

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-heading font-bold uppercase tracking-[0.18em] text-white">Media</p>
                    {item.type === "post" ? (
                      <button
                        type="button"
                        onClick={() => addPortfolioMediaSlot(itemIndex)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 text-xs text-gray-300 hover:text-white hover:border-wolf-red transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Photo Slot
                      </button>
                    ) : null}
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    {item.media.map((mediaValue, mediaIndex) => (
                      <div key={mediaIndex} className="rounded-2xl border border-white/8 bg-black/35 p-4 space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-heading font-bold uppercase tracking-[0.18em] text-white">
                              {item.type === "reel" ? "Reel Video" : `Post Image ${mediaIndex + 1}`}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {item.type === "reel" ? "Upload the reel video file." : "Upload one photo for this post slot."}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removePortfolioMediaSlot(itemIndex, mediaIndex)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 text-xs text-gray-400 hover:text-white hover:border-wolf-red transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </button>
                        </div>

                        <div className="h-24 rounded-2xl bg-black/50 border border-white/10 overflow-hidden">
                          {mediaValue ? (
                            item.type === "reel" ? (
                              <video src={mediaValue} className="w-full h-full object-cover" muted playsInline />
                            ) : (
                              <img src={mediaValue} alt={`Portfolio ${itemIndex + 1}`} className="w-full h-full object-cover" />
                            )
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                              No file uploaded yet
                            </div>
                          )}
                        </div>

                        <label className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl border border-white/10 bg-white/5 text-sm text-gray-200 hover:text-white hover:border-wolf-red transition-colors cursor-pointer">
                          {uploadingField === `portfolio-${itemIndex}-${mediaIndex}` ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : item.type === "reel" ? (
                            <Film className="w-4 h-4" />
                          ) : (
                            <ImagePlus className="w-4 h-4" />
                          )}
                          {item.type === "reel" ? "Upload Video" : "Upload Image"}
                            <input
                              type="file"
                              accept={item.type === "reel" ? "video/*" : "image/*"}
                              className="hidden"
                              onChange={(event) => {
                                const file = event.target.files?.[0];
                                if (file) uploadAsset(`portfolio-${itemIndex}-${mediaIndex}`, (url) => setPortfolioMedia(itemIndex, mediaIndex, url), file);
                                event.target.value = "";
                              }}
                            />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard id="faq" title="FAQ" description="Frequently asked questions.">
        <div className="grid gap-6 md:grid-cols-3">
          <Field label="Section Eyebrow" value={content.faq.eyebrow} onChange={(value) => setSectionField("faq", "eyebrow", value)} />
          <Field label="Heading Left" value={content.faq.title} onChange={(value) => setSectionField("faq", "title", value)} />
          <Field label="Heading Highlight" value={content.faq.highlight} onChange={(value) => setSectionField("faq", "highlight", value)} />
        </div>

        <div className="space-y-4">
          {content.faq.items.map((item, index) => (
            <div key={index} className="rounded-[24px] border border-white/8 bg-black/30 p-5 space-y-4">
              <Field label={`Question ${index + 1}`} value={item.question} onChange={(value) => setArrayItemField("faq", "items", index, "question", value)} />
              <Field label={`Answer ${index + 1}`} value={item.answer} onChange={(value) => setArrayItemField("faq", "items", index, "answer", value)} multiline />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard id="cta" title="Call To Action" description="The big section above the contact form.">
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Eyebrow" value={content.cta.eyebrow} onChange={(value) => setSectionField("cta", "eyebrow", value)} />
          <Field label="Button Label" value={content.cta.buttonLabel} onChange={(value) => setSectionField("cta", "buttonLabel", value)} />
          <Field label="Heading Left" value={content.cta.title} onChange={(value) => setSectionField("cta", "title", value)} />
          <Field label="Heading Highlight" value={content.cta.highlight} onChange={(value) => setSectionField("cta", "highlight", value)} />
          <div className="md:col-span-2">
            <Field label="Description" value={content.cta.description} onChange={(value) => setSectionField("cta", "description", value)} multiline />
          </div>
        </div>
      </SectionCard>

      <SectionCard id="contact" title="Contact Details" description="Business contact info reused across the site. Use multi-line fields for address and hours.">
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Section Title" value={content.contact.title} onChange={(value) => setSectionField("contact", "title", value)} />
          <Field label="Section Highlight" value={content.contact.highlight} onChange={(value) => setSectionField("contact", "highlight", value)} />
          <div className="md:col-span-2">
            <Field label="Section Description" value={content.contact.description} onChange={(value) => setSectionField("contact", "description", value)} multiline />
          </div>
          <Field label="Quote Form Title" value={content.contact.quoteTitle} onChange={(value) => setSectionField("contact", "quoteTitle", value)} />
          <Field label="Phone Display" value={content.business.phoneDisplay} onChange={(value) => setSectionField("business", "phoneDisplay", value)} />
          <Field label="Phone Link" value={content.business.phoneHref} onChange={(value) => setSectionField("business", "phoneHref", value)} hint="Usually formatted like tel:0412345678" />
          <Field label="Email" value={content.business.email} onChange={(value) => setSectionField("business", "email", value)} />
          <div className="md:col-span-2">
            <Field label="Address" value={content.business.address} onChange={(value) => setSectionField("business", "address", value)} multiline />
          </div>
          <div className="md:col-span-2">
            <Field label="Opening Hours" value={content.business.hours} onChange={(value) => setSectionField("business", "hours", value)} multiline />
          </div>
          <div className="md:col-span-2">
            <Field
              label="Google Map Embed URL"
              value={content.business.mapEmbedUrl}
              onChange={(value) => setSectionField("business", "mapEmbedUrl", value)}
              multiline
              hint="Paste the Google Maps embed link, not the normal browser URL."
            />
          </div>
          <div className="md:col-span-2">
            <Field label="Footer Description" value={content.business.footerBlurb} onChange={(value) => setSectionField("business", "footerBlurb", value)} multiline />
          </div>
          <Field label="Instagram URL" value={content.business.instagramUrl} onChange={(value) => setSectionField("business", "instagramUrl", value)} />
          <Field label="Facebook URL" value={content.business.facebookUrl} onChange={(value) => setSectionField("business", "facebookUrl", value)} />
        </div>
      </SectionCard>
      </div>
    </div>
  );
}
