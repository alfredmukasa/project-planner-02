'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

type SidebarMode = 'expanded' | 'collapsed';

const readMode = (): SidebarMode =>
  typeof document !== 'undefined' && document.documentElement.getAttribute('data-sidebar') === 'collapsed' ? 'collapsed' : 'expanded';

const writeMode = (mode: SidebarMode) => {
  document.documentElement.setAttribute('data-sidebar', mode);
  try {
    localStorage.setItem('pp-sidebar', mode);
  } catch {
    // Persistence is best-effort.
  }
};

interface SidebarContextValue {
  mobileOpen: boolean;
  openMobile: () => void;
  closeMobile: () => void;
  toggleMobile: () => void;
  toggleMode: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const openMobile = useCallback(() => {
    setMobileOpen(true);
    document.documentElement.setAttribute('data-sidebar-mobile', 'open');
    document.body.style.overflow = 'hidden';
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    document.documentElement.setAttribute('data-sidebar-mobile', 'closed');
    document.body.style.overflow = '';
  }, []);

  const toggleMobile = useCallback(() => {
    setMobileOpen((open) => {
      const next = !open;
      document.documentElement.setAttribute('data-sidebar-mobile', next ? 'open' : 'closed');
      document.body.style.overflow = next ? 'hidden' : '';
      return next;
    });
  }, []);

  const toggleMode = useCallback(() => {
    writeMode(readMode() === 'collapsed' ? 'expanded' : 'collapsed');
  }, []);

  const value = useMemo(
    () => ({ mobileOpen, openMobile, closeMobile, toggleMobile, toggleMode }),
    [mobileOpen, openMobile, closeMobile, toggleMobile, toggleMode],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return ctx;
}
