// import type { FooterItem, MainNavItem } from "@/types"
//
// import { productCategories } from "@/config/products"
// import { slugify } from "@/lib/utils"

import { Icons } from '@/components/icons';
import { env } from '@/env.mjs';

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: env.NEXT_PUBLIC_SITE_NAME,
  author: env.NEXT_PUBLIC_SITE_NAME,
  slogan: 'Cinema at Your Fingertips.',
  description:
    'Watch movies & TV shows online or stream right to your smart TV, game console, PC, Mac, mobile, tablet and more.',
  keywords: [
    'watch movies',
    'movies online',
    'watch TV',
    'TV online',
    'TV shows online',
    'watch TV shows',
    'stream movies',
    'stream tv',
    'instant streaming',
    'watch online',
    'movies',
    'watch TV online',
    'no download',
    'full length movies',
    env.NEXT_PUBLIC_SITE_NAME,
  ],
  url: env.NEXT_PUBLIC_APP_URL,
  ogImage: `${env.NEXT_PUBLIC_APP_URL}/images/hero.jpg`,
  links: {
    twitter: `${env.NEXT_PUBLIC_TWITTER}`,
    github: 'https://github.com/lande26/LandeMon',
    githubAccount: '',
  },
  footerItems: [
    { title: 'About', href: '/' },
    { title: 'Help Center', href: '/' },
    { title: 'Contact Us', href: '/' },
    { title: 'Privacy Policy', href: '/' },
  ],
  mainNav: [
    {
      title: 'Home',
      href: '/home',
      // icon: Icons.play,
    },
    {
      title: 'TV Shows',
      href: '/tv-shows',
      // icon: Icons.tvShow,
    },
    {
      title: 'Movies',
      href: '/movies',
      // icon: Icons.movie,
    },
    {
      title: 'Anime',
      href: '/anime',
      // icon: Icons.list,
    },
    {
      title: 'New & Popular',
      href: '/new-and-popular',
      // icon: Icons.trendingUp,
    },
  ],
};
