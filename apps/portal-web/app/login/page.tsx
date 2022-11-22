'use client';
import Image from 'next/image';
import { LockClosedIcon } from '@heroicons/react/24/solid';
import { Spacer } from '@locale-hub/design-system';
import { useAuth } from '../../contexts/AuthContext';
import { redirect } from 'next/navigation';

export default function AppPage() {
  const { login, loggedIn } = useAuth();

  const doLogin = () => {
    login();
  };

  if (loggedIn) {
    redirect('/')
  }

  return <>
    <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className='text-center'>
          <Image src="/logo-white.svg" alt="Locale Hub logo" width="128" height="128" className='hidden dark:inline mx-auto h-16 w-auto' />
          <Image src="/logo.svg" alt="Locale Hub logo" width="128" height="128" className='dark:hidden mx-auto h-16 w-auto' />

          <h2 className="mt-6 text-center text-3xl font-bold">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-8 space-y-6">

          <input type="hidden" name="remember" defaultValue="true" />
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              onClick={doLogin}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                </span>
              Sign in
            </button>

            <div className="flex text-sm font-medium mt-4">
              <a href="#" className="text-indigo-600 hover:text-indigo-500">
                Create account
              </a>
              <Spacer />
              <a href="#" className="text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

  </>;
}
