'use client';

import React from 'react';
import { useAuthModal } from '@/stores/auth-modal';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { siteConfig } from '@/configs/site';
import { signIn, useSession } from 'next-auth/react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthModal() {
  const { isOpen, onClose, onOpen } = useAuthModal();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (searchParams.get('auth') === 'true') {
      onOpen();
      // Clean up the URL to prevent re-triggering
      const params = new URLSearchParams(searchParams.toString());
      params.delete('auth');
      const newQuery = params.toString() ? `?${params.toString()}` : '';
      router.replace(`${pathname}${newQuery}`);
    }
  }, [searchParams, onOpen, router, pathname]);

  const handleSignIn = async (provider: 'google' | 'github') => {
    const callbackUrl = searchParams.get('callbackUrl') || window.location.href;
    await signIn(provider, { callbackUrl });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-[90vw] md:w-full border-border bg-background text-foreground shadow-2xl">
        <DialogHeader className="flex flex-col items-center pt-4">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary border border-border">
            <Icons.logo className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-xl md:text-2xl font-bold tracking-tight text-foreground mb-2">
            Access {siteConfig.name}
          </DialogTitle>
          <DialogDescription className="text-center text-sm md:text-base text-muted-foreground font-medium px-4">
            Sign in to sync your bookmarks, watch history, and reviews across all your devices.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-6 px-2">
          <Button
            onClick={() => handleSignIn('google')}
            variant="outline"
            className="w-full flex items-center justify-center gap-3 h-12 bg-white text-black hover:bg-neutral-200 border border-border transition-colors"
          >
            <Icons.google className="h-5 w-5" />
            <span className="font-semibold text-sm">Continue with Google</span>
          </Button>
          <Button
            onClick={() => handleSignIn('github')}
            variant="outline"
            className="w-full flex items-center justify-center gap-3 h-12 bg-[#24292F] text-white hover:bg-[#24292F]/90 border-transparent transition-colors"
          >
            <Icons.gitHub className="h-5 w-5" />
            <span className="font-semibold text-sm">Continue with GitHub</span>
          </Button>
        </div>
        <div className="text-center text-xs text-muted-foreground pb-2">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </div>
      </DialogContent>
    </Dialog>
  );
}
