'use client';

import React from 'react';

import '../styles/globals.css'
import App from './app';
import { AuthContextProvider } from '../contexts/AuthContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <html lang="en">
    <body className='bg-white dark:bg-zinc-800 text-black dark:text-white'>
      <AuthContextProvider>
        <App>
          {children}
        </App>
      </AuthContextProvider>
    </body>
  </html>;
}
