import { Dialog } from '@headlessui/react';
import React, { useState } from 'react';
import InputField from '@locale-hub/design-system/input-field/input-field';
import Button from '@locale-hub/design-system/button/button';

export default function AddOrganizationModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean,
  onClose: (orgName?: string) => void,
}) {
  const [orgName, setOrgName] = useState<string>('');

  return <Dialog as="div" className="relative" open={isOpen} onClose={() => onClose(orgName)}>
    <div className="fixed z-40 inset-0 bg-black bg-opacity-25 dark:bg-opacity-50" />
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Dialog.Panel className="w-2xl h-2xl transform rounded-2xl bg-white dark:bg-slate-800 p-6 text-left align-middle shadow-xl transition-all">
            <Dialog.Title as="h2"
              className="mb-4 text-lg font-medium leading-6 text-gray-900 dark:text-white"
            >
              Create new Organizatiom
            </Dialog.Title>

            <div className="mt-2 text-black">
              <div className='w-96'>
                <InputField name={'organization-name'} label={'Organization Name'} onValue={setOrgName} type={'text'} value={orgName} placeholder='Organization Name' />
              </div>
            </div>

            <div className="mt-8 text-black text-right">
              <Button type='cancel' onClick={() => onClose()}>Cancel</Button>
              <Button type='confirm' onClick={() => onClose(orgName)}>Create</Button>
            </div>
          </Dialog.Panel>
      </div>
    </div>
  </Dialog>;
}
