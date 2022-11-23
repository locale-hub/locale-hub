'use client';

import { useEffect, useState } from 'react';

import { ApiConnector } from '@locale-hub/api-connector';
import { MeDashboardResponse } from '@locale-hub/data';
import { DateFormat, Table } from '@locale-hub/design-system';

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

  // TODO: columns width
  // TODO: `org / projects`
  // TODO: actions
  // TODO: links to org and project

  return <Table
      className='w-8/12 mx-auto mt-12'
      heads={[
        { key: 'name', label: 'Project Name' },
        { key: 'status', label: 'Status' },
        { key: 'createdAt', label: 'Creation Date' },
        { key: 'actions', label: '' }
      ]}
      entries={data?.projects.map(project => ({
        name: project.name,
        status: '1%',
        createdAt: <DateFormat date={project.createdAt} />,
        actions: <div className='text-right'>actions</div>
      })) ?? []}
    />;
}
