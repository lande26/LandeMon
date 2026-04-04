'use client';

import React from 'react';
import { useAuthModal } from '@/stores/auth-modal';
import { Button } from '@/components/ui/button';

export function SignInButton() {
  const { onOpen } = useAuthModal();

  return (
    <Button variant="default" size="sm" onClick={onOpen}>
      Sign In
    </Button>
  );
}
