import { Dialog } from '@headlessui/react';
import React, { useEffect, useState } from 'react';
import InputField from '@locale-hub/design-system/input-field/input-field';
import Button from '@locale-hub/design-system/button/button';

export default function TranslationModal({
  isOpen,
  onClose,
  entry
}: {
  isOpen: boolean,
  entry: { locale: string, key: string, value: string },
  onClose: (entry?: { locale: string, key: string, value: string }) => void,
}) {
  const [innerEntry, setInnerEntry] = useState(entry);

  useEffect(() => {
    setInnerEntry(entry);
  }, [entry]);

  return <Dialog as="div" className="relative" open={isOpen} onClose={() => onClose(innerEntry)}>
    <div className="fixed z-40 inset-0 bg-black bg-opacity-25 dark:bg-opacity-50" />
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Dialog.Panel className="max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 text-left align-middle shadow-xl transition-all">
            <Dialog.Title as="h2"
              className="mb-4 text-lg font-medium leading-6 text-gray-900 dark:text-white"
            >
              {entry?.key}
            </Dialog.Title>
            <div className="mt-2 text-black">
              <div className='w-96'>
                <InputField name={'value'} label={'Value'} type={'text'} placeholder='Value'
                    onValue={(v) => setInnerEntry({ ...innerEntry, value: v })}
                    value={innerEntry?.value}
                />
              </div>
            </div>

            <div className="mt-8 text-black text-right">
              <Button type='cancel' onClick={() => onClose()}>Cancel</Button>
              <Button type='confirm' onClick={() => onClose(innerEntry)}>Save</Button>
            </div>
          </Dialog.Panel>
      </div>
    </div>
  </Dialog>;
}
