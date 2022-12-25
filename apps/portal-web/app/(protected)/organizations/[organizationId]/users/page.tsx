'use client';

import React, { useState } from 'react';
import { ApiConnector } from '@locale-hub/api-connector';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import InviteUserModal from './invite-user-modal';
import DeleteUserModal from '../../../../../components/delete-user-modal';
import toast from 'react-hot-toast';
import Table from '@locale-hub/design-system/table/table';
import Button from '@locale-hub/design-system/button/button';
import Menu from '@locale-hub/design-system/menu/menu';
import { User } from '@locale-hub/data/models/user.model';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hook';
import { organizationActions, selectOrganizationUsers } from '../../../../../redux/slices/organizationSlice';
import { EmailStatus } from '@locale-hub/data/enums/email-status.enum';

export default function OrganizationUsersPage({
  params,
}: {
  params: { organizationId: string };
}) {
  const dispatch = useAppDispatch();
  const [selectedUser, setSelectedUser] = useState<User>(null);
  const users = useAppSelector(selectOrganizationUsers);
  const [inviteUserModalOpen, setInviteUserModalOpen] = useState(false);
  const [deleteUserModalOpen, setDeleteUserModalOpen] = useState(false);

  const inviteUser = (name?: string, email?: string) => {
    setInviteUserModalOpen(false);
    if (undefined === name || undefined === email) {
      return;
    }
    ApiConnector.organizations.users
      .invite(params.organizationId, name, email)
      .then((data) => {
        if (null !== data) {
          toast.error('Failed to invite user');
          return;
        }
        toast.success('Success! We sent an invitation to the user');
        dispatch(organizationActions.userAdd({
          id: email,
          name,
          primaryEmail: email,
          passwordSalt: undefined,
          password: undefined,
          emails: [{ email, createdAt: '', status: EmailStatus.PRIMARY }],
          role: 'user',
          createdAt: '',
        }));
      });
  };

  const openDeleteModal = (user: User) => {
    setDeleteUserModalOpen(true);
    setSelectedUser(user);
  };

  const deleteUser = (shouldDelete: boolean) => {
    setDeleteUserModalOpen(false);
    if (false === shouldDelete) {
      return;
    }
    ApiConnector.organizations.users
      .delete(params.organizationId, selectedUser.id)
      .then((data) => {
        if (null !== data) {
          toast.error('Failed to delete user');
          return;
        }
        toast.success('User deleted!');
        dispatch(organizationActions.userRemove(users.find((u) => u.id !== selectedUser.id)));
        setSelectedUser(null);
      });
  };

  return (
    <div className="px-10 py-10 m-auto w-9/12 center">
      <InviteUserModal isOpen={inviteUserModalOpen} onClose={inviteUser} />
      <DeleteUserModal
        isOpen={deleteUserModalOpen}
        onClose={deleteUser}
        user={selectedUser}
      />
      <div className="flex justify-end">
        <Button type="action" onClick={() => setInviteUserModalOpen(true)}>
          Add user
        </Button>
      </div>
      <Table
        className="w-full mx-auto mt-12"
        heads={[
          { key: 'name', label: 'Project Name', className: 'w-6/12' },
          { key: 'email', label: 'Email', className: 'w-4/12' },
          { key: 'role', label: 'Role', className: 'w-1/12' },
          { key: 'actions', label: '', className: 'w-1/12' },
        ]}
        entries={
          users.map((user) => ({
            name: user.name,
            email: user.primaryEmail,
            role: user.role,
            actions: (
              <Menu
                onClick={() => openDeleteModal(user)}
                button={
                  <EllipsisHorizontalIcon className="h-6 w-6 text-white" />
                }
              >
                <span className="text-warn">Delete</span>
              </Menu>
            ),
          })) ?? []
        }
      />
    </div>
  );
}
