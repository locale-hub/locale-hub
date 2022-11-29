'use client';

import React, { useEffect, useState } from 'react';
import { Button, InputField, Select } from '@locale-hub/design-system';
import { User } from '@locale-hub/data';
import { ApiConnector } from '@locale-hub/api-connector';


export default function OrganizationsSettingsPage({
  params
}: {
  params: { organizationId: string }
}) {
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
    });
    ApiConnector.organizations.users(params.organizationId).then(data => {
      if ('error' in data) {
        // TODO Toast
        return;
      }
      setUsers(data.users);
    });
  }, []);

  return <>
    <div className='p-10 mt-16 w-3/4 m-auto rounded-md border border-slate-400/50'>
      <h1 className='text-lg font-bold'>Organization Information</h1>

      <div className="grid gap-4 mb-6 md:grid-cols-2 mt-4">
        <InputField name={'name'} label={'Name'} onValue={setName} type={'text'} value={name} placeholder='Organization name' />
        { users && <Select onSelect={(value) => setOwner(value.id)}
            label='Owner'
            defaultSelected={owner}
            values={users.map(user => ({ id: user.id, value: `${user.name} <${user.primaryEmail}>` }))}
        /> }
      </div>

      <div className='flex justify-end mt-8'>
        <Button type='action' onClick={() => {}} >Save</Button>
      </div>
    </div>

    <div className='px-10 py-10 w-3/4 mt-8 m-auto rounded-md border border-warn'>
      <h5 className='text-lg font-bold text-warn'>Danger Zone</h5>

      <div className='mt-8'>
        <span className='font-bold'>Delete organization?</span>
        <br/>
        <span className='-pt-4'>Once you delete an organization, there is no going back. Please be certain.</span>
        <div className='inline-block float-right -mt-5'>
          <Button type='cancel' onClick={() => {}} >Delete</Button>
        </div>
      </div>
    </div>
  </>;
}
