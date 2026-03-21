import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { defaultSiteContent, mergeSiteContent, SiteContent } from "../siteContent";

interface SiteContentContextValue {
  content: SiteContent;
  loading: boolean;
}

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "siteContent", "homepage"),
      (snapshot) => {
        setContent(mergeSiteContent(snapshot.exists() ? (snapshot.data() as Partial<SiteContent>) : undefined));
        setLoading(false);
      },
      (error) => {
        console.error("Failed to load site content:", error);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      content,
      loading,
    }),
    [content, loading],
  );

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);

  if (!context) {
    throw new Error("useSiteContent must be used within SiteContentProvider");
  }

  return context;
}
