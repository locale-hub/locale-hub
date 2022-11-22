'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { Navbar } from '@locale-hub/design-system';
import '../styles/globals.css'
import { useAuth } from '../contexts/AuthContext';

const loadThemeMode = () => {
  // https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually
  const isDarkMode = window.localStorage.theme === 'dark'
    || (
      !('theme' in window.localStorage)
      && window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  setTheme(isDarkMode ? 'dark' : 'light');
};

const setTheme = (theme: 'dark' | 'light') => {
  if ('dark' === theme) {
    window.localStorage.setItem('theme', 'dark');
    document.documentElement.classList.add('dark');
  } else {
    window.localStorage.setItem('theme', 'light');
    document.documentElement.classList.remove('dark');
  }
};

const visitorNavigation = <>
  <Link href="/login" className='px-4'>Login</Link>
</>;
const authenticatedNavigation = (onLogout: () => void) => <>
  <Link href="/" className='px-4'>Dashboard</Link>
  <span onClick={onLogout} className='hover:cursor-pointer px-4'>Logout</span>
</>;

export default function App({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loggedIn, logout } = useAuth();
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(function() {
    loadThemeMode();
    setDomLoaded(true);
  },[]);

  return <>
    { domLoaded && <>
      <Navbar
        theme='dark'
        onThemeChange={theme => setTheme(theme)}
        navigation={loggedIn ? authenticatedNavigation(logout) : visitorNavigation}
      />
      <main className='px-10 py-10'>
        {children}
      </main>
    </>}
  </>;
}
