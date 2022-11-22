import Image from 'next/image';
import MoonIcon from '@heroicons/react/24/outline/MoonIcon';
import SunIcon from '@heroicons/react/24/outline/SunIcon';

import React from 'react';
import Link from 'next/link';

type Theme = 'dark' | 'light';

export default function Navbar({
  navigation,
  theme,
  onThemeChange
}: {
  theme: Theme,
  onThemeChange?: (theme: Theme) => void,
  navigation?: React.ReactNode
}) {
  let currentTheme: Theme = theme;

  const onThemeClicked = () => {
    currentTheme = 'light' === currentTheme ? 'dark' : 'light';
    if (undefined !== onThemeChange) {
      onThemeChange(currentTheme);
    }
  }

  return <nav className="sticky top-0 flex px-10 py-4 h-16 border-b border-1 border-black/10 dark:border-white/40">
    <div className="w-5/12 flex items-center">
      <Link href='/'>
        <Image src="/logo-white.svg" alt="Locale Hub logo" width="40" height="40" className='hidden dark:inline' />
        <Image src="/logo.svg" alt="Locale Hub logo" width="40" height="40" className='inline dark:hidden' />
        <h1 className="inline-block align-middle text-2xl font-semibold px-2">Locale Hub</h1>
      </Link>
    </div>
    <div className="w-7/12 flex justify-end items-center">
      {navigation}
      <span className='hover:cursor-pointer pl-4' onClick={onThemeClicked}>
          <MoonIcon className='hidden dark:inline h-6 w-6' />
          <SunIcon className='dark:hidden h-6 w-6' />
        </span>
    </div>
  </nav>
}
