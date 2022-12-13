'use client';

import React, { useEffect, useState } from 'react';
import { ApiConnector } from '@locale-hub/api-connector';
import toast from 'react-hot-toast';
import { Commit } from '@locale-hub/data/models/commit.model';
import Table from '@locale-hub/design-system/table/table';
import DateFormat from '@locale-hub/design-system/date-format/date-format';

export default function ProjectCommitDetailsPage({
  params
}: {
  params: { projectId: string, commitId: string }
}) {
  const [commit, setCommit] = useState<Commit>();

  useEffect(() => {
    ApiConnector.projects.commits.get(params.projectId, params.commitId).then(data => {
      if ('error' in data) {
        toast.error('Failed to retrieve commit');
        return;
      }
      setCommit(data.commit);
    });
  }, [params.projectId, params.commitId]);

  return <div className='px-10 py-10 m-auto w-full center'>
    { commit && <>
      <div className='flex'>
        <h1 className='text-2xl font-bold'>{commit.title}</h1>
        <p className='ml-4 mt-1 text-slate-600 dark:text-slate-400'>
          <span className='px-2'>committed on</span>
          <DateFormat date={commit.createdAt} />
        </p>
      </div>
      { commit.description && <p>{commit.description}</p> }
      <Table
        className='mt-4'
        heads={[
          { key: 'locale', label: 'Status', className: 'w-1/12' },
          { key: 'key', label: 'Key', className: 'w-3/12' },
          { key: 'value', label: 'Preview', className: 'w-8/12' }
        ]}
        entries={commit.changeList.locales.flatMap(locale =>
          commit.changeList.keys.map(key => ({
            locale,
            key,
            value: commit.changeList.manifest[locale][key]
          }))
        )}
      />
    </> }
  </div>;
}
