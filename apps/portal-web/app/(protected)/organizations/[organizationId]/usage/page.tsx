'use client';

import React, { useEffect, useState } from 'react';
import { ApiConnector } from '@locale-hub/api-connector';
import { OrganizationApiUsage, OrganizationStorageUsage } from '@locale-hub/data';
import { ProgressBar } from '@locale-hub/design-system';

export default function OrganizationUsagePage({
  params
}: {
  params: { organizationId: string }
}) {
  const [storage, setStorage] = useState<OrganizationStorageUsage>();
  const [apiUsage, setApiUsage] = useState<OrganizationApiUsage>();

  useEffect(() => {
    ApiConnector.organizations.usage(params.organizationId).then(data => {
      if ('error' in data) {
        // TODO Toast
        return;
      }
      setStorage(data.usage.storage);
      setApiUsage(data.usage.api);
    });
  }, []);

  return <div className='px-10 py-10'>
    <div className='p-10 mt-16 w-3/4 m-auto rounded-md border border-slate-400/50'>
      <h1 className='text-lg font-bold'>Storage usage</h1>

      <div className="grid gap-4 mb-6 md:grid-cols-2 mt-4">

        <div>
          api
        </div>
        <div>
          { storage && storage.projects.map((project, idx) => <div key={idx}>
            <p>
              {project.name}
              {project.size.toFixed(0)} / {project.max}kb | {project.size / project.max * 100}%
            </p>
            <ProgressBar fill={project.size / project.max * 100} />
          </div>) }
        </div>
      </div>
    </div>
  </div>;
}
