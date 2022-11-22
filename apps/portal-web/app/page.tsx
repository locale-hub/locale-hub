'use client';

import { redirect } from 'next/navigation';

import { useAuth } from '../contexts/AuthContext';

export default function Page() {
  const { loggedIn } = useAuth();

  if (false === loggedIn) {
    redirect('/auth');
  }

  return (
    <>
      <h1 className={"text-green-500 dark:text-red-600"}>
        Welcome to Next.js!
      </h1>
    </>
  )
}
