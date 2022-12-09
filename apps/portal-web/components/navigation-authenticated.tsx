'use client';

import React, { useEffect, useState } from 'react';
import { BellAlertIcon, DocumentTextIcon, PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

import { routes } from '../constants/routes';
import { SlideOver, Spacer, UserIcon } from '@locale-hub/design-system';
import { useAuth } from '../contexts/AuthContext';
import { ApiConnector } from '@locale-hub/api-connector';
import { Notification, NotificationStatus } from '@locale-hub/data';
import NotificationCard from './notification-card';

export default function NavigationAuthenticated() {
  const { user, logout } = useAuth();
  const [openNotifications, setOpenNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    ApiConnector.notifications.list().then(data => {
      if ('error' in data) {
        // TODO: Toast
        return;
      }
      setNotifications(data.notifications);
    });
  }, []);

  const onArchive = (notificationId: string) => {
    ApiConnector.notifications.discard(notificationId).then(data => {
      if ('error' in data) {
        // TODO: Toast
        return;
      }
      setNotifications(notifications.filter(n => n.id !== notificationId));
    });
  };

  return <>
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
    <PlusIcon className='mx-2 h-6 w-6 hover:cursor-pointer' />
    <UserIcon name={user?.name} className='ml-3'>
      <Link href={routes.profiles.me} className='bg-gray-100 block px-4 py-2 text-black hover:cursor-pointer hover:bg-slate-200'>Profile</Link>
      <a onClick={logout} className='bg-gray-100 block px-4 py-2 text-warn hover:cursor-pointer hover:bg-slate-200'>Logout</a>
    </UserIcon>
  </>;
}
