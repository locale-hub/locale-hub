'use client';

import { useEffect, useState } from 'react';

import { ApiConnector } from '@locale-hub/api-connector';
import { MeDashboardResponse, Project } from '@locale-hub/data';
import { DateFormat, Menu, Table } from '@locale-hub/design-system';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { routes } from '../../../constants/routes';
import ProgressBar from '../../../../../libs/design-system/src/lib/progress-bar/progress-bar';

export default function DashboardPage() {
  const [data, setData] = useState<MeDashboardResponse>(null);

  useEffect(() => {
    ApiConnector.me.dashboard().then(data => {
      if ('error' in data) {
        // TODO display error message
        return;
      }
      setData(data);
    })
  }, []);

  // TODO: Actions modals
  // TODO: Theming

  const projectName = (project: Project) => {
    const organizationName = data.organizations.find(org => org.id === project.organizationId).name;
    return <>
      <Link className='text-primary' href={`${routes.organizations}/${project.organizationId}`}>{organizationName}</Link>
      <span className='px-1'>/</span>
      <Link className='text-primary' href={`${routes.projects}/${project.id}`}>{project.name}</Link>
    </>;
  }
  const projectProgress = (projectId: string) => {
    const progress = 100 * data.progress.find(project => project.projectId === projectId).progress;
    return <ProgressBar fill={progress} />;
  }

  return <Table
      className='w-7/12 mx-auto mt-12'
      heads={[
        { key: 'name', label: 'Project Name', className: 'w-7/12' },
        { key: 'status', label: 'Status', className: 'w-2/12' },
        { key: 'createdAt', label: 'Creation Date', className: 'w-2/12' },
        { key: 'actions', label: 'Actions', className: 'w-1/12' }
      ]}
      entries={data?.projects.map(project => ({
        name: projectName(project),
        status: projectProgress(project.id),
        createdAt: <DateFormat date={project.createdAt} />,
        actions: <Menu button={<EllipsisHorizontalIcon className='h-6 w-6 text-white' />}>
          <span className='text-warn'>Delete</span>
        </Menu>
      })) ?? []}
    />;
}
