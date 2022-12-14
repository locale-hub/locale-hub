'use client';

import React, { useEffect, useState } from 'react';
import { ApiConnector } from '@locale-hub/api-connector';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import DeleteUserModal from '../../../../../components/delete-user-modal';
import AddUserModal from './add-user-modal';
import toast from 'react-hot-toast';
import Table from '@locale-hub/design-system/table/table';
import Button from '@locale-hub/design-system/button/button';
import Menu from '@locale-hub/design-system/menu/menu';
import { User } from '@locale-hub/data/models/user.model';

export default function ProjectUsersPage({
  params,
}: {
  params: { projectId: string };
}) {
  const [selectedUser, setSelectedUser] = useState<User>(null);
  const [organizationUsers, setOrganizationUsers] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [inviteUserModalOpen, setInviteUserModalOpen] = useState(false);
  const [deleteUserModalOpen, setDeleteUserModalOpen] = useState(false);

  useEffect(() => {
    ApiConnector.projects.users.list(params.projectId).then((data) => {
      if ('error' in data) {
        toast.error('Failed to retrieve users');
        return;
      }
      setUsers(data.users);
    });
    ApiConnector.projects.get(params.projectId).then((data) => {
      if ('error' in data) {
        return;
      }
      ApiConnector.organizations.users
        .list(data.project.organizationId)
        .then((data2) => {
          if ('error' in data2) {
            return;
          }
          setOrganizationUsers(data2.users);
        });
    });
  }, [params.projectId]);

  const addUser = (userId: string) => {
    setInviteUserModalOpen(false);
    if (undefined === userId) {
      return;
    }
    ApiConnector.projects.users.add(params.projectId, userId).then((data) => {
      if ('error' in data) {
        toast.error('Failed to add user');
        return;
      }
      setUsers([...users, organizationUsers.find((u) => u.id === userId)]);
      toast.success('User added!');
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
    ApiConnector.projects.users
      .delete(params.projectId, selectedUser.id)
      .then((data) => {
        if ('error' in data) {
          toast.error('Failed to delete user');
          return;
        }
        setUsers(users.filter((u) => u.id !== selectedUser.id));
        setSelectedUser(null);
      });
  };

  return (
    <>
      <DeleteUserModal
        isOpen={deleteUserModalOpen}
        onClose={deleteUser}
        user={selectedUser}
      />
      <AddUserModal
        isOpen={inviteUserModalOpen}
        onClose={addUser}
        users={organizationUsers.filter(
          (ou) => false === users.map((pu) => pu.id).includes(ou.id)
        )}
      />
      <div className="px-10 py-10 m-auto w-9/12 center">
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
    </>
  );
}
