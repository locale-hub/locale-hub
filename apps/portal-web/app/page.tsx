'use client';

import { redirect } from 'next/navigation';

import { useAuth } from '../contexts/AuthContext';
import { routes } from '../constants/routes';

export default function Page() {
  const { loggedIn } = useAuth();

  if (false === loggedIn) {
    redirect(routes.auth.root);
    return null;
  }

  redirect(routes.dashboard);
  return null;
}
