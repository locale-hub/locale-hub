import { Dialog } from '@headlessui/react';
import React, { useState } from 'react';
import { Button, InputField } from '@locale-hub/design-system';

export default function InviteUserModal({
  isOpen,
  onClose
}: {
  isOpen: boolean,
  onClose: (name?: string, email?: string) => void,
}) {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  return <Dialog as="div" className="relative" open={isOpen} onClose={() => onClose(name, email)}>
    <div className="fixed z-40 inset-0 bg-black bg-opacity-25 dark:bg-opacity-50" />
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Dialog.Panel className="w-2xl h-2xl transform rounded-2xl bg-white dark:bg-slate-800 p-6 text-left align-middle shadow-xl transition-all">
            <Dialog.Title as="h2"
              className="mb-4 text-lg font-medium leading-6 text-gray-900 dark:text-white"
            >
              Invite a user
            </Dialog.Title>

            <div className="mt-2 text-black">
              <div className='w-96'>
                <InputField name={'name'} label={'Name'} onValue={setName} type={'text'} value={name} placeholder='Name' />
                <InputField name={'email'} label={'Email'} onValue={setEmail} type={'text'} value={email} placeholder='Email' />
              </div>
            </div>

            <div className="mt-8 text-black text-right">
              <Button type='cancel' onClick={() => onClose()}>Cancel</Button>
              <Button type='confirm' onClick={() => onClose(name, email)}>Invite</Button>
            </div>
          </Dialog.Panel>
      </div>
    </div>
  </Dialog>;
}
