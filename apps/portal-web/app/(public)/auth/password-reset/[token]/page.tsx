'use client';

import { useState } from 'react';
import { redirect } from 'next/navigation';

import { routes } from '../../../../../constants/routes';
import { ApiConnector } from '@locale-hub/api-connector';
import toast from 'react-hot-toast';
import Joi from 'joi';
import InputField from '@locale-hub/design-system/input-field/input-field';
import Button from '@locale-hub/design-system/button/button';

const schema = Joi.object({
  email: Joi.string().email({ tlds: {allow: false} }).required(),
  password: Joi.string().min(8).required(),
  passwordConfirm: Joi.string().min(8).valid(Joi.ref('password')).required(),
}).required();

export default function PasswordResetApplyPage({
  params
}: {
  params: { token: string }
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const formInvalid = () => 'error' in schema.validate({ email, password, passwordConfirm });

  const doPasswordReset = () => {
    ApiConnector.auth.resetPasswordApply(params.token, email, password).then((data) => {
      if ('error' in data) {
        toast.error('Failed to request password reset');
        return;
      }
      redirect(routes.root);
    });
  }

  return <div className="flex flex-col px-10 py-10 w-1/4 items-center m-auto justify-center">
    <h2 className="mt-6 text-3xl font-bold">
      Password reset
    </h2>
    <div className='w-full'>
      <InputField name={'email'} label={'Email'} onValue={setEmail} type={'text'} value={email} />
    </div>
    <div className='w-full'>
      <InputField name={'password'} label={'New password'} onValue={setPassword} type={'password'} value={password} />
    </div>
    <div className='w-full'>
      <InputField name={'password-confirm'} label={'Confirm new password'} onValue={setPasswordConfirm} type={'password'} value={passwordConfirm} />
    </div>

    <div className='w-full mt-8 flex justify-end'>
      <Button onClick={doPasswordReset} disabled={formInvalid()} type='action'>
        Reset Password
      </Button>
    </div>
  </div>;
}
