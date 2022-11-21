'use client';

import { useEffect, useState } from 'react';

import Navbar from '../components/navbar';
import '../styles/globals.css'

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
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
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
    <body className='bg-white dark:bg-zinc-800 text-black dark:text-white'>
      { domLoaded && <>
        <Navbar
          theme='dark'
          onThemeChange={theme => setTheme(theme)}
        />
        <main className='px-10 py-10'>
        {children}
        </main>
      </>}
    </body>
  </html>;
}
