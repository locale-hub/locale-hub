'use client';

import React, { useEffect, useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

import { ApiConnector } from '@locale-hub/api-connector';
import toast from 'react-hot-toast';
import InputField from '@locale-hub/design-system/input-field/input-field';
import Button from '@locale-hub/design-system/button/button';
import Spacer from '@locale-hub/design-system/spacer/spacer';
import Select from '@locale-hub/design-system/select/select';
import { User } from '@locale-hub/data/models/user.model';
import UserIcon from '@locale-hub/design-system/user-icon/user-icon';
import { EmailStatus } from '@locale-hub/data/enums/email-status.enum';

/* eslint-disable no-control-regex */
const emailRegex = new RegExp(
  '(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])'
);

export default function Page() {
  const [passwords, setPasswords] = useState<{
    old: string;
    new: string;
    new2: string;
  }>({ old: '', new: '', new2: '' });
  const [user, setUser] = useState<User>();
  const [newEmail, setNewEmail] = useState<string>('');

  useEffect(() => {
    ApiConnector.me.self().then((u) => setUser(u));
  }, []);

  const setUserName = (value: string) => setUser({ ...user, name: value });
  const setUserEmail = (value: string) =>
    setUser({ ...user, primaryEmail: value });
  const setPasswordsOld = (value: string) =>
    setPasswords({ ...passwords, old: value });
  const setPasswordsNew = (value: string) =>
    setPasswords({ ...passwords, new: value });
  const setPasswordsNew2 = (value: string) =>
    setPasswords({ ...passwords, new2: value });

  const updateProfile = () => {
    ApiConnector.me.update(user).then((data) => {
      if ('error' in data) {
        toast.error('Failed to update profile');
        return;
      }
      toast.success('Profile updated!');
    });
  };
  const updatePassword = () => {
    ApiConnector.me
      .updatePassword(passwords.old, passwords.new)
      .then((data) => {
        if ('error' in data) {
          toast.error('Failed to update password');
          return;
        }
        toast.success('Profile password!');
      });
  };
  const addNewEmail = () => {
    user.emails.push({
      email: newEmail,
      status: EmailStatus.PENDING,
      createdAt: '',
    });
    ApiConnector.me.update(user).then((data) => {
      if ('error' in data) {
        toast.error('Failed to add email');
        return;
      }
      toast.success('Email added! Please check your mailbox.');
    });
  };

  return (
    <div className="w-6/12 m-auto mt-32">
      {user && (
        <>
          <div className="grid grid-cols-3 gap-8 mb-8">
            <div className="col-span-2 p-8 rounded-md border border-slate-400/50">
              <h1 className="text-lg font-bold">Profile</h1>
              <InputField
                name={'name'}
                label={'Name'}
                onValue={setUserName}
                type={'text'}
                value={user.name}
                placeholder="Name"
              />
              <Select
                onSelect={(value) => {
                  setUserEmail(value.id);
                }}
                label="Primary Email"
                defaultSelected={{
                  id: user.primaryEmail,
                  value: user.primaryEmail,
                }}
                values={user.emails.map((email) => ({
                  id: email.email,
                  value: email.email,
                }))}
              />
              <div className="flex justify-end mt-8">
                <Button type="action" onClick={updateProfile}>
                  Update profile
                </Button>
              </div>
            </div>

            <div className="col-span-1 p-8 rounded-md border border-slate-400/50">
              <p className="text-lg font-bold">Avatar</p>
              <UserIcon name={user.name} size="large" className="pt-8" />
            </div>
          </div>
          <div className="p-8 mb-8 rounded-md border border-slate-400/50">
            <p className="text-lg font-bold">Account security</p>
            <InputField
              name={'old-password'}
              label={'Old password'}
              onValue={setPasswordsOld}
              type={'password'}
              value={passwords.old}
              placeholder="Old password"
            />
            <div className="grid gap-4 md:grid-cols-2">
              <InputField
                name={'new-password'}
                label={'New password'}
                onValue={setPasswordsNew}
                type={'password'}
                value={passwords.new}
                placeholder="New password"
              />
              <InputField
                name={'new-password-2'}
                label={'Confirm new password'}
                onValue={setPasswordsNew2}
                type={'password'}
                value={passwords.new2}
                placeholder="Confirm new password"
              />
            </div>
            <div className="flex justify-end mt-8">
              <Button type="action" onClick={updatePassword}>
                Update password
              </Button>
            </div>
          </div>
          <div className="p-8 mb-8 rounded-md border border-slate-400/50">
            <p className="text-lg font-bold mb-8">Emails</p>
            {user.emails.map((entry) => (
              <div className="flex" key={entry.email}>
                <span>{entry.email}</span>
                {EmailStatus.VALID !== entry.status && (
                  <span className="px-2">—</span>
                )}
                {EmailStatus.PRIMARY === entry.status && (
                  <span className="text-warn font-bold">Primary Email</span>
                )}
                {EmailStatus.PENDING === entry.status && (
                  <span className="text-orange-400 dark:text-orange-300 font-semibold">
                    Pending
                  </span>
                )}
                <Spacer />
                {EmailStatus.PRIMARY !== entry.status && (
                  <TrashIcon className="text-warn w-6 ml-2 hover:cursor-pointer" />
                )}
              </div>
            ))}
            <div className="flex">
              <div className="w-3/4">
                <InputField
                  name={'new-email-address'}
                  label={'Add email address'}
                  onValue={setNewEmail}
                  type={'text'}
                  value={newEmail}
                  placeholder="Email address"
                />
              </div>
              <div className="w-1/4 relative">
                <Button
                  className="absolute right-0 bottom-0 !m-0"
                  type="action"
                  disabled={false === emailRegex.test(newEmail)}
                  onClick={addNewEmail}
                >
                  Add new Email
                </Button>
              </div>
            </div>
          </div>
          <div className="pt-16" />
        </>
      )}
    </div>
  );
}
