'use client';

import React, { useEffect, useState } from 'react';
import { Button, InputField, Modal, Select } from '@locale-hub/design-system';
import { Organization, Project, User } from '@locale-hub/data';
import { ApiConnector } from '@locale-hub/api-connector';


export default function OrganizationsSettingsPage({
  params
}: {
  params: { organizationId: string }
}) {
  const [org, setOrg] = useState<Organization>();
  const [name, setName] = useState('');
  const [owner, setOwner] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    ApiConnector.organizations.get(params.organizationId).then(data => {
      if ('error' in data) {
        // TODO Toast
        return;
      }
      setName(data.organization.name);
      setOwner(data.organization.owner);
      setOrg(data.organization);
    });
    ApiConnector.organizations.users(params.organizationId).then(data => {
      if ('error' in data) {
        // TODO Toast
        return;
      }
      setUsers(data.users);
    });
  }, []);

  const updateOrganization = () => {
    // TODO: form validation
    org.name = name;
    org.owner = owner;
    // TODO: Toast
    ApiConnector.organizations.update(org);
  }

  function deleteOrg() {
    // TODO: Toast
    ApiConnector.organizations.delete(org.id);
  }

  const [deleteModal, setDeleteModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<React.ReactNode>(null);
  const [actions, setActions] = useState<React.ReactNode>(null);
  const openDeletionModal = () => {
    setTitle('Are you sure?');
    setContent(<>
      <p>
        This action cannot be undone.<br/>
        This will permanently delete the <b className='text-warn'>{ org.name }</b> organization and all related content.
      </p>
    </>);
    setActions(<>
      <Button type='cancel' onClick={() => setDeleteModal(false)}>Cancel</Button>
      <Button type='confirm' onClick={deleteOrg}>I understand the consequences, delete this organization</Button>
    </>);
    setDeleteModal(true);
  };

  return <>
    <Modal isOpen={deleteModal} title={title} content={content} actions={actions} onClose={() => setDeleteModal(false)} />
    <div className='p-10 mt-16 w-3/4 m-auto rounded-md border border-slate-400/50'>
      <h1 className='text-lg font-bold'>Organization Information</h1>

      <div className="grid gap-4 mb-6 md:grid-cols-2 mt-4">
        <InputField name={'name'} label={'Name'} onValue={setName} type={'text'} value={name} placeholder='Organization name' />
        { users && <Select onSelect={(value) => setOwner(value.id)}
            label='Owner'
            defaultSelected={users.filter(u => u.id == owner)
              .map(user => ({ id: user.id, value: `${user.name} <${user.primaryEmail}>` }))[0]}
            values={users.map(user => ({ id: user.id, value: `${user.name} <${user.primaryEmail}>` }))}
        /> }
      </div>

      <div className='flex justify-end mt-8'>
        <Button type='action' onClick={updateOrganization}>Save</Button>
      </div>
    </div>

    <div className='px-10 py-10 w-3/4 mt-8 m-auto rounded-md border border-warn'>
      <h5 className='text-lg font-bold text-warn'>Danger Zone</h5>

      <div className='mt-8'>
        <span className='font-bold'>Delete organization?</span>
        <br/>
        <span className='-pt-4'>Once you delete an organization, there is no going back. Please be certain.</span>
        <div className='inline-block float-right -mt-5'>
          <Button type='cancel' onClick={openDeletionModal} >Delete</Button>
        </div>
      </div>
    </div>
  </>;
}