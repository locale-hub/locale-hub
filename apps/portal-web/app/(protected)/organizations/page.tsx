'use client';

import React, { useEffect, useState } from 'react';

import { ApiConnector } from '@locale-hub/api-connector';
import { MeDashboardResponse, } from '@locale-hub/data';
import { DateFormat, Table } from '@locale-hub/design-system';
import { routes } from '../../../constants/routes';
import Link from 'next/link';

export default function OrganizationsPage() {
  const [data, setData] = useState<MeDashboardResponse>(null);

  useEffect(() => {
    ApiConnector.me.dashboard().then(data => {
      if ('error' in data) {
        // TODO Toast
        return;
      }
      setData(data);
    })
  }, []);

  return <Table
    className='w-6/12 mx-auto mt-12'
    heads={[
      { key: 'name', label: 'Project Name', className: 'w-3/4' },
      { key: 'createdAt', label: 'Creation Date', className: 'w-1/4' },
    ]}
    entries={data?.organizations.map(organization => ({
      name: <Link className='text-primary' href={`${routes.organizations}/${organization.id}`}>{organization.name}</Link>,
      createdAt: <DateFormat date={organization.createdAt} />
    })) ?? []}
  />;
}
