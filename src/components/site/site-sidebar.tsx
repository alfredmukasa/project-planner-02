'use client';

import { BookOpen, Bot, ChevronLeft, ChevronRight, Download, Layers3, LayoutDashboard, LifeBuoy, LogIn, Menu, Network, Tag, UserPlus, Workflow, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, type ComponentType } from 'react';

import { primaryNav, sidebarGroups, type NavIcon, type NavItem } from '@/content/site';

import { useSidebar } from './sidebar-context';

const ICONS: Record<NavIcon, ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean }>> = {
  overview: LayoutDashboard,
  features: Layers3,
  pricing: Tag,
  download: Download,
  'how-it-works': Workflow,
  architecture: Network,
  agents: Bot,
  docs: BookOpen,
  support: LifeBuoy,
};

const isActive = (pathname: string, href: string): boolean => {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href.replace(/\/$/, ''));
};

function SidebarLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const pathname = usePathname() ?? '/';
  const active = isActive(pathname, item.href);
  const Icon = ICONS[item.icon];
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      title={item.label}
      className={`sidebar-item flex h-9 items-center gap-3 rounded-md px-2 text-sm font-medium transition-colors ${
        active ? 'bg-surface-2 text-text' : 'text-text-muted hover:bg-surface-2 hover:text-text'
      }`}
    >
      <Icon size={16} aria-hidden className="shrink-0" />
      <span className="sidebar-label">{item.label}</span>
    </Link>
  );
}

export function SidebarMenuButton() {
  const { mobileOpen, toggleMobile } = useSidebar();
  return (
    <button
      type="button"
      aria-expanded={mobileOpen}
      aria-controls="site-sidebar"
      aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
      onClick={toggleMobile}
      data-testid="mobile-menu-button"
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-text-muted hover:text-text lg:hidden"
    >
      {mobileOpen ? <X size={16} aria-hidden /> : <Menu size={16} aria-hidden />}
    </button>
  );
}

export function SiteSidebar() {
  const { mobileOpen, closeMobile, toggleMode } = useSidebar();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobile();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closeMobile]);

  return (
    <>
      {mobileOpen && <button type="button" aria-label="Close menu overlay" className="fixed inset-0 top-14 z-[70] bg-bg/70 lg:hidden" onClick={closeMobile} />}
      <div className="site-sidebar-slot relative shrink-0">
      <aside
        id="site-sidebar"
        role={mobileOpen ? 'dialog' : 'navigation'}
        aria-label={mobileOpen ? 'Site menu' : 'Secondary'}
        data-testid="site-sidebar"
        className="site-sidebar sticky top-14 z-[80] flex h-[calc(100vh-3.5rem)] flex-col border-r border-border bg-bg-subtle"
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden px-2 py-3">
          <nav aria-label="More" className="space-y-5">
            <div className="lg:hidden sidebar-group">
              <p className="sidebar-heading mb-1.5 px-2 text-2xs font-semibold uppercase tracking-wide text-text-faint">Menu</p>
              <ul className="space-y-0.5">
                {primaryNav.map((item) => (
                  <li key={item.href}>
                    <SidebarLink item={item} onNavigate={closeMobile} />
                  </li>
                ))}
              </ul>
            </div>
            {sidebarGroups.map((group) => (
              <div key={group.title} className="sidebar-group">
                <p className="sidebar-heading mb-1.5 px-2 text-2xs font-semibold uppercase tracking-wide text-text-faint">{group.title}</p>
                <ul className="space-y-0.5">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <SidebarLink item={item} onNavigate={closeMobile} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="border-t border-border p-2 space-y-1">
          <div className="lg:hidden space-y-1">
            <Link
              href="/login/"
              onClick={closeMobile}
              title="Login"
              className="sidebar-item flex h-9 items-center gap-3 rounded-md px-2 text-sm font-medium text-text-muted hover:bg-surface-2 hover:text-text"
            >
              <LogIn size={16} aria-hidden className="shrink-0" />
              <span className="sidebar-label">Login</span>
            </Link>
            <Link
              href="/register/"
              onClick={closeMobile}
              title="Create Account"
              className="sidebar-item flex h-9 items-center gap-3 rounded-md bg-accent px-2 text-sm font-medium text-on-accent hover:bg-accent-strong"
            >
              <UserPlus size={16} aria-hidden className="shrink-0" />
              <span className="sidebar-label">Create Account</span>
            </Link>
          </div>
          <button
            type="button"
            onClick={toggleMode}
            data-testid="sidebar-toggle"
            className="sidebar-item hidden h-9 w-full items-center gap-3 rounded-md px-2 text-sm font-medium text-text-muted hover:bg-surface-2 hover:text-text lg:flex"
            aria-label="Collapse or expand sidebar"
            title="Collapse or expand sidebar"
          >
            <ChevronLeft size={16} aria-hidden className="sidebar-expanded-icon shrink-0" />
            <ChevronRight size={16} aria-hidden className="sidebar-collapsed-icon shrink-0" />
            <span className="sidebar-label">Collapse</span>
          </button>
        </div>
      </aside>
      </div>
    </>
  );
}
