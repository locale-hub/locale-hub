import { Dialog } from '@headlessui/react';
import React, { useState } from 'react';
import Button from '@locale-hub/design-system/button/button';
import Select from '@locale-hub/design-system/select/select';
import { User } from '@locale-hub/data/models/user.model';

export default function AddUserModal({
  isOpen,
  onClose,
  users,
}: {
  isOpen: boolean;
  onClose: (userId?: string) => void;
  users: User[];
}) {
  const [userId, setUserId] = useState<string>(0!== users.length ? users[0].id : null);

  if (undefined === users || null === users || 0 === users.length) {
    return <></>;
  }

  return (
    <Dialog
      as="div"
      className="relative"
      open={isOpen}
      onClose={() => onClose()}
    >
      <div className="fixed z-40 inset-0 bg-black bg-opacity-25 dark:bg-opacity-50" />
      <div className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Dialog.Panel className="w-2xl h-2xl transform rounded-2xl bg-white dark:bg-slate-800 p-6 text-left align-middle shadow-xl transition-all">
            <Dialog.Title
              as="h2"
              className="mb-4 text-lg font-medium leading-6 text-gray-900 dark:text-white"
            >
              Add a user
            </Dialog.Title>

            <div className="mt-2 text-black">
              <div className="w-96">
                <Select
                  onSelect={(value) => setUserId(value.id)}
                  label="User"
                  defaultSelected={{
                    id: users[0].id,
                    value: `${users[0].name} <${users[0].primaryEmail}>`,
                  }}
                  values={users.map((user) => ({
                    id: user.id,
                    value: `${user.name} <${user.primaryEmail}>`,
                  }))}
                />
              </div>
            </div>

            <div className="mt-8 text-black text-right">
              <Button type="cancel" onClick={() => onClose()}>
                Cancel
              </Button>
              <Button type="confirm" onClick={() => onClose(userId)}>
                Add
              </Button>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
