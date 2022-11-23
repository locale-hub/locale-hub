'use client';

import { LockClosedIcon } from '@heroicons/react/24/solid';

import { Spacer } from '@locale-hub/design-system';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage({
  login,
  passwordResetPath
}: {
  login: (email: string, password: string) => void,
  passwordResetPath: string
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const doLogin = () => login(email, password);

  return <div className="mt-8 space-y-6">
    <div className="-space-y-px rounded-md shadow-sm">
      <div>
        <label htmlFor="email-address" className="sr-only">
          Email address
        </label>
        <input id="email-address" type="email" name="email" placeholder="Email address" autoComplete="email" required
          className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
          value={email}
          onChange={e => { setEmail(e.currentTarget.value); }}
        />
      </div>
      <div>
        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <input id="password" type="password" name="password" placeholder="Password" autoComplete="current-password" required
          className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
           value={password}
           onChange={e => { setPassword(e.currentTarget.value); }}
        />
      </div>
    </div>

    <div>
      <button className="group relative flex w-full justify-center rounded-md py-2 px-4 font-medium bg-primary text-white"
        onClick={doLogin}
      >
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <LockClosedIcon className="h-5 w-5" aria-hidden="true" />
        </span>
        Sign in
      </button>
      <div className="flex text-sm font-medium mt-4">
        <Spacer />
        <Link href={passwordResetPath} className="text-warn">
          Forgot your password?
        </Link>
      </div>
    </div>
  </div>;
}
