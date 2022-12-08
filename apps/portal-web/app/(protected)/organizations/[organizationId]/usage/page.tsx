'use client';

import React, { useEffect, useState } from 'react';
import { ApiConnector } from '@locale-hub/api-connector';
import { OrganizationApiUsage, OrganizationStorageUsage } from '@locale-hub/data';
import { ProgressBar, Spacer } from '@locale-hub/design-system';

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
      console.log(data.usage.storage);
    });
  }, []);

  return <div className='px-10 py-10'>
    <div className='p-10 mt-16 w-3/4 m-auto rounded-md border border-slate-400/50'>
      <h1 className='text-lg font-bold'>Storage usage</h1>

      <div className="mb-6 mt-4 p-8">
        { storage && <div>
            <p className='flex'>
              <span>Organization global storage</span>
              <Spacer />
              <span>
                <span className='text-gray-400'>
                  {storage.size.toFixed(0)}
                  <span className='px-1'>/</span>
                  {storage.max} KB
                </span>
                <span className='px-4'>|</span>
                { (storage.size / storage.max * 100).toFixed(0) }
                %
              </span>
            </p>
            <ProgressBar fill={storage.size / storage.max * 100} />
          </div>
        }

        <div className='pt-8'>
          { storage && storage.projects.map((project, idx) => <div key={idx}>
            <p className='flex'>
              <span>{project.name}'s storage usage</span>
              <Spacer />
              <span>
                <span className='text-gray-400'>
                  {project.size.toFixed(0)}
                  <span className='px-1'>/</span>
                  {project.max} KB
                </span>
                <span className='px-4'>|</span>
                { (project.size / project.max * 100).toFixed(0) }
                %
              </span>
            </p>
            <ProgressBar fill={project.size / project.max * 100} />
          </div>) }
        </div>
      </div>
    </div>
  </div>;
}