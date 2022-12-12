'use client';

import React, { useEffect, useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

import { Button, InputField, Select, Spacer, UserIcon } from '@locale-hub/design-system';
import { ApiConnector } from '@locale-hub/api-connector';
import { User } from '@locale-hub/data';

export default function Page() {
  const [passwords, setPasswords] = useState<{ old: string, new: string, new2: string }>({ old: '', new: '', new2: '' });
  const [user, setUser] = useState<User>();

  useEffect(() => {
    ApiConnector.me.self().then((u) => setUser(u));
  }, []);

  const setUserName = (value: string) => setUser({ ...user, name: value });
  const setUserEmail = (value: string) => setUser({ ...user, primaryEmail: value });
  const setPasswordsOld = (value: string) => setPasswords({ ...passwords, old: value });
  const setPasswordsNew = (value: string) => setPasswords({ ...passwords, new: value });
  const setPasswordsNew2 = (value: string) => setPasswords({ ...passwords, new2: value });

  const updateProfile = () => {
    // TODO: Toast
    ApiConnector.me.update(user);
  };
  const updatePassword = () => {
    // TODO: Toast
    ApiConnector.me.updatePassword(passwords.old, passwords.new);
  };

  return <div className='w-6/12 m-auto mt-32'>
    { user && <>
      <div className='grid grid-cols-3 gap-8 mb-8'>
        <div className='col-span-2 p-8 rounded-md border border-slate-400/50'>
          <h1 className='text-lg font-bold'>Profile</h1>
          <InputField name={'name'} label={'Name'} onValue={setUserName} type={'text'} value={user.name} placeholder='Name' />
          <Select onSelect={(value) => {setUserEmail(value.id)}}
                label='Primary Email'
                defaultSelected={{ id: user.primaryEmail, value: user.primaryEmail }}
                values={user.emails.map(email => ({ id: email.email, value: email.email}))}
          />
          <div className='flex justify-end mt-8'>
            <Button type='action' onClick={updateProfile}>Update profile</Button>
          </div>
        </div>

        <div className='col-span-1 p-8 rounded-md border border-slate-400/50'>
          <p className='text-lg font-bold'>Avatar</p>
          <UserIcon name={user.name} size='large' className='pt-8' />
        </div>
      </div>
      <div className='p-8 mb-8 rounded-md border border-slate-400/50'>
        <p className='text-lg font-bold'>Account security</p>
        <InputField name={'old-password'} label={'Old password'} onValue={setPasswordsOld} type={'password'} value={passwords.old} placeholder='Old password' />
        <div className="grid gap-4 md:grid-cols-2">
          <InputField name={'new-password'} label={'New password'} onValue={setPasswordsNew} type={'password'} value={passwords.new} placeholder='New password' />
          <InputField name={'new-password-2'} label={'Confirm new password'} onValue={setPasswordsNew2} type={'password'} value={passwords.new2} placeholder='Confirm new password' />
        </div>
        <div className='flex justify-end mt-8'>
          <Button type='action' onClick={updatePassword}>Update password</Button>
        </div>
      </div>
      <div className='p-8 mb-8 rounded-md border border-slate-400/50'>
        <p className='text-lg font-bold mb-8'>Emails</p>
        { user.emails.map(entry => <div className='flex' key={entry.email}>
          <span>{entry.email}</span>
          { user.primaryEmail === entry.email && <>
            <span className='px-2'>—</span>
            <span className='text-warn font-bold'>Primary Email</span>
            <Spacer />
          </> }
          { user.primaryEmail !== entry.email &&
            <TrashIcon className='text-warn w-6 ml-2 hover:cursor-pointer' />
          }
        </div>)}
      </div>
      <div className='pt-16' />
    </> }
  </div>;
}
