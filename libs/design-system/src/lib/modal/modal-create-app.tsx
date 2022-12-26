import { Dialog } from '@headlessui/react';
import React, { useState } from 'react';
import InputField from '../input-field/input-field';
import Button from '../button/button';

export default function ModalCreateApp({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: (app?: { name: string; identifier: string }) => void;
}) {
  const [app, setApp] = useState<{ name: string; identifier: string }>({
    name: '',
    identifier: '',
  });

  const setAppName = (value: string) => setApp({ ...app, name: value });
  const setAppId = (value: string) => setApp({ ...app, identifier: value });

  return (
    <>
      {isOpen && (
        <div className="fixed z-40 inset-0 bg-black bg-opacity-25 dark:bg-opacity-50" />
      )}
      <Dialog
        as="div"
        className="relative z-50 "
        open={isOpen}
        onClose={() => onClose()}
      >
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Dialog.Panel className="max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title
                as="h2"
                className="mb-4 text-lg font-medium leading-6 text-gray-900 dark:text-white"
              >
                Create a new app
              </Dialog.Title>
              <div className="mt-2 text-black">
                <div className="w-96">
                  <InputField
                    name={'name'}
                    label={'Name'}
                    onValue={setAppName}
                    type={'text'}
                    value={app.name}
                    placeholder="Name"
                  />
                  <InputField
                    name={'identifier'}
                    label={'Identifier'}
                    onValue={setAppId}
                    type={'text'}
                    value={app.identifier}
                    placeholder="Identifier"
                  />
                </div>
              </div>

              <div className="mt-8 text-black text-right">
                <Button type="cancel" onClick={() => onClose()}>
                  Cancel
                </Button>
                <Button type="confirm"
                  disabled={app.name.length < 8 || app.identifier.length < 8}
                  onClick={() => onClose(app)}
                >
                  Create
                </Button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
