'use client';

import React from 'react';
import Link from 'next/link';

import { Navbar } from '@locale-hub/design-system';
import '../styles/globals.css'
import { useAuth } from '../contexts/AuthContext';


const visitorNavigation = <>
  <Link href="/auth" className='px-4'>Dashboard</Link>
</>;
const authenticatedNavigation = (onLogout: () => void) => <>
  <Link href="/" className='px-4'>Dashboard</Link>
  <span onClick={onLogout} className='hover:cursor-pointer px-4'>Logout</span>
</>;

export default function App({
  onThemeChange,
  children,
}: {
  onThemeChange: (theme) => void,
  children: React.ReactNode;
}) {
  const { loggedIn, logout } = useAuth();

  return <>
      <Navbar
        theme='dark'
        onThemeChange={onThemeChange}
        navigation={loggedIn ? authenticatedNavigation(logout) : visitorNavigation}
      />
      <main className='px-10 py-10'>
        {children}
      </main>
  </>;
}
