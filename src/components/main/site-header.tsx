import { siteConfig } from "@/configs/site";
import React from "react";
import MainNav from "@/components/navigation/main-nav";
import { auth, signIn, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icons } from "@/components/icons";

const SiteHeader = async () => {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50">
      <MainNav items={siteConfig.mainNav}>
        <div className="ml-2 flex flex-shrink-0 items-center gap-2">
          {session?.user ? (
            <div className="flex items-center gap-4">
              {session.user.image ? (
                <img src={session.user.image} alt={session.user.name || "User"} className="h-8 w-8 rounded-full border border-border" />
              ) : (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                  <span className="text-xs font-bold text-primary">{session.user.name?.charAt(0)?.toUpperCase() || "U"}</span>
                </div>
              )}
              <form action={async () => { "use server"; await signOut() }}>
                <Button type="submit" variant="destructive" size="sm">Sign Out</Button>
              </form>
            </div>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default" size="sm">Sign In</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md w-[90vw] md:w-full border-neutral-800 bg-zinc-950 text-white shadow-2xl">
                <DialogHeader className="flex flex-col items-center pt-4">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800">
                    <Icons.logo className="h-6 w-6 text-primary" />
                  </div>
                  <DialogTitle className="text-xl md:text-2xl font-bold tracking-tight text-white mb-2">Access {siteConfig.name}</DialogTitle>
                  <DialogDescription className="text-center text-sm md:text-base text-zinc-400 font-medium px-4">
                    Sign in to sync your bookmarks, watch history, and reviews across all your devices.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-3 py-6 px-2">
                  <form action={async () => { "use server"; await signIn('google', { redirectTo: '/home' }) }}>
                    <Button type="submit" variant="outline" className="w-full flex items-center justify-center gap-3 h-12 bg-white text-zinc-950 hover:bg-zinc-200 hover:text-zinc-950 border-none transition-colors">
                      <Icons.google className="h-5 w-5" />
                      <span className="font-semibold text-sm">Continue with Google</span>
                    </Button>
                  </form>
                  <form action={async () => { "use server"; await signIn('github', { redirectTo: '/home' }) }}>
                    <Button type="submit" variant="outline" className="w-full flex items-center justify-center gap-3 h-12 bg-[#24292F] text-white hover:bg-[#24292F]/90 border-none transition-colors">
                      <Icons.gitHub className="h-5 w-5" />
                      <span className="font-semibold text-sm">Continue with GitHub</span>
                    </Button>
                  </form>
                </div>
                <div className="text-center text-xs text-zinc-600 pb-2">
                  By signing in, you agree to our Terms of Service and Privacy Policy.
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </MainNav>
    </header>
  );
};

export default SiteHeader;
