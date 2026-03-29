'use client';

import React from 'react';
import { type Show, type NavItem } from '@/types';
import Link from 'next/link';
import {
  cn,
  getSearchValue,
  handleDefaultSearchBtn,
  handleDefaultSearchInp,
} from '@/lib/utils';
import { siteConfig } from '@/configs/site';
import { Icons } from '@/components/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { useSearchStore } from '@/stores/search';
import { ModeToggle as ThemeToggle } from '@/components/theme-toggle';
import { DebouncedInput } from '@/components/debounced-input';
import MovieService from '@/services/MovieService';
import { AnimeNavBar } from '@/components/ui/anime-navbar';

interface MainNavProps {
  items?: NavItem[];
  children?: React.ReactNode;
}

interface SearchResult {
  results: Show[];
  variant?: 'default' | 'light' | 'dark' | 'transparent';
  textColor?: 'light' | 'dark';
  hideOnScroll?: boolean;
}

export function MainNav({ items, children }: MainNavProps) {
  const path = usePathname();
  const router = useRouter();
  const searchStore = useSearchStore();
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener('popstate', handlePopstateEvent, false);
    return () => {
      window.removeEventListener('popstate', handlePopstateEvent, false);
    };
  }, []);

  const handlePopstateEvent = () => {
    const pathname = window.location.pathname;
    const search: string = getSearchValue('q');

    if (!search?.length || !pathname.includes('/search')) {
      searchStore.reset();
      searchStore.setOpen(false);
    } else if (search?.length) {
      searchStore.setOpen(true);
      searchStore.setLoading(true);
      searchStore.setQuery(search);
      setTimeout(() => {
        handleDefaultSearchBtn();
      }, 10);
      setTimeout(() => {
        handleDefaultSearchInp();
      }, 20);
      MovieService.searchMovies(search)
        .then((response: SearchResult) => {
          void searchStore.setShows(response.results);
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => searchStore.setLoading(false));
    }
  };

  async function searchShowsByQuery(value: string) {
    if (!value?.trim()?.length) {
      if (path === '/search') {
        router.push('/home');
      } else {
        window.history.pushState(null, '', path);
      }
      return;
    }

    if (getSearchValue('q')?.trim()?.length) {
      window.history.replaceState(null, '', `search?q=${value}`);
    } else {
      window.history.pushState(null, '', `search?q=${value}`);
    }

    searchStore.setQuery(value);
    searchStore.setLoading(true);
    const shows = await MovieService.searchMovies(value);
    searchStore.setLoading(false);
    void searchStore.setShows(shows.results);

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  React.useEffect(() => {
    const changeBgColor = () => {
      window.scrollY > 0 ? setIsScrolled(true) : setIsScrolled(false);
    };
    window.addEventListener('scroll', changeBgColor);
    return () => window.removeEventListener('scroll', changeBgColor);
  }, [isScrolled]);

  const handleChangeStatusOpen = (value: boolean): void => {
    searchStore.setOpen(value);
    if (!value) searchStore.reset();
  };

  return (
    <>
      <AnimeNavBar
        items={items?.map((item) => ({
          name: item.title,
          icon: (Icons as any)[item.icon || 'logo'],
          url: item.href || '#',
        })) || []}
        defaultActive="Home"
        leftNode={
          <Link
            href="/"
            className="flex items-center space-x-2 transition-transform hover:scale-105"
            onClick={() => handleChangeStatusOpen(false)}>
            <Icons.logo className="h-7 w-7 text-primary drop-shadow-md" aria-hidden="true" />
            <span className="hidden lg:inline-block font-black text-xl tracking-tight text-white drop-shadow-md">{siteConfig.name}</span>
          </Link>
        }
        mobileMenuNode={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-2 px-0 hover:bg-transparent focus:ring-0">
                <Icons.logo className="h-7 w-7 text-primary drop-shadow-md" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              sideOffset={22}
              className="w-52 overflow-y-auto overflow-x-hidden rounded-xl border border-border/50 bg-background/95 backdrop-blur-md shadow-2xl">
              <DropdownMenuLabel>
                <Link
                  href="/"
                  className="flex items-center justify-center font-black tracking-tight"
                  onClick={() => handleChangeStatusOpen(false)}>
                  <span>{siteConfig.name}</span>
                </Link>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {items?.map((item, index) => (
                <DropdownMenuItem
                  key={index}
                  asChild
                  className="items-center justify-center cursor-pointer">
                  {item.href && (
                    <Link
                      href={item.href}
                      onClick={() => handleChangeStatusOpen(false)}>
                      <span
                        className={cn(
                          'line-clamp-1 text-sm font-medium transition-colors hover:text-primary',
                          path === item.href ? 'text-primary font-bold' : 'text-foreground/70',
                        )}>
                        {item.title}
                      </span>
                    </Link>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        }
        rightNode={
          <div className="relative z-10 flex items-center gap-2 sm:gap-4">
            <DebouncedInput
              id="search-input"
              open={searchStore.isOpen}
              value={searchStore.query}
              onChange={searchShowsByQuery}
              onChangeStatusOpen={handleChangeStatusOpen}
              containerClassName={cn(path === '/' ? 'hidden' : 'flex')}
            />
            <div className="hover:scale-110 transition-transform">
              <ThemeToggle />
            </div>
            <div className="flex items-center pl-1 sm:pl-2 border-l border-white/10 ml-1 sm:ml-2">
              {children}
            </div>
          </div>
        }
      />
    </>
  );
}

export default MainNav;