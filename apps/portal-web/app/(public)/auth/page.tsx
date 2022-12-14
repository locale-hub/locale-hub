'use client';

import { redirect } from 'next/navigation';

import { useAuth } from '../../../contexts/AuthContext';
import { useState } from 'react';
import Image from 'next/image';
import { routes } from '../../../constants/routes';
import Auth from '@locale-hub/design-system/auth';

export default function AuthPage() {
  const { register, login, loggedIn } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  if (loggedIn) {
    redirect(routes.dashboard);
  }

  return (
    <div className="flex px-10 py-10 min-h-full items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Image
            src="/logo-white.svg"
            alt="Locale Hub logo"
            width="128"
            height="128"
            className="hidden dark:inline mx-auto h-16 w-auto"
          />
          <Image
            src="/logo.svg"
            alt="Locale Hub logo"
            width="128"
            height="128"
            className="dark:hidden mx-auto h-16 w-auto"
          />

          <h2 className="mt-6 text-center text-3xl font-bold">
            {isLogin ? 'Sign in to your account' : 'Register your account'}
          </h2>
        </div>

        <div className="flex text-sm font-medium mt-4 justify-center">
          {isLogin && (
            <button
              onClick={() => setIsLogin(false)}
              className="text-primary dark:text-primary"
            >
              No account yet? Signup!
            </button>
          )}
          {false === isLogin && (
            <button
              onClick={() => setIsLogin(true)}
              className="text-primary dark:text-primary"
            >
              Already have an account? Sign in!
            </button>
          )}
        </div>

        {isLogin ? (
          <Auth.Login
            login={login}
            passwordResetPath={routes.auth.passwordReset}
          />
        ) : (
          <Auth.Register register={register} />
        )}
      </div>
    </div>
  );
}
