'use client';

import React from 'react';
import Link from 'next/link';

import { Navbar, Spacer, UserIcon } from '@locale-hub/design-system';
import '../styles/globals.css'
import { useAuth } from '../contexts/AuthContext';
import { routes } from '../constants/routes';
import { BellAlertIcon, DocumentTextIcon, PlusIcon } from '@heroicons/react/24/outline';


const visitorNavigation = <>
  <Link href={routes.root} className='px-4'>Dashboard</Link>
</>;

const authenticatedNavigation = (user: any, onLogout: () => void) => <>
  <Link href={routes.organizations.root} className='px-4'>Organizations</Link>
  <Link href={routes.projects.root} className='px-4'>Projects</Link>
  <Spacer />
  <DocumentTextIcon className='mx-2 h-6 w-6 hover:cursor-pointer' />
  <BellAlertIcon className='mx-2 h-6 w-6 hover:cursor-pointer' />
  <PlusIcon className='mx-2 h-6 w-6 hover:cursor-pointer' />
  <UserIcon name={user.name}>
    <a className='bg-gray-100 block px-4 py-2 text-black hover:cursor-pointer hover:bg-slate-200'>Profile</a>
    <a onClick={onLogout} className='bg-gray-100 block px-4 py-2 text-warn hover:cursor-pointer hover:bg-slate-200'>Logout</a>
  </UserIcon>
</>;

export default function App({
  onThemeChange,
  children,
}: {
  onThemeChange: (theme) => void,
  children: React.ReactNode;
}) {
  const { user, loggedIn, logout } = useAuth();

  return <>
      <Navbar
        theme='dark'
        onThemeChange={onThemeChange}
        navigation={loggedIn ? authenticatedNavigation(user, logout) : visitorNavigation}
      />
      <main className='height-full'>
        {children}
      </main>
  </>;
}
