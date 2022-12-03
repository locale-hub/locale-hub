'use client';

import React, { useEffect, useState } from 'react';
import { Button, InputField, Modal, Spacer } from '@locale-hub/design-system';
import { ApiConnector } from '@locale-hub/api-connector';
import { App } from '@locale-hub/data';
import { DocumentDuplicateIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function ProjectApplicationsPage({
  params
}: {
  params: { projectId: string }
}) {
  const [apps, setApps] = useState<App[]>();
  const [newApp, setNewApp] = useState<{ name: string, identifier: string }>({ name: '', identifier: '' })

  useEffect(() => {
    ApiConnector.projects.applications.list(params.projectId).then(data => {
      if ('error' in data) {
        // TODO Toast
        return;
      }
      setApps(data.applications);
    });
  }, []);

  const createApp = async () => {
    setAppModal(false);
    ApiConnector.projects.applications.create(params.projectId, newApp.name, newApp.identifier).then((data) => {
      if ('error' in data) {
        // TODO Toast
        return;
      }
      setApps([
        ...apps,
        data.application
      ]);
    });
  }
  const deleteApp = async (appId: string) => {
    setAppModal(false);
    ApiConnector.projects.applications.delete(params.projectId, appId).then(() => {
      setApps(apps.filter(app => app.id !== appId));
    });
  }

  const [appModal, setAppModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<React.ReactNode>(null);
  const [actions, setActions] = useState<React.ReactNode>(null);
  const openNewModal = () => {
    // TODO: set not applying as expected
    const setNewAppName = (value: string) => setNewApp({ ...newApp, name: value });
    const setNewAppId = (value: string) => setNewApp({ ...newApp, identifier: value });

    setTitle('Create a new app');
    setContent(<div className='w-96'>
      <InputField name={'name'} label={'Name'} onValue={setNewAppName} type={'text'} value={newApp.name} placeholder='Name' />
      <InputField name={'identifier'} label={'Identifier'} onValue={setNewAppId} type={'text'} value={newApp.identifier} placeholder='Identifier' />
    </div>);
    setActions(<>
      <Button type='cancel' onClick={() => setAppModal(false)}>Cancel</Button>
      <Button type='confirm' onClick={createApp}>Create</Button>
    </>);
    setAppModal(true);
  };
  const openDeleteModal = (appId: string) => {
    setTitle('Are you sure?');
    setContent(<>
      <p>
        This action cannot be undone.<br />
        This will permanently delete the postman app and all the APIs access with the app key will be blocked.
      </p>
    </>);
    setActions(<>
      <Button type='cancel' onClick={() => setAppModal(false)}>Cancel</Button>
      <Button type='confirm' onClick={() => deleteApp(appId)}>I understand the consequences, delete this app</Button>
    </>);
    setAppModal(true);
  };

  return <div className='px-10 py-10 m-auto w-3/4 center'>
    <Modal isOpen={appModal} title={title} content={content} actions={actions} onClose={() => setAppModal(false)} />

    <div className='flex mt-32'>
      <div className="inline-flex rounded-md" role="group">
        <button disabled={true} className="px-6 w-32 text-sm font-medium dark:bg-dark rounded-l-md border border-slate-400/50">
          Project ID
        </button>
        <button disabled={true} className="truncate px-6 w-96 text-sm font-medium bg-white border-t border-b border-slate-400/50 dark:bg-gray-700">
          { params.projectId }
        </button>
        <button type="button" onClick={() => navigator.clipboard.writeText(params.projectId)}
                className="py-2 px-4 text-sm font-medium bg-white rounded-r-md border border-slate-400/50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600">
          <DocumentDuplicateIcon className='w-4 h-4' />
        </button>
      </div>
      <Spacer />
      <span className='ml-2 mt-2'>
        <Button type='confirm' onClick={openNewModal}>New App</Button>
      </span>
    </div>

    <div className='mt-16'>
    { apps && apps.map(app =>
      <div key={app.id} className='flex mb-8 p-4 rounded-md border border-slate-400/50'>
        <div>
          <p className='font-semibold'>{ app.name }</p>
          <p className='text-sm text-slate-400 dark:text-slate-600'>{ app.identifier }</p>
        </div>

        <Spacer />

        <div className="inline-flex rounded-md mx-4 justify-start" role="group">
          <button disabled={true} className="truncate px-6 w-96 text-sm font-medium bg-white rounded-l-md border border-slate-400/50 dark:bg-gray-700">
            { app.key }
          </button>
          <button type="button" onClick={() => navigator.clipboard.writeText(app.key)}
                  className="py-2 px-4 text-sm font-medium bg-white rounded-r-md border border-slate-400/50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600">
            <DocumentDuplicateIcon className='w-4 h-4' />
          </button>
        </div>

        <div className="inline-flex rounded-md mx-4" role="group">
          <button type="button" onClick={() => openDeleteModal(app.id)}
                  className="py-2 px-4 text-sm font-medium bg-white rounded-md border border-slate-400/50 dark:text-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600">
            <TrashIcon className='text-warn w-4 h-4' />
          </button>
        </div>
      </div>
    )}
    </div>

  </div>;
}
