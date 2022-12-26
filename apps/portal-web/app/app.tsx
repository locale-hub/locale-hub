'use client';

import React from 'react';
import Link from 'next/link';

import '../styles/globals.css';
import { useAuth } from '../contexts/AuthContext';
import { routes } from '../constants/routes';
import NavigationAuthenticated from '../components/navigation-authenticated';
import Navbar from '@locale-hub/design-system/navbar/navbar';
import { ApiConnector } from '@locale-hub/api-connector';
import { environment } from '../environment';

export default function App({
  onThemeChange,
  children,
}: {
  onThemeChange: (theme) => void;
  children: React.ReactNode;
}) {
  const { loggedIn, logout } = useAuth();
  ApiConnector.initApi(
    environment.portal.api.uri,
    () => setTimeout(() => logout(), 50)
  );

  return (
    <>
      <Navbar theme="dark" onThemeChange={onThemeChange}>
        {loggedIn && <NavigationAuthenticated />}
        {false === loggedIn && (
          <>
            <Link href={routes.root} className="px-4">
              Dashboard
            </Link>
          </>
        )}
      </Navbar>
      <main className="height-full">{children}</main>
    </>
  );
}
