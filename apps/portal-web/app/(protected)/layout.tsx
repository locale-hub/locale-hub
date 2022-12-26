'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { routes } from '../../constants/routes';
import React from 'react';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loggedIn } = useAuth();
  const router = useRouter();

  if (false === loggedIn) {
    router.push(routes.auth.root);
  }

  return loggedIn ? children : null;
}
