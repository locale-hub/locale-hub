'use client';

import React, { useEffect, useState } from 'react';
import { BellAlertIcon, DocumentTextIcon, PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

import { routes } from '../constants/routes';
import { SlideOver, Spacer, UserIcon } from '@locale-hub/design-system';
import { useAuth } from '../contexts/AuthContext';
import { ApiConnector } from '@locale-hub/api-connector';
import { Notification, NotificationStatus, Organization } from '@locale-hub/data';
import NotificationCard from './notification-card';
import { Menu } from '@headlessui/react';
import AddProjectModal from './add-project-modal';
import AddOrganizationModal from './add-organization-modal';
import toast from 'react-hot-toast';
import { redirect } from 'next/navigation';

export default function NavigationAuthenticated() {
  const { user, logout } = useAuth();
  const [openNotifications, setOpenNotifications] = useState(false);
  const [openAddProject, setOpenAddProject] = useState(false);
  const [openAddOrganization, setOpenAddOrganization] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  useEffect(() => {
    ApiConnector.notifications.list().then(data => {
      if ('error' in data) {
        toast.error('Failed to retrieve notifications');
        return;
      }
      setNotifications(data.notifications);
    });
    ApiConnector.organizations.list().then(data => {
      if ('error' in data) {
        toast.error('Failed to retrieve organizations');
        return;
      }
      setOrganizations(data.organizations);
    });
  }, []);

  const onArchive = (notificationId: string) => {
    ApiConnector.notifications.discard(notificationId).then(data => {
      if ('error' in data) {
        toast.error('Failed to archive notification');
        return;
      }
      setNotifications(notifications.filter(n => n.id !== notificationId));
    });
  };

  const onProjectAdd = (orgId: string, projectName: string) => {
    setOpenAddProject(false);
    if (undefined === orgId || undefined === projectName) {
      return;
    }
    ApiConnector.projects.post(orgId, projectName, 'en').then(data => {
      if ('error' in data) {
        toast.error('Failed to create project');
        return;
      }
      toast.success(`'${data.project.name}' was created successfully`);
      redirect(routes.projects.overview(data.project.id));
    });
  }
  const onOrganizationAdd = (orgName: string) => {
    setOpenAddOrganization(false);
    if (undefined === orgName) {
      return;
    }
    ApiConnector.organizations.post(orgName).then(data => {
      if ('error' in data) {
        toast.error('Failed to create organization');
        return;
      }
      toast.success(`'${data.organization.name}' was created successfully`);
      redirect(routes.organizations.projects(data.organization.id));
    });
  }

  return <>
    { 0 !== organizations.length &&
      <AddProjectModal isOpen={openAddProject} onClose={onProjectAdd} organizations={organizations} />
    }
    <AddOrganizationModal isOpen={openAddOrganization} onClose={onOrganizationAdd} />
    <SlideOver isOpen={openNotifications}
       onClose={() => setOpenNotifications(false)}
       title='Notifications'
    >
      { notifications.filter(n => NotificationStatus.UNREAD === n.status).map((notification) =>
        <NotificationCard key={notification.id}
          notification={notification}
          onArchive={() => onArchive(notification.id)}
        />)
      }
    </SlideOver>

    <Link href={routes.organizations.root} className='px-4'>Organizations</Link>
    <Link href={routes.projects.root} className='px-4'>Projects</Link>
    <Spacer />

    <DocumentTextIcon className='mx-2 h-6 w-6 hover:cursor-pointer' />

    <div className='relative hover:cursor-pointer'
         onClick={() => setOpenNotifications(!openNotifications)}>
      <div className="inline-flex absolute -top-2 right-0 justify-center items-center w-5 h-5 text-xs font-bold rounded-full bg-primary">
        { notifications.filter(n => NotificationStatus.UNREAD === n.status).length }
      </div>
      <BellAlertIcon className='mx-2 h-6 w-6' />
    </div>

    <Menu as="div" className={`relative`}>
      <Menu.Button className="flex max-w-xs m-auto items-center">
        <span className="sr-only">Open add menu</span>
        <PlusIcon className='mx-2 h-6 w-6 hover:cursor-pointer' />
      </Menu.Button>
      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md rounded-md py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <a onClick={() => setOpenAddProject(true)} className='bg-gray-100 block px-4 py-2 text-black hover:cursor-pointer hover:bg-slate-200'>
          Project
        </a>
        <a onClick={() => setOpenAddOrganization(true)} className='bg-gray-100 block px-4 py-2 text-black hover:cursor-pointer hover:bg-slate-200'>
          Organization
        </a>
      </Menu.Items>
    </Menu>

    <UserIcon name={user?.name} className='ml-3'>
      <Link href={routes.profiles.me} className='bg-gray-100 block px-4 py-2 text-black hover:cursor-pointer hover:bg-slate-200'>Profile</Link>
      <a onClick={logout} className='bg-gray-100 block px-4 py-2 text-warn hover:cursor-pointer hover:bg-slate-200'>Logout</a>
    </UserIcon>
  </>;
}
