'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useAuthModal } from '@/stores/auth-modal';

interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
  iconOnly?: boolean;
  requiresAuth?: boolean;
}

interface NavBarProps {
  items: NavItem[];
  className?: string;
  defaultActive?: string;
  leftNode?: React.ReactNode;
  rightNode?: React.ReactNode;
  mobileMenuNode?: React.ReactNode;
}

function NavTab({
  item,
  isActive,
  isHovered,
  isMobile,
  isScrolled,
  hoveredTab,
  onActivate,
  onHoverEnter,
  onHoverLeave,
}: {
  item: NavItem;
  isActive: boolean;
  isHovered: boolean;
  isMobile: boolean;
  isScrolled: boolean;
  hoveredTab: string | null;
  onActivate: () => void;
  onHoverEnter: () => void;
  onHoverLeave: () => void;
}) {
  const { data: session } = useSession();
  const authModal = useAuthModal();
  const Icon = item.icon;
  // Show floating tooltip for iconOnly tabs, or ALL tabs when in compact/scrolled mode
  const showTooltip = isScrolled && isHovered && !isActive;

  const handleClick = (e: React.MouseEvent) => {
    if (item.requiresAuth && !session) {
      e.preventDefault();
      authModal.onOpen();
      return;
    }
    onActivate();
  };

  return (
    <Link
      href={item.url}
      onClick={handleClick}
      onMouseEnter={onHoverEnter}
      onMouseLeave={onHoverLeave}
      className={cn(
        'relative flex-shrink-0 cursor-pointer rounded-full text-sm font-semibold transition-colors duration-200',
        'text-muted-foreground hover:text-foreground',
        isScrolled ? 'px-2.5 py-2' : 'px-3 py-2 lg:px-4',
        isActive && 'text-foreground drop-shadow-sm',
      )}>
      {/* Active glow background */}
      {isActive && (
        <motion.div
          className="absolute inset-0 -z-10 overflow-hidden rounded-full"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.03, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}>
          <div className="absolute inset-0 rounded-full bg-primary/25 blur-md" />
          <div className="absolute inset-[-4px] rounded-full bg-primary/20 blur-xl" />
          <div className="absolute inset-[-8px] rounded-full bg-primary/15 blur-2xl" />
          <div className="absolute inset-[-12px] rounded-full bg-primary/5 blur-3xl" />
          <div
            className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0"
            style={{ animation: 'shine 3s ease-in-out infinite' }}
          />
        </motion.div>
      )}

      {/* Icon + label */}
      <div className="flex items-center gap-1.5">
        <motion.span
          className="relative z-10 flex items-center justify-center"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}>
          <Icon size={18} strokeWidth={2.5} />
        </motion.span>

        {/* Text label: hidden in compact/scrolled mode, visible at lg+ when wide */}
        <AnimatePresence>
          {!isScrolled && (
            <motion.span
              key="label"
              className="relative z-10 hidden whitespace-nowrap lg:inline"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}>
              {item.name}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Hover highlight */}
      <AnimatePresence>
        {isHovered && !isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 -z-10 rounded-full bg-foreground/10"
          />
        )}
      </AnimatePresence>

      {/* Floating label tooltip — shows for iconOnly tabs AND all tabs in compact mode */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            key="icon-tooltip"
            initial={{ opacity: 0, y: 4, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.85 }}
            transition={{ duration: 0.13, ease: 'easeOut' }}
            className="pointer-events-none absolute -bottom-[1.65rem] left-1/2 z-50 -translate-x-1/2">
            <span className="whitespace-nowrap rounded-full border border-border/40 bg-secondary/95 px-2 py-[2px] text-[10px] font-semibold tracking-wide text-foreground/80 shadow-sm backdrop-blur-sm">
              {item.name}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Neko cat — only on active tab, desktop only */}
      {isActive && !isMobile && (
        <motion.div
          layoutId="anime-neko"
          className="pointer-events-none absolute -bottom-8 left-1/2 hidden -translate-x-1/2 md:block"
          initial={false}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}>
          <div className="relative flex h-8 w-10 items-end justify-center overflow-hidden">
            <motion.div
              className="relative h-6 w-8 rounded-t-lg bg-foreground"
              animate={
                hoveredTab
                  ? {
                      y: [0, -2, 0],
                      transition: { duration: 0.5, ease: 'easeInOut' },
                    }
                  : {
                      y: [0, -1, 0],
                      transition: {
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      },
                    }
              }>
              {/* Ears */}
              <div className="absolute -top-2 left-0 h-0 w-0 -rotate-12 border-b-[8px] border-l-[6px] border-r-[6px] border-b-foreground border-l-transparent border-r-transparent" />
              <div className="absolute -top-2 right-0 h-0 w-0 rotate-12 border-b-[8px] border-l-[6px] border-r-[6px] border-b-foreground border-l-transparent border-r-transparent" />
              {/* Inner ears */}
              <div className="absolute -top-1 left-[2px] z-10 h-0 w-0 -rotate-12 border-b-[4px] border-l-[3px] border-r-[3px] border-b-pink-300 border-l-transparent border-r-transparent" />
              <div className="absolute -top-1 right-[2px] z-10 h-0 w-0 rotate-12 border-b-[4px] border-l-[3px] border-r-[3px] border-b-pink-300 border-l-transparent border-r-transparent" />
              {/* Eyes */}
              <motion.div
                className="absolute left-1.5 top-2 h-1.5 w-1.5 rounded-full bg-background"
                animate={
                  hoveredTab
                    ? {
                        scaleY: [1, 0.1, 1],
                        transition: { duration: 0.15, times: [0, 0.5, 1] },
                      }
                    : {}
                }
              />
              <motion.div
                className="absolute right-1.5 top-2 h-1.5 w-1.5 rounded-full bg-background"
                animate={
                  hoveredTab
                    ? {
                        scaleY: [1, 0.1, 1],
                        transition: { duration: 0.15, times: [0, 0.5, 1] },
                      }
                    : {}
                }
              />
              {/* Blushes */}
              <div className="absolute left-0.5 top-3 h-1 w-1.5 rounded-full bg-pink-300 opacity-60" />
              <div className="absolute right-0.5 top-3 h-1 w-1.5 rounded-full bg-pink-300 opacity-60" />
              {/* Mouth */}
              <svg
                className="absolute left-1/2 top-2.5 h-1.5 w-3 -translate-x-1/2 text-background"
                viewBox="0 0 10 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M1,2 Q2.5,5 5,2 Q7.5,5 9,2" />
              </svg>
              {/* Paws */}
              <div className="absolute -top-1 left-1.5 h-1.5 w-2 rounded-t-full bg-foreground shadow-sm" />
              <div className="absolute -top-1 right-1.5 h-1.5 w-2 rounded-t-full bg-foreground shadow-sm" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </Link>
  );
}

export function AnimeNavBar({
  items,
  className,
  defaultActive = 'Home',
  leftNode,
  rightNode,
  mobileMenuNode,
}: NavBarProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>(defaultActive);
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Active tab sync with pathname
  useEffect(() => {
    setMounted(true);
    const currentItem = items.find((item) => {
      if (item.url === '/') return pathname === '/';
      return pathname.startsWith(item.url);
    });
    setActiveTab(currentItem ? currentItem.name : '');
  }, [pathname, items]);

  // Mobile detection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll detection — check immediately on mount to handle page-refresh-mid-scroll
  useEffect(() => {
    setIsScrolled(window.scrollY > 50);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) return null;

  const leftItems = items.filter((i) => !i.iconOnly);
  const rightItems = items.filter((i) => i.iconOnly);

  return (
    /*
     * Outer wrapper: handles the top-offset transition.
     * — unscrolled: flush to the very top (top-0), full-width bar feel
     * — scrolled:   floats with top-4 gap, compact pill
     */
    <div
      className={cn(
        'pointer-events-none fixed left-0 right-0 z-[9999]',
        'transition-[top] duration-500 ease-out',
        isScrolled ? 'top-4' : 'top-0',
        className,
      )}>
      {/*
       * Centering wrapper: padding controls how wide the pill feels.
       * — unscrolled: minimal px-2 so the bar stretches edge-to-edge
       * — scrolled:   px-4 sm:px-6 centres the compact pill
       */}
      <div
        className={cn(
          'flex justify-center',
          'transition-[padding] duration-500 ease-out',
          isScrolled ? 'px-4 sm:px-6' : 'px-2',
        )}>
        {/*
         * The pill itself.
         * Framer Motion handles the one-shot mount slide-in (y: -60 → 0).
         * CSS transition-all handles the ongoing scroll-driven shape morph:
         *   max-width, border-radius, padding, background, blur, border
         */}
        <motion.div
          className={cn(
            'pointer-events-auto relative flex w-full items-center justify-between',
            'border shadow-xl',
            'transition-all duration-500 ease-out',
            isScrolled
              ? // Compact pill — scrolled state
                'max-w-[840px] rounded-full border-border bg-secondary/90 px-4 py-2 backdrop-blur-md'
              : // Wide bar — at-top state
                'max-w-[1500px] rounded-2xl border-border/25 bg-secondary/50 px-5 py-3 backdrop-blur-sm',
          )}
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
          {/* ── LEFT GROUP: logo + primary navigation tabs ── */}
          <div className="flex min-w-0 items-center gap-0.5 sm:gap-1">
            {/* Mobile: hamburger / logo dropdown */}
            {mobileMenuNode && (
              <div className="flex flex-shrink-0 items-center md:hidden">
                {mobileMenuNode}
              </div>
            )}

            {/* Desktop: logo */}
            {leftNode && (
              <div className="mr-1 hidden flex-shrink-0 items-center sm:mr-2 md:flex">
                {leftNode}
              </div>
            )}

            {/* Thin divider between logo and nav tabs */}
            {leftNode && leftItems.length > 0 && (
              <div className="mr-1 hidden h-5 w-px bg-border/50 sm:mr-2 md:block" />
            )}

            {/* Primary nav tabs (Home, TV Shows, Movies, Anime) */}
            <div className="hidden items-center gap-0.5 md:flex">
              {leftItems.map((item) => (
                <NavTab
                  key={item.name}
                  item={item}
                  isActive={activeTab === item.name}
                  isHovered={hoveredTab === item.name}
                  isMobile={isMobile}
                  isScrolled={isScrolled}
                  hoveredTab={hoveredTab}
                  onActivate={() => setActiveTab(item.name)}
                  onHoverEnter={() => setHoveredTab(item.name)}
                  onHoverLeave={() => setHoveredTab(null)}
                />
              ))}
            </div>
          </div>

          {/* ── RIGHT GROUP: utility icon tabs + controls ── */}
          <div className="flex flex-shrink-0 items-center gap-0.5 sm:gap-1">
            {/* Utility icon tabs (Bookmarks, History) */}
            {rightItems.length > 0 && (
              <>
                <div className="hidden items-center gap-0.5 md:flex">
                  {rightItems.map((item) => (
                    <NavTab
                      key={item.name}
                      item={item}
                      isActive={activeTab === item.name}
                      isHovered={hoveredTab === item.name}
                      isMobile={isMobile}
                      isScrolled={isScrolled}
                      hoveredTab={hoveredTab}
                      onActivate={() => setActiveTab(item.name)}
                      onHoverEnter={() => setHoveredTab(item.name)}
                      onHoverLeave={() => setHoveredTab(null)}
                    />
                  ))}
                </div>
                {/* Thin divider before action controls */}
                <div className="mx-1 hidden h-5 w-px bg-border/50 sm:mx-1.5 md:block" />
              </>
            )}

            {/* rightNode: Watch Party + Search + Theme toggle + Profile avatar */}
            {rightNode && (
              <div className="flex flex-shrink-0 items-center">{rightNode}</div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
