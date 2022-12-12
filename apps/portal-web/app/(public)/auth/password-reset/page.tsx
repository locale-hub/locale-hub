'use client';

import { ChevronLeftIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useState } from 'react';

import { routes } from '../../../../constants/routes';
import { ApiConnector } from '@locale-hub/api-connector';
import toast from 'react-hot-toast';

export default function PasswordResetPage() {
  const [email, setEmail] = useState('');

  const doPasswordReset = async () => {
    // TODO: form validation
    await ApiConnector.auth.resetPassword(email);
    toast.success('An email has been sent with a reset link');
  }

  return <div className="flex min-h-full items-center justify-center px-10 py-10 sm:px-6 lg:px-8">
    <div className="w-full max-w-4xl space-y-8 text-center">

      <h2 className="mt-6 text-3xl font-bold">
        Password reset request
      </h2>

      <p>
        Please give us your email address so we can send you a link to reset your password.<br />
        This is required to ensure nobody else than you is actually resetting your password.
      </p>


      <div className='max-w-xl mx-auto'>
        <div className='mb-4'>
          <label htmlFor="email-address" className="sr-only">
            Email address
          </label>
          <input id="email-address" type="email" name="email" placeholder="Email address" autoComplete="email" required
             className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
             value={email}
             onChange={e => { setEmail(e.currentTarget.value); }}
          />
        </div>

        <div className='flex flex-1'>
          <div className='text-sm font-medium my-auto'>
            <Link href={routes.auth.root} className="text-warn">
              <ChevronLeftIcon className="h-5 w-5 inline-block mr-1 align-top" aria-hidden="true" />
              Go back to login
            </Link>
          </div>
          <button className="my-auto ml-auto mr-0 justify-end relative w-4/12 justify-center rounded-md py-2 px-4 font-medium bg-primary text-white"
              onClick={doPasswordReset}
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <EnvelopeIcon className="h-5 w-5" aria-hidden="true" />
            </span>
            Send email
          </button>
        </div>
      </div>

    </div>
  </div>;
}
