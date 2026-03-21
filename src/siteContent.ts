export interface TopBannerContent {
  text: string;
  phoneDisplay: string;
  phoneHref: string;
}

export interface HeroContent {
  eyebrow: string;
  description: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  rotatingBadgeText: string;
}

export interface ServiceFeature {
  title: string;
  desc: string;
  iconKey: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  iconKey: string;
  imageKey: string;
  imageUrl?: string;
}

export interface ServicesContent {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  features: ServiceFeature[];
  items: ServiceItem[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQContent {
  eyebrow: string;
  title: string;
  highlight: string;
  items: FAQItem[];
}

export interface CTAContent {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  buttonLabel: string;
}

export interface GalleryItem {
  title: string;
  subtitle: string;
  imageUrl?: string;
}

export interface GalleryContent {
  eyebrow: string;
  title: string;
  highlight: string;
  items: GalleryItem[];
  ctaTitle: string;
  ctaHighlight: string;
  ctaButtonLabel: string;
}

export interface BeforeAfterContent {
  title: string;
  highlight: string;
  description: string;
  beforeLabel: string;
  afterLabel: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
}

export interface PortfolioItem {
  label: string;
  type: "post" | "reel";
  media: string[];
  link: string;
}

export interface PortfolioContent {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  items: PortfolioItem[];
}

export interface ContactSectionContent {
  title: string;
  highlight: string;
  description: string;
  quoteTitle: string;
}

export interface BusinessContent {
  address: string;
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  hours: string;
  mapEmbedUrl: string;
  footerBlurb: string;
  instagramUrl: string;
  facebookUrl: string;
}

export interface SiteContent {
  topBanner: TopBannerContent;
  hero: HeroContent;
  services: ServicesContent;
  beforeAfter: BeforeAfterContent;
  gallery: GalleryContent;
  portfolio: PortfolioContent;
  faq: FAQContent;
  cta: CTAContent;
  contact: ContactSectionContent;
  business: BusinessContent;
}

export const defaultSiteContent: SiteContent = {
  topBanner: {
    text: "Emergency accident? We handle your insurance paperwork. Call 24/7:",
    phoneDisplay: "(08) 8123 4567",
    phoneHref: "tel:0881234567",
  },
  hero: {
    eyebrow: "Adelaide's Premier Auto Studio",
    description:
      "Professional vehicle restorations, custom paintwork and panel repairs. We bring automotive legends back to life.",
    primaryCtaLabel: "Request Quote",
    secondaryCtaLabel: "View Work",
    rotatingBadgeText: "Premium Auto Restoration | Adelaide SA",
  },
  services: {
    eyebrow: "What We Do",
    title: "Our",
    highlight: "Expertise",
    description:
      "We deliver uncompromising quality across all our automotive restoration and paint services. Every project is treated as a masterpiece.",
    features: [
      { title: "Insurance Work", desc: "All Providers Accepted", iconKey: "shield-check" },
      { title: "Dealership Approved", desc: "Fleet & Trade Standards", iconKey: "award" },
      { title: "Quality Guarantee", desc: "Lifetime Workmanship", iconKey: "check-circle" },
      { title: "Locally Owned", desc: "Salisbury South, SA", iconKey: "map-pin" },
    ],
    items: [
      {
        title: "Paint & Panel Repairs",
        description:
          "Expert collision repair and dent removal to restore your vehicle to factory condition. We use advanced techniques to ensure a seamless finish.",
        iconKey: "wrench",
        imageKey: "paint-panel-repairs",
        imageUrl: "",
      },
      {
        title: "Vehicle Restorations",
        description:
          "Full nut-and-bolt restorations for classic and muscle cars. Bringing legends back to life with uncompromising attention to detail.",
        iconKey: "car",
        imageKey: "vehicle-restorations",
        imageUrl: "",
      },
      {
        title: "Full Car Resprays",
        description:
          "Complete color changes or factory-matched resprays using premium automotive paints in our climate-controlled spray booths.",
        iconKey: "paintbrush",
        imageKey: "full-car-resprays",
        imageUrl: "",
      },
      {
        title: "Rust Repairs",
        description:
          "Professional rust cutting, custom metal fabrication, and anti-corrosion treatment to protect your investment for decades.",
        iconKey: "shield-alert",
        imageKey: "rust-repairs",
        imageUrl: "",
      },
      {
        title: "Custom Paint Jobs",
        description:
          "Show-quality custom finishes, pearls, candies, flakes, and bespoke designs tailored to your exact vision.",
        iconKey: "palette",
        imageKey: "custom-paint-jobs",
        imageUrl: "",
      },
      {
        title: "Spray Painting",
        description:
          "High-end spray painting services for parts, panels, motorcycles, and accessories with perfect color matching.",
        iconKey: "spray-can",
        imageKey: "spray-painting",
        imageUrl: "",
      },
    ],
  },
  beforeAfter: {
    title: "The",
    highlight: "Transformation",
    description: "Slide to see the difference. From rusted shells to show-quality finishes.",
    beforeLabel: "Before",
    afterLabel: "After",
    beforeImageUrl: "",
    afterImageUrl: "",
  },
  gallery: {
    eyebrow: "Capabilities",
    title: "Signature",
    highlight: "Services",
    items: [
      { title: "Custom Paint", subtitle: "Porsche 911", imageUrl: "" },
      { title: "Full Respray", subtitle: "Nissan Skyline R34", imageUrl: "" },
      { title: "Panel Repair", subtitle: "BMW M3", imageUrl: "" },
      { title: "Classic Restoration", subtitle: "Ford Mustang 1968", imageUrl: "" },
      { title: "Rust Treatment", subtitle: "Toyota LandCruiser", imageUrl: "" },
    ],
    ctaTitle: "Start Your",
    ctaHighlight: "Project",
    ctaButtonLabel: "Get a Quote",
  },
  portfolio: {
    eyebrow: "Portfolio",
    title: "Latest",
    highlight: "Work",
    description:
      "Take a closer look at our recent projects. From flawless custom paint jobs to complete vehicle restorations, our attention to detail shines through in every showcase.",
    items: [],
  },
  faq: {
    eyebrow: "Your Questions Answered",
    title: "Frequently Asked",
    highlight: "Questions",
    items: [
      {
        question: "Do you work with my insurance company?",
        answer:
          "Yes, we work with all major insurance providers. We can handle the paperwork and communicate directly with your insurer to ensure a smooth repair process.",
      },
      {
        question: "How long will my vehicle repair take?",
        answer:
          "Repair times vary depending on the extent of the damage and parts availability. A standard bumper respray might take 2-3 days, while a full restoration can take several months. We'll provide an estimated timeline with your quote.",
      },
      {
        question: "Is there a warranty on your paintwork?",
        answer:
          "Absolutely. We stand behind our craftsmanship and offer a comprehensive warranty on all our paint and panel work against peeling, flaking, and fading.",
      },
      {
        question: "Can you perfectly match my car's current colour?",
        answer:
          "Yes. We use advanced computerized colour-matching technology and premium automotive paints to ensure a seamless match with your vehicle's existing finish.",
      },
      {
        question: "Do I need an appointment for a quote?",
        answer:
          "While walk-ins are welcome, we highly recommend booking an appointment so we can dedicate the proper time to thoroughly inspect your vehicle and discuss your needs.",
      },
    ],
  },
  cta: {
    eyebrow: "Start Your Journey",
    title: "Bring Your Car",
    highlight: "Back To Life",
    description:
      "Ready to start your restoration project or need a flawless respray? Contact our Adelaide workshop today for a consultation.",
    buttonLabel: "Get a Free Quote",
  },
  contact: {
    title: "Get In",
    highlight: "Touch",
    description: "Visit our Adelaide workshop or send us a message to discuss your next automotive project.",
    quoteTitle: "Request a Quote",
  },
  business: {
    address: "77A Rundle Road\nSalisbury South SA 5106",
    phoneDisplay: "0412 345 678",
    phoneHref: "tel:0412345678",
    email: "hello@wolfcustoms.com.au",
    hours: "Mon - Fri: 8:00 AM - 5:00 PM\nSaturday & Sunday: Closed",
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Wolf+Customs,77A+Rundle+Rd,+Salisbury+South+SA+5106&t=&z=15&ie=UTF8&iwloc=&output=embed",
    footerBlurb:
      "Adelaide's premier automotive restoration and custom paint studio. We specialize in bringing legends back to life with uncompromising quality and precision.",
    instagramUrl: "https://www.instagram.com/wolfcustoms_adelaide/",
    facebookUrl:
      "https://web.facebook.com/wolfcustomsadelaide?rdid=KcDxg51u4492qlPe&share_url=https%3A%2F%2Fweb.facebook.com%2Fshare%2F19LsBACZEz%2F%3Futm_source%3Dig%26utm_medium%3Dsocial%26utm_content%3Dlink_in_bio%26_rdc%3D1%26_rdr",
  },
};

const mergeArray = <T>(incoming: unknown, fallback: T[]): T[] => {
  if (!Array.isArray(incoming)) {
    return fallback;
  }

  return fallback.map((item, index) => ({
    ...(item as object),
    ...(((incoming[index] as object | undefined) ?? {})),
  })) as T[];
};

export function mergeSiteContent(incoming?: Partial<SiteContent> | null): SiteContent {
  return {
    topBanner: {
      ...defaultSiteContent.topBanner,
      ...(incoming?.topBanner ?? {}),
    },
    hero: {
      ...defaultSiteContent.hero,
      ...(incoming?.hero ?? {}),
    },
    services: {
      ...defaultSiteContent.services,
      ...(incoming?.services ?? {}),
      features: mergeArray(incoming?.services?.features, defaultSiteContent.services.features),
      items: mergeArray(incoming?.services?.items, defaultSiteContent.services.items),
    },
    beforeAfter: {
      ...defaultSiteContent.beforeAfter,
      ...(incoming?.beforeAfter ?? {}),
    },
    gallery: {
      ...defaultSiteContent.gallery,
      ...(incoming?.gallery ?? {}),
      items: mergeArray(incoming?.gallery?.items, defaultSiteContent.gallery.items),
    },
    portfolio: {
      ...defaultSiteContent.portfolio,
      ...(incoming?.portfolio ?? {}),
      items: Array.isArray(incoming?.portfolio?.items)
        ? incoming!.portfolio!.items.map((item) => ({
            label: item.label ?? "",
            type: item.type === "reel" ? "reel" : "post",
            media: Array.isArray(item.media) ? item.media.filter((mediaUrl): mediaUrl is string => typeof mediaUrl === "string") : [],
            link: item.link ?? "",
          }))
        : defaultSiteContent.portfolio.items,
    },
    faq: {
      ...defaultSiteContent.faq,
      ...(incoming?.faq ?? {}),
      items: mergeArray(incoming?.faq?.items, defaultSiteContent.faq.items),
    },
    cta: {
      ...defaultSiteContent.cta,
      ...(incoming?.cta ?? {}),
    },
    contact: {
      ...defaultSiteContent.contact,
      ...(incoming?.contact ?? {}),
    },
    business: {
      ...defaultSiteContent.business,
      ...(incoming?.business ?? {}),
    },
  };
}
