'use client';

import React, { useState } from 'react';
import { ApiConnector } from '@locale-hub/api-connector';
import { DocumentDuplicateIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import ModalCreateApp from '@locale-hub/design-system/modal/modal-create-app';
import Button from '@locale-hub/design-system/button/button';
import Spacer from '@locale-hub/design-system/spacer/spacer';
import Modal from '@locale-hub/design-system/modal/modal';
import { App } from '@locale-hub/data/models/app.model';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hook';
import {
  projectActions,
  selectProjectApplications,
} from '../../../../../redux/slices/projectSlice';

export default function ProjectApplicationsPage({
  params,
}: {
  params: { projectId: string };
}) {
  const dispatch = useAppDispatch();
  const apps = useAppSelector(selectProjectApplications);

  const createApp = async (app?: App) => {
    setCreateModal(false);
    if (undefined === app || null === app) {
      return;
    }
    ApiConnector.projects.applications
      .create(params.projectId, app.name, app.identifier)
      .then((data) => {
        if ('error' in data) {
          toast.error('Failed to create application');
          return;
        }
        toast.success('Application created!');
        dispatch(projectActions.applicationAdd(data.application));
      });
  };
  const deleteApp = async (appId: string) => {
    setAppModal(false);
    ApiConnector.projects.applications
      .delete(params.projectId, appId)
      .then((data) => {
        if (null !== data) {
          toast.error('Failed to delete application');
          return;
        }
        dispatch(
          projectActions.applicationRemove(apps.find((app) => app.id === appId))
        );
        toast.success('Application deleted!');
      });
  };

  const [createModal, setCreateModal] = useState(false);
  const [appModal, setAppModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<React.ReactNode>(null);
  const [actions, setActions] = useState<React.ReactNode>(null);

  const openDeleteModal = (appId: string) => {
    setTitle('Are you sure?');
    setContent(
      <>
        <p>
          This action cannot be undone.
          <br />
          This will permanently delete the postman app and all the APIs access
          with the app key will be blocked.
        </p>
      </>
    );
    setActions(
      <>
        <Button type="cancel" onClick={() => setAppModal(false)}>
          Cancel
        </Button>
        <Button type="confirm" onClick={() => deleteApp(appId)}>
          I understand the consequences, delete this app
        </Button>
      </>
    );
    setAppModal(true);
  };

  return (
    <div className="px-10 py-10 m-auto w-3/4 center">
      <ModalCreateApp isOpen={createModal} onClose={createApp} />
      <Modal
        isOpen={appModal}
        title={title}
        content={content}
        actions={actions}
        onClose={() => setAppModal(false)}
      />

      <div className="flex mt-32">
        <div className="inline-flex rounded-md" role="group">
          <button
            disabled={true}
            className="px-6 w-32 text-sm font-medium dark:bg-dark rounded-l-md border border-slate-400/50"
          >
            Project ID
          </button>
          <button
            disabled={true}
            className="truncate px-6 w-96 text-sm font-medium bg-white border-t border-b border-slate-400/50 dark:bg-gray-700"
          >
            {params.projectId}
          </button>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(params.projectId)}
            className="py-2 px-4 text-sm font-medium bg-white rounded-r-md border border-slate-400/50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <DocumentDuplicateIcon className="w-4 h-4" />
          </button>
        </div>
        <Spacer />
        <span className="ml-2 mt-2">
          <Button type="confirm" onClick={() => setCreateModal(true)}>
            New App
          </Button>
        </span>
      </div>

      <div className="mt-16">
        {apps &&
          apps.map((app) => (
            <div
              key={app.id}
              className="flex mb-8 p-4 rounded-md border border-slate-400/50"
            >
              <div>
                <p className="font-semibold">{app.name}</p>
                <p className="text-sm text-slate-400 dark:text-slate-600">
                  {app.identifier}
                </p>
              </div>

              <Spacer />

              <div
                className="inline-flex rounded-md mx-4 justify-start"
                role="group"
              >
                <button
                  disabled={true}
                  className="truncate px-6 w-96 text-sm font-medium bg-white rounded-l-md border border-slate-400/50 dark:bg-gray-700"
                >
                  {app.key}
                </button>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(app.key)}
                  className="py-2 px-4 text-sm font-medium bg-white rounded-r-md border border-slate-400/50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  <DocumentDuplicateIcon className="w-4 h-4" />
                </button>
              </div>

              <div className="inline-flex rounded-md mx-4" role="group">
                <button
                  type="button"
                  onClick={() => openDeleteModal(app.id)}
                  className="py-2 px-4 text-sm font-medium bg-white rounded-md border border-slate-400/50 dark:text-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  <TrashIcon className="text-warn w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
