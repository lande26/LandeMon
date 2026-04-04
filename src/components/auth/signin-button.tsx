'use client';

import React from 'react';
import { useAuthModal } from '@/stores/auth-modal';
import { Button } from '@/components/ui/button';

import { LogIn } from 'lucide-react';

export function SignInButton() {
  const { onOpen } = useAuthModal();

  return (
    <Button variant="default" size="sm" onClick={onOpen} className="gap-1.5 px-3 md:px-4">
      <LogIn size={16} />
      <span className="hidden md:inline">Sign In</span>
    </Button>
  );
}
