import { siteConfig } from "@/configs/site";
import React from "react";
import MainNav from "@/components/navigation/main-nav";
import { auth, signOut } from "@/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignInButton } from "@/components/auth/signin-button";

const SiteHeader = async () => {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50">
      <MainNav items={siteConfig.mainNav}>
        <div className="ml-2 flex flex-shrink-0 items-center gap-2">
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="cursor-pointer">
                  {session.user.image ? (
                    <img src={session.user.image} alt={session.user.name ?? "User"} className="h-8 w-8 rounded-full border border-border transition-transform hover:scale-110" />
                  ) : (
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20 transition-transform hover:scale-110">
                      <span className="text-xs font-bold text-primary">{session.user.name?.charAt(0)?.toUpperCase() ?? "U"}</span>
                    </div>
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-md border border-border/80 shadow-2xl p-2 rounded-xl mt-2 z-[99999]">
                <DropdownMenuLabel className="font-normal border-b pb-3 mb-2 border-border/50">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold leading-none">{session.user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuItem asChild className="cursor-pointer rounded-lg hover:bg-secondary/80 focus:bg-secondary p-0">
                  <form action={async () => { "use server"; await signOut() }} className="w-full">
                    <button type="submit" className="w-full text-left flex items-center py-2 px-3 text-red-500 font-medium">
                      Sign Out
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <SignInButton />
          )}
        </div>
      </MainNav>
    </header>
  );
};

export default SiteHeader;
