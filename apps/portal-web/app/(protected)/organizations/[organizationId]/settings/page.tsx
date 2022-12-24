'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { redirect } from 'next/navigation';
import Joi from 'joi';

import { ApiConnector } from '@locale-hub/api-connector';
import { routes } from '../../../../../constants/routes';
import Button from '@locale-hub/design-system/button/button';
import Modal from '@locale-hub/design-system/modal/modal';
import InputField from '@locale-hub/design-system/input-field/input-field';
import Select from '@locale-hub/design-system/select/select';
import { useAppSelector } from '../../../../../redux/hook';
import { selectOrganizationDetails, selectOrganizationUsers } from '../../../../../redux/slices/organizationSlice';

const schema = Joi.object({
  name: Joi.string().min(4).required(),
}).required();

export default function OrganizationsSettingsPage() {
  const org = useAppSelector(selectOrganizationDetails);
  const users = useAppSelector(selectOrganizationUsers);
  const [name, setName] = useState(org.name);
  const [owner, setOwner] = useState(org.owner);

  const formInvalid = () => 'error' in schema.validate({ name });

  const updateOrganization = () => {
    org.name = name;
    org.owner = owner;
    ApiConnector.organizations.update(org).then((data) => {
      if ('error' in data) {
        toast.error('Failed to update organization');
        return;
      }
      toast.success('Organization updated!');
    });
  };

  function deleteOrg() {
    ApiConnector.organizations.delete(org.id).then((data) => {
      if ('error' in data) {
        toast.error('Failed to delete organization');
        return;
      }
      toast.success('Organization deleted!');
      redirect(routes.organizations.root);
    });
  }

  const [deleteModal, setDeleteModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<React.ReactNode>(null);
  const [actions, setActions] = useState<React.ReactNode>(null);
  const openDeletionModal = () => {
    setTitle('Are you sure?');
    setContent(
      <>
        <p>
          This action cannot be undone.
          <br />
          This will permanently delete the{' '}
          <b className="text-warn">{org.name}</b> organization and all related
          content.
        </p>
      </>
    );
    setActions(
      <>
        <Button type="cancel" onClick={() => setDeleteModal(false)}>
          Cancel
        </Button>
        <Button type="confirm" onClick={deleteOrg}>
          I understand the consequences, delete this organization
        </Button>
      </>
    );
    setDeleteModal(true);
  };

  return (
    <>
      <Modal
        isOpen={deleteModal}
        title={title}
        content={content}
        actions={actions}
        onClose={() => setDeleteModal(false)}
      />
      <div className="p-10 mt-16 w-3/4 m-auto rounded-md border border-slate-400/50">
        <h1 className="text-lg font-bold">Organization Information</h1>

        <div className="grid gap-4 mb-6 md:grid-cols-2 mt-4">
          <InputField
            name={'name'}
            label={'Name'}
            onValue={setName}
            type={'text'}
            value={name}
            placeholder="Organization name"
          />
          {users && (
            <Select
              onSelect={(value) => setOwner(value.id)}
              label="Owner"
              defaultSelected={
                users
                  .filter((u) => u.id == owner)
                  .map((user) => ({
                    id: user.id,
                    value: `${user.name} <${user.primaryEmail}>`,
                  }))[0]
              }
              values={users.map((user) => ({
                id: user.id,
                value: `${user.name} <${user.primaryEmail}>`,
              }))}
            />
          )}
        </div>

        <div className="flex justify-end mt-8">
          <Button
            type="action"
            onClick={updateOrganization}
            disabled={formInvalid()}
          >
            Save
          </Button>
        </div>
      </div>

      <div className="px-10 py-10 w-3/4 mt-8 m-auto rounded-md border border-warn">
        <h5 className="text-lg font-bold text-warn">Danger Zone</h5>

        <div className="mt-8">
          <span className="font-bold">Delete organization?</span>
          <br />
          <span className="-pt-4">
            Once you delete an organization, there is no going back. Please be
            certain.
          </span>
          <div className="inline-block float-right -mt-5">
            <Button type="cancel" onClick={openDeletionModal}>
              Delete
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
