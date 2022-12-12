'use client';

import React, { useEffect, useState } from 'react';
import { ApiConnector } from '@locale-hub/api-connector';
import { Button, Menu, Table } from '@locale-hub/design-system';
import { EmailStatus, User } from '@locale-hub/data';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import InviteUserModal from './invite-user-modal';
import DeleteUserModal from '../../../../../components/delete-user-modal';

export default function OrganizationUsersPage({
  params
}: {
  params: { organizationId: string }
}) {
  const [selectedUser, setSelectedUser] = useState<User>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [inviteUserModalOpen, setInviteUserModalOpen] = useState(false);
  const [deleteUserModalOpen, setDeleteUserModalOpen] = useState(false);

  useEffect(() => {
    ApiConnector.organizations.users.list(params.organizationId).then(data => {
      if ('error' in data) {
        // TODO Toast
        return;
      }
      setUsers(data.users);
    })
  }, [params.organizationId]);

  const inviteUser = (name?: string, email?: string) => {
    setInviteUserModalOpen(false);
    if (undefined === name || undefined === email) {
      return;
    }
    ApiConnector.organizations.users.invite(params.organizationId, name, email).then((data) => {
      if ('error' in data) {
        // TODO: Toast
        return;
      }
      setUsers([
        ...users,
        { id: email, name, primaryEmail: email, organizationId: params.organizationId,
          password: undefined, emails: [{email, createdAt: '', status: EmailStatus.PRIMARY }], role: 'user', createdAt: ''}
      ])
    });
  };

  const openDeleteModal = (user: User) => {
    setDeleteUserModalOpen(true);
    setSelectedUser(user);
  }

  const deleteUser = (shouldDelete: boolean) => {
    setDeleteUserModalOpen(false);
    if (false === shouldDelete) {
      return;
    }
    ApiConnector.organizations.users.delete(params.organizationId, selectedUser.id).then((data) => {
      if ('error' in data) {
        // TODO: Toast
        return;
      }
      setUsers(users.filter(u => u.id !== selectedUser.id));
      setSelectedUser(null);
    })
  }

  return <div className='px-10 py-10 m-auto w-9/12 center'>
    <InviteUserModal isOpen={inviteUserModalOpen} onClose={inviteUser} />
    <DeleteUserModal isOpen={deleteUserModalOpen} onClose={deleteUser} user={selectedUser} />
    <div className='flex justify-end'>
      <Button type='action' onClick={() => setInviteUserModalOpen(true)} >Add user</Button>
    </div>
    <Table
      className='w-full mx-auto mt-12'
      heads={[
        { key: 'name', label: 'Project Name', className: 'w-6/12' },
        { key: 'email', label: 'Email', className: 'w-4/12' },
        { key: 'role', label: 'Role', className: 'w-1/12' },
        { key: 'actions', label: '', className: 'w-1/12' },
      ]}
      entries={users.map((user) => ({
        name: user.name,
        email: user.primaryEmail,
        role: user.role,
        actions: <Menu
          onClick={() => openDeleteModal(user) }
          button={<EllipsisHorizontalIcon className='h-6 w-6 text-white' />}
          >
          <span className='text-warn'>Delete</span>
        </Menu>
      })) ?? []}
    />
  </div>;
}
