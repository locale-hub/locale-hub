'use client';

import { redirect } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { routes } from '../../constants/routes';
import React from 'react';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loggedIn } = useAuth();

  if (false === loggedIn) {
    redirect(routes.auth.root);
  }

  return loggedIn ? children : null;
}
