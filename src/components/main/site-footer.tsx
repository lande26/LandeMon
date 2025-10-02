import React from "react";
import { siteConfig } from "@/configs/site";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";

const SiteFooter = () => {
  return (
    <footer aria-label="Footer" className="w-full">
      <div className="container grid w-full max-w-6xl gap-7 py-10">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {siteConfig.footerItems.map(
            (item, i) =>
              item.href && (
                <li
                  key={i}
                  className="text-xs text-foreground/60 hover:underline sm:text-sm"
                >
                  <Link href={item.href}>{item.title}</Link>
                </li>
              ),
          )}
        </ul>
        <p className="text-xs text-foreground/60 sm:text-sm">
          @ {new Date().getFullYear()} {siteConfig.author}.
        </p>
      </div>
    </footer>
  );
};

export default SiteFooter;
