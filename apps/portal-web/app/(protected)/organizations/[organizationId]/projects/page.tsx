'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

import { routes } from '../../../../../constants/routes';
import { ApiConnector } from '@locale-hub/api-connector';
import { OrganizationsProjectsGetResponse } from '@locale-hub/data/responses/organizations-projects-get.response';
import ProgressBar from '@locale-hub/design-system/progress-bar/progress-bar';
import Table from '@locale-hub/design-system/table/table';
import DateFormat from '@locale-hub/design-system/date-format/date-format';

export default function OrganizationProjectsPage({
  params,
}: {
  params: { organizationId: string };
}) {
  const [data, setData] = useState<OrganizationsProjectsGetResponse>(null);

  useEffect(() => {
    ApiConnector.organizations.projects(params.organizationId).then((data) => {
      if ('error' in data) {
        toast.error('Failed to retrieve projects');
        return;
      }
      setData(data);
    });
  }, [params.organizationId]);

  const projectProgress = (projectId: string) => {
    const progress =
      100 *
      data.progress.find((project) => project.projectId === projectId).progress;
    return <ProgressBar fill={progress} />;
  };

  return (
    <div className="px-10 py-10">
      <Table
        className="w-9/12 mx-auto mt-12"
        heads={[
          { key: 'name', label: 'Project Name', className: 'w-7/12' },
          { key: 'status', label: 'Status', className: 'w-3/12' },
          { key: 'createdAt', label: 'Creation Date', className: 'w-2/12' },
        ]}
        entries={
          data?.projects.map((project) => ({
            name: (
              <Link
                className="text-primary"
                href={routes.projects.overview(project.id)}
              >
                {project.name}
              </Link>
            ),
            status: projectProgress(project.id),
            createdAt: <DateFormat date={project.createdAt} />,
          })) ?? []
        }
      />
    </div>
  );
}
