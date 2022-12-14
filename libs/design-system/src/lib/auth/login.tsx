'use client';

import { LockClosedIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import React, { useState } from 'react';
import Joi from 'joi';
import InputField from '../input-field/input-field';
import Button from '../button/button';
import Spacer from '../spacer/spacer';

const schema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(8).required(),
}).required();

export default function LoginPage({
  login,
  passwordResetPath,
}: {
  login: (email: string, password: string) => void;
  passwordResetPath: string;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const formInvalid = () => 'error' in schema.validate({ email, password });

  const doLogin = () => {
    login(email, password);
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="grid">
        <InputField
          name={'email'}
          label={'Email'}
          onValue={setEmail}
          type={'text'}
          value={email}
          placeholder="Email"
        />
        <InputField
          name={'password'}
          label={'Password'}
          onValue={setPassword}
          type={'password'}
          value={password}
          placeholder="Password"
        />
      </div>

      <div className="flex justify-end mt-8">
        <Button
          className="relative flex w-32 justify-end"
          type="action"
          onClick={doLogin}
          disabled={formInvalid()}
        >
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <LockClosedIcon className="h-5 w-5" aria-hidden="true" />
          </span>
          Sign in
        </Button>
      </div>
      <div className="flex text-sm font-medium">
        <Spacer />
        <Link href={passwordResetPath} className="text-warn">
          Forgot your password?
        </Link>
      </div>
    </div>
  );
}
