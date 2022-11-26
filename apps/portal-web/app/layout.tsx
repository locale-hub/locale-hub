'use client';

import React, { useEffect, useState } from 'react';

import '../styles/globals.css'
import App from './app';
import { AuthContextProvider } from '../contexts/AuthContext';

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


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [domLoaded, setDomLoaded] = useState(false);
  useEffect(function() {
    loadThemeMode();
    setDomLoaded(true);
  },[]);

  return <html lang="en">
    <body className='bg-gray-100 w-full min-h-full dark:bg-dark text-black dark:text-white'>
      <AuthContextProvider>
        { domLoaded &&
          <App onThemeChange={theme => setTheme(theme)}>
            {children}
          </App>
        }
      </AuthContextProvider>
    </body>
  </html>;
}
