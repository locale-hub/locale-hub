'use client';

import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useState } from 'react';

import { routes } from '../../../../constants/routes';
import { ApiConnector } from '@locale-hub/api-connector';
import toast from 'react-hot-toast';
import Joi from 'joi';
import InputField from '@locale-hub/design-system/input-field/input-field';
import Button from '@locale-hub/design-system/button/button';
import Spacer from '@locale-hub/design-system/spacer/spacer';

const schema = Joi.object({
  email: Joi.string().email({ tlds: {allow: false} }).required(),
}).required();

export default function PasswordResetPage() {
  const [email, setEmail] = useState('');

  const formInvalid = () => 'error' in schema.validate({ email });

  const doPasswordReset = async () => {
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
        <div className='w-full'>
          <InputField name={'email'} label={'Email'} onValue={setEmail} type={'text'} value={email} />
        </div>

        <div className='w-full mt-8 flex justify-end'>
          <div className='text-sm font-medium my-auto'>
            <Link href={routes.auth.root} className="text-warn">
              <ChevronLeftIcon className="h-5 w-5 inline-block mr-1 align-top" aria-hidden="true" />
              Go back to login
            </Link>
          </div>
          <Spacer />
          <Button onClick={doPasswordReset} disabled={formInvalid()} type='action'>
            Send email
          </Button>
        </div>
      </div>

    </div>
  </div>;
}
