'use client';

import React, { useEffect, useState } from 'react';

import { ApiConnector } from '@locale-hub/api-connector';
import { routes } from '../../../constants/routes';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Table from '@locale-hub/design-system/table/table';
import DateFormat from '@locale-hub/design-system/date-format/date-format';
import { MeDashboardResponse } from '@locale-hub/data/responses/me-dashboard.response';

export default function OrganizationsPage() {
  const [data, setData] = useState<MeDashboardResponse>(null);

  useEffect(() => {
    ApiConnector.me.dashboard().then(data => {
      if ('error' in data) {
        toast.error('Failed to retrieve dashboard');
        return;
      }
      setData(data);
    })
  }, []);

  return <div className='px-10 py-10'>
    <Table
      className='w-6/12 mx-auto mt-12'
      heads={[
        { key: 'name', label: 'Project Name', className: 'w-3/4' },
        { key: 'createdAt', label: 'Creation Date', className: 'w-1/4' },
      ]}
      entries={data?.organizations.map(organization => ({
        name: <Link className='text-primary' href={routes.organizations.projects(organization.id)}>{organization.name}</Link>,
        createdAt: <DateFormat date={organization.createdAt} />
      })) ?? []}
    />
  </div>;
}
