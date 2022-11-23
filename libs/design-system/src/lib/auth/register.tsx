
import { LockClosedIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

export default function RegisterPage({
  register
}: {
  register: (name: string, email: string, password: string) => void,
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const doRegister = () => {
    // TODO: form validation
    register(name, email, password);
  }

  return <div className="mt-8 space-y-6">
    <div className="-space-y-px rounded-md shadow-sm">
      <div>
        <label htmlFor="name" className="sr-only">
          Name
        </label>
        <input id="name" type="text" name="name" placeholder="Name" required
          className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
          value={name}
          onChange={e => { setName(e.currentTarget.value); }}
        />
      </div>
      <div>
        <label htmlFor="email-address" className="sr-only">
          Email address
        </label>
        <input id="email-address" type="email" name="email" placeholder="Email address" autoComplete="email" required
          className="relative block w-full appearance-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
          value={email}
          onChange={e => { setEmail(e.currentTarget.value); }}
        />
      </div>
      <div>
        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <input id="password" type="password" name="password" placeholder="Password" autoComplete="current-password" required
          className="relative block w-full appearance-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
          value={password}
          onChange={e => { setPassword(e.currentTarget.value); }}
        />
      </div>
      <div>
        <label htmlFor="password-confirm" className="sr-only">
          Password
        </label>
        <input
          id="password-confirm" type="password" name="password-confirm" placeholder="Confirm password" autoComplete="current-password" required
          className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
          value={passwordConfirm}
          onChange={e => { setPasswordConfirm(e.currentTarget.value); }}
        />
      </div>
    </div>

    <div>
      <button
        onClick={doRegister}
        className="group relative flex w-full justify-center rounded-md py-2 px-4 font-medium bg-primary text-white"
      >
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <LockClosedIcon className="h-5 w-5" aria-hidden="true" />
        </span>
        Sign up
      </button>
    </div>
  </div>;
}
