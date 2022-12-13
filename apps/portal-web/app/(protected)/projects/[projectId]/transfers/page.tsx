'use client';

import React from 'react';
import { ApiConnector } from '@locale-hub/api-connector';
import toast from 'react-hot-toast';
import Button from '@locale-hub/design-system/button/button';
import { FileFormat } from '@locale-hub/data/enums/file-format.enum';


export default function ProjectTransfersPage({
  params
}: {
  params: { projectId: string }
}) {

  const download = (format: FileFormat) => {
    ApiConnector.projects.bundles.get(params.projectId, format).then((data) => {
      if ('error' in data) {
        toast.error('Failed to download bundle');
        return;
      }
      const blob = new Blob([data], {type: 'application/zip'});
      const url = window.URL.createObjectURL(blob);
      const pwa = window.open(url);
      if (!pwa || pwa.closed || typeof pwa.closed === 'undefined') {
        toast.error('Please disable your Pop-up blocker and try again.');
      }
    });
  };

  return <>
    <div className='p-10 mt-16 w-3/4 m-auto'>
      <div className='mb-12 p-8 rounded-md border border-slate-400/50'>
        <h1 className='mb-8 text-lg font-bold'>Exports</h1>
        <p className='text-sm'>Bundle containing all the translation files with the latest values</p>
        <div className='mt-6'>
          <Button type='confirm' onClick={() => download(FileFormat.ANDROID)}>Android</Button>
          <Button type='confirm' onClick={() => download(FileFormat.IOS)}>iOS</Button>
        </div>
      </div>
      <div className='mb-12 p-8 rounded-md border border-slate-400/50'>
        <h1 className='mb-8 text-lg font-bold'>Imports</h1>
        <p className='text-sm'>Coming soon...</p>
      </div>
    </div>
  </>;
}
