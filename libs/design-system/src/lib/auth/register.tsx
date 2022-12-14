import { LockClosedIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';
import Joi from 'joi';
import InputField from '../input-field/input-field';
import Button from '../button/button';

const schema = Joi.object({
  name: Joi.string().min(4).required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(8).required(),
  passwordConfirm: Joi.string().min(8).valid(Joi.ref('password')).required(),
}).required();

export default function RegisterPage({
  register,
}: {
  register: (name: string, email: string, password: string) => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const formInvalid = () =>
    'error' in schema.validate({ name, email, password, passwordConfirm });

  const doRegister = () => {
    register(name, email, password);
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="grid">
        <InputField
          name={'name'}
          label={'Name'}
          onValue={setName}
          type={'text'}
          value={name}
          placeholder="Name"
        />
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
        <InputField
          name={'password-confirm'}
          label={'Confirm Password'}
          onValue={setPasswordConfirm}
          type={'password'}
          value={passwordConfirm}
          placeholder="Confirm Password"
        />
      </div>

      <div className="flex justify-end mt-8">
        <Button
          className="relative flex w-32 justify-end"
          type="action"
          onClick={doRegister}
          disabled={formInvalid()}
        >
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <LockClosedIcon className="h-5 w-5" aria-hidden="true" />
          </span>
          Sign up
        </Button>
      </div>
    </div>
  );
}
