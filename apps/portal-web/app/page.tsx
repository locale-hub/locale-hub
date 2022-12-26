'use client';

import { useAuth } from '../contexts/AuthContext';
import { routes } from '../constants/routes';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const { loggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    router.push(loggedIn ? routes.dashboard : routes.auth.root);
  }, [loggedIn]);

  return null;
}
