import { Dialog } from '@headlessui/react';
import React, { useState } from 'react';
import { Organization } from '@locale-hub/data/models/organization.model';
import InputField from '@locale-hub/design-system/input-field/input-field';
import Button from '@locale-hub/design-system/button/button';
import Select from '@locale-hub/design-system/select/select';

export default function AddProjectModal({
  isOpen,
  onClose,
  organizations,
}: {
  isOpen: boolean;
  onClose: (orgId?: string, projectName?: string) => void;
  organizations: Organization[];
}) {
  const [projectName, setProjectName] = useState<string>('');
  const [orgId, setOrgId] = useState<string>('');

  return (
    <Dialog
      as="div"
      className="relative"
      open={isOpen}
      onClose={() => onClose(orgId, projectName)}
    >
      <div className="fixed z-40 inset-0 bg-black bg-opacity-25 dark:bg-opacity-50" />
      <div className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Dialog.Panel className="w-2xl h-2xl transform rounded-2xl bg-white dark:bg-slate-800 p-6 text-left align-middle shadow-xl transition-all">
            <Dialog.Title
              as="h2"
              className="mb-4 text-lg font-medium leading-6 text-gray-900 dark:text-white"
            >
              Create new Project
            </Dialog.Title>

            <div className="mt-2 text-black">
              <div className="w-96">
                <Select
                  label="Organization"
                  onSelect={(value) => setOrgId(value.id)}
                  defaultSelected={{
                    id: organizations[0].id,
                    value: organizations[0].name,
                  }}
                  values={organizations.map((org) => ({
                    id: org.id,
                    value: org.name,
                  }))}
                />
                <InputField
                  name={'project-name'}
                  label={'Project Name'}
                  onValue={setProjectName}
                  type={'text'}
                  value={projectName}
                  placeholder="Project Name"
                />
              </div>
            </div>

            <div className="mt-8 text-black text-right">
              <Button type="cancel" onClick={() => onClose()}>
                Cancel
              </Button>
              <Button
                type="confirm"
                onClick={() => onClose(orgId, projectName)}
              >
                Create
              </Button>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
