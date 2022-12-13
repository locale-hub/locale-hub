import { Dialog } from '@headlessui/react';
import React from 'react';
import Button from '@locale-hub/design-system/button/button';
import { User } from '@locale-hub/data/models/user.model';

export default function DeleteUserModal({
  isOpen,
  user,
  onClose
}: {
  isOpen: boolean,
  user: User
  onClose: (shouldDelete: boolean) => void,
}) {
  if (null == user) {
    return <></>;
  }

  return <Dialog as="div" className="relative" open={isOpen} onClose={() => onClose(false)}>
    <div className="fixed z-40 inset-0 bg-black bg-opacity-25 dark:bg-opacity-50" />
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Dialog.Panel className="w-2xl h-2xl transform rounded-2xl bg-white dark:bg-slate-800 p-6 text-left align-middle shadow-xl transition-all">
            <Dialog.Title as="h2"
              className="mb-4 text-lg font-medium leading-6 text-gray-900 dark:text-white"
            >
              Are you sure?
            </Dialog.Title>

            <div className="mt-2">
              <div className='w-96'>
                This action cannot be undone.<br />
                This will permanently revoke access to the user John Doe to this project.<br />
                You can still invite this user again if necessary.
              </div>
            </div>

            <div className="mt-8 text-black text-right">
              <Button type='cancel' onClick={() => onClose(false)}>Cancel</Button>
              <Button type='confirm' onClick={() => onClose(true)}>Revoke access to { user.name }</Button>
            </div>
          </Dialog.Panel>
      </div>
    </div>
  </Dialog>;
}
