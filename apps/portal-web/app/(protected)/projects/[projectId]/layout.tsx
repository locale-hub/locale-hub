'use client';

import React from 'react';
import { Sidebar } from '@locale-hub/design-system';
import {
  AdjustmentsHorizontalIcon,
  ArrowsUpDownIcon,
  ArrowUpTrayIcon, DevicePhoneMobileIcon,
  HomeIcon,
  LanguageIcon,
  UsersIcon
} from '@heroicons/react/24/solid';
import { routes } from '../../../../constants/routes';

export default function ProjectLayout({
  children,
  params
}: {
  children: React.ReactNode,
  params: { projectId: string }
}) {
  const projectId = params.projectId;

  return <div className='flex height-full'>
    <div className='w-2/12 min-h-full'>
      <Sidebar data={[
        { name: 'Overview', link: routes.projects.overview(projectId), icon: <HomeIcon className='w-6 h-6' /> },
        { name: 'Translations', link: routes.projects.translations(projectId), icon: <LanguageIcon className='w-6 h-6' /> },
        { name: 'Import/Export', link: routes.projects.transfers(projectId), icon: <ArrowsUpDownIcon className='w-6 h-6' /> },
        { name: 'Users', link: routes.projects.users(projectId), icon: <UsersIcon className='w-6 h-6' /> },
        { name: 'Commits', link: routes.projects.commits.list(projectId), icon: <ArrowUpTrayIcon className='w-6 h-6' /> },
        { name: 'Apps', link: routes.projects.applications(projectId), icon: <DevicePhoneMobileIcon className='w-6 h-6' /> },
        { name: 'Settings', link: routes.projects.settings(projectId), icon: <AdjustmentsHorizontalIcon className='w-6 h-6' /> },
      ]} />
    </div>
    <div className='w-10/12 px-10 py-10 overflow-y-scroll'>
      {children}
    </div>
  </div>;
}
