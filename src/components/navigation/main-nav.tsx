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
import { Popcorn } from 'lucide-react';

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

import { useSession } from 'next-auth/react';
import { useAuthModal } from '@/stores/auth-modal';

export function MainNav({ items, children }: MainNavProps) {
  const { data: session } = useSession();
  const authModal = useAuthModal();
  const path = usePathname();
  const router = useRouter();
  const searchStore = useSearchStore();
  const [isScrolled, setIsScrolled] = React.useState(false);

  // Track the previous path so we only clear search on genuine route changes,
  // never on the initial mount (which would immediately kill inline search results).
  const prevPathRef = React.useRef<string>(path);

  React.useEffect(() => {
    const previousPath = prevPathRef.current;
    prevPathRef.current = path;

    // Only act when the path has actually changed from the previous value
    if (previousPath !== path && !path.includes('/search')) {
      if (searchStore.isOpen || searchStore.query.length > 0) {
        searchStore.reset();
        searchStore.setOpen(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  const handlePopstateEvent = React.useCallback(() => {
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
  }, [searchStore]);

  React.useEffect(() => {
    window.addEventListener('popstate', handlePopstateEvent);
    return () => window.removeEventListener('popstate', handlePopstateEvent);
  }, [handlePopstateEvent]);

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
        items={
          items?.map((item: NavItem) => ({
            name: item.title,
            icon: Icons[(item.icon as keyof typeof Icons) ?? 'logo'],
            url: item.href ?? '#',
            iconOnly: item.iconOnly,
            requiresAuth: 
              item.title === 'Bookmarks' || 
              item.title === 'History' || 
              item.title === 'Watch Party',
          })) ?? []
        }
        defaultActive="Home"
        leftNode={
          <Link
            href="/"
            className="flex items-center space-x-2 transition-transform hover:scale-105"
            onClick={() => handleChangeStatusOpen(false)}>
            <Icons.logo
              className="h-7 w-7 text-primary drop-shadow-md"
              aria-hidden="true"
            />
            <span className="font-brand hidden text-xl font-bold tracking-wide text-foreground drop-shadow-md lg:inline-block">
              {siteConfig.name}
            </span>
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
              className="w-52 overflow-y-auto overflow-x-hidden rounded-xl border border-border/50 bg-background/95 shadow-2xl backdrop-blur-md">
              <DropdownMenuLabel>
                <Link
                  href="/"
                  className="flex items-center justify-center font-black tracking-tight"
                  onClick={() => handleChangeStatusOpen(false)}>
                  <span>{siteConfig.name}</span>
                </Link>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {items?.map((item, index) => {
                const requiresAuth = 
                  item.title === 'Bookmarks' || 
                  item.title === 'History' || 
                  item.title === 'Watch Party';
                return (
                  <DropdownMenuItem
                    key={index}
                    onClick={(e) => {
                      if (requiresAuth && !session) {
                        e.preventDefault();
                        authModal.onOpen();
                      } else {
                        handleChangeStatusOpen(false);
                      }
                    }}
                    asChild
                    className="cursor-pointer items-center justify-center">
                    {item.href && (
                      <Link 
                        href={requiresAuth && !session ? '#' : item.href}
                        onClick={(e) => {
                          if (requiresAuth && !session) {
                            e.preventDefault();
                            authModal.onOpen();
                          }
                        }}
                      >
                        <span
                          className={cn(
                            'line-clamp-1 text-sm font-medium transition-colors hover:text-primary',
                            path === item.href
                              ? 'font-bold text-primary'
                              : 'text-foreground/70',
                          )}>
                          {item.title}
                        </span>
                      </Link>
                    )}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        }
        rightNode={
          <div className="relative z-10 flex items-center gap-1 sm:gap-1.5">
            <div className="group/wparty relative">
              <Link 
                href={!session ? "#" : "/party"} 
                onClick={(e) => {
                  if (!session) {
                    e.preventDefault();
                    authModal.onOpen();
                  }
                }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary">
                  <Popcorn size={17} strokeWidth={2} />
                </Button>
              </Link>
              <div className="pointer-events-none absolute -bottom-7 left-1/2 z-50 -translate-x-1/2 translate-y-1 opacity-0 transition-all duration-150 ease-out group-hover/wparty:translate-y-0 group-hover/wparty:opacity-100">
                <span className="whitespace-nowrap rounded-full border border-border/40 bg-secondary/95 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-foreground/80 shadow-sm backdrop-blur-sm">
                  Watch Party
                </span>
              </div>
            </div>
            <DebouncedInput
              id="search-input"
              open={searchStore.isOpen}
              value={searchStore.query}
              onChange={searchShowsByQuery}
              onChangeStatusOpen={handleChangeStatusOpen}
              containerClassName={cn(path === '/' ? 'hidden' : 'flex')}
            />
            <div className="transition-transform hover:scale-110">
              <ThemeToggle />
            </div>
            <div className="ml-1 flex items-center border-l border-border/50 pl-1">
              {children}
            </div>
          </div>
        }
      />
    </>
  );
}

export default MainNav;
