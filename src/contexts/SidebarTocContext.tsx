import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { extractHeadings } from '../lib/utils';

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

type SetTocItems = (items: TocItem[] | ((prev: TocItem[]) => TocItem[])) => void;

const SidebarTocContext = createContext<[TocItem[], SetTocItems] | null>(null);

export function SidebarTocProvider({ children }: { children: ReactNode }) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const location = useLocation();

  // Clear TOC when route changes so the next page can set its own
  useEffect(() => {
    setTocItems([]);
  }, [location.pathname]);

  return (
    <SidebarTocContext.Provider value={[tocItems, setTocItems]}>
      {children}
    </SidebarTocContext.Provider>
  );
}

export function useSidebarToc(): [TocItem[], SetTocItems] {
  const ctx = useContext(SidebarTocContext);
  if (!ctx) return [[], () => {}];
  return ctx;
}

/** Call from a page with HTML content to register headings for "On this page" sidebar */
export function useSetSidebarTocFromContent(htmlContent: string | null) {
  const [, setTocItems] = useSidebarToc();

  useEffect(() => {
    if (!htmlContent) return;
    const headings = extractHeadings(htmlContent);
    setTocItems(headings);
    return () => setTocItems([]);
  }, [htmlContent, setTocItems]);
}
