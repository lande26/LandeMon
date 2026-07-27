'use client';

import React from 'react';
import { siteConfig } from '@/configs/site';
import Link from 'next/link';
import { Icons } from '@/components/icons';

const SiteFooter = () => {
  return (
    <footer aria-label="Footer" className="relative mt-24 w-full border-t border-white/5 bg-slate-950/40 text-slate-400 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          {/* Brand Logo & Slogan */}
          <div className="space-y-1.5">
            <Link href="/" className="inline-flex items-center gap-2.5 transition-transform hover:scale-105">
              <Icons.logo className="h-6 w-6 text-white drop-shadow-md" aria-hidden="true" />
              <span className="font-brand text-xl font-bold tracking-wide text-white drop-shadow-md">
                {siteConfig.name}
              </span>
            </Link>
            <p className="text-xs text-slate-400">
              {siteConfig.slogan}
            </p>
          </div>

          {/* Minimal Links */}
          <nav aria-label="Footer Navigation" className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-slate-300">
            <Link href="/home" className="transition-colors hover:text-white">
              Home
            </Link>
            <Link href="/movies" className="transition-colors hover:text-white">
              Movies
            </Link>
            <Link href="/tv-shows" className="transition-colors hover:text-white">
              TV Shows
            </Link>
            <Link href="/anime" className="transition-colors hover:text-white">
              Anime
            </Link>
            <Link href="/party" className="transition-colors hover:text-white">
              Watch Party
            </Link>
            <Link href="/bookmarks" className="transition-colors hover:text-white">
              Bookmarks
            </Link>
            <Link href="/history" className="transition-colors hover:text-white">
              History
            </Link>
          </nav>
        </div>

        {/* Minimal Divider & Copyright */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} {siteConfig.author}. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            {siteConfig.links.github && (
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Repository"
                className="text-slate-400 transition-colors hover:text-white">
                <Icons.gitHub className="h-4 w-4" />
              </a>
            )}
            {siteConfig.links.twitter && (
              <a
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter X Profile"
                className="text-slate-400 transition-colors hover:text-white">
                <Icons.twitter className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
