'use client';

import React, { useEffect, useState } from 'react';
import { ApiConnector } from '@locale-hub/api-connector';
import { Button, Menu, Table } from '@locale-hub/design-system';
import { OrganizationsUsersGetResponse } from '@locale-hub/data';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';

export default function OrganizationUsersPage({
  params
}: {
  params: { organizationId: string }
}) {
  const [data, setData] = useState<OrganizationsUsersGetResponse>(null);

  useEffect(() => {
    ApiConnector.organizations.users(params.organizationId).then(data => {
      if ('error' in data) {
        // TODO Toast
        return;
      }
      setData(data);
    })
  }, []);

  // TODO: Delete user modal
  // TODO: Invite user modal

  return <div className='px-10 py-10 m-auto w-9/12 center'>
    <div className='flex justify-end'>
      <Button type='action' onClick={() => {}} >Add user</Button>
    </div>
    <Table
      className='w-full mx-auto mt-12'
      heads={[
        { key: 'name', label: 'Project Name', className: 'w-6/12' },
        { key: 'email', label: 'Email', className: 'w-4/12' },
        { key: 'role', label: 'Role', className: 'w-1/12' },
        { key: 'actions', label: '', className: 'w-1/12' },
      ]}
      entries={data?.users.map((user) => ({
        name: user.name,
        email: user.primaryEmail,
        role: user.role,
        actions: <Menu
          onClick={() => {} }
          button={<EllipsisHorizontalIcon className='h-6 w-6 text-white' />}
          >
          <span className='text-warn'>Delete</span>
        </Menu>
      })) ?? []}
    />
  </div>;
}
