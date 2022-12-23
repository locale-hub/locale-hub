'use client';

import React, { useEffect, useState } from 'react';
import { ApiConnector } from '@locale-hub/api-connector';
import { locales } from '../../../../../constants/locales';
import { redirect } from 'next/navigation';
import { routes } from '../../../../../constants/routes';
import toast from 'react-hot-toast';
import Joi from 'joi';
import InputField from '@locale-hub/design-system/input-field/input-field';
import Button from '@locale-hub/design-system/button/button';
import Select from '@locale-hub/design-system/select/select';
import Modal from '@locale-hub/design-system/modal/modal';
import { useAppSelector } from '../../../../../redux/hook';
import { selectProjectDetails, selectProjectUsers } from '../../../../../redux/slices/projectSlice';

const schema = Joi.object({
  name: Joi.string().min(4).required(),
  defaultLocale: Joi.string().required(),
}).required();

export default function ProjectSettingsPage() {
  const details = useAppSelector(selectProjectDetails);
  const users = useAppSelector(selectProjectUsers);

  const [name, setName] = useState('');
  const [owner, setOwner] = useState('');
  const [locale, setLocale] = useState('');

  // Modals hooks
  const [deleteModal, setDeleteModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<React.ReactNode>(null);
  const [actions, setActions] = useState<React.ReactNode>(null);

  useEffect(() => {
    setName(details?.project?.name);
    setOwner(details?.project?.userId);
  }, [details, users]);

  if (undefined === details || undefined === users) {
    return <></>;
  }


  const formInvalid = () =>
    'error' in schema.validate({ name, defaultLocale: locale });

  const updateProject = () => {
    details.project.name = name;
    details.project.defaultLocale = locale;
    details.project.userId = owner;
    // TODO: update redux
    ApiConnector.projects.update(details.project).then((data) => {
      if ('error' in data) {
        toast.error('Failed to update project');
        return;
      }
      toast.error('Project updated!');
    });
  };

  function deleteProject() {
    setDeleteModal(false);
    ApiConnector.projects.delete(details.project.id).then((data) => {
      if ('error' in data) {
        toast.error('Failed to delete project');
        return;
      }
      toast.success('Project deleted!');
      redirect(routes.projects.root);
    });
  }

  const openDeletionModal = () => {
    setTitle('Are you sure?');
    setContent(
      <>
        <p>
          This action cannot be undone.
          <br />
          This will permanently delete the{' '}
          <b className="text-warn">{details.project.name}</b> project and all it commits
          and entries.
        </p>
      </>
    );
    setActions(
      <>
        <Button type="cancel" onClick={() => setDeleteModal(false)}>
          Cancel
        </Button>
        <Button type="confirm" onClick={deleteProject}>
          I understand the consequences, delete this project
        </Button>
      </>
    );
    setDeleteModal(true);
  };

  const openArchiveModal = () => {
    setTitle('Are you sure?');
    setContent(
      <>
        <p>
          This will make the <b className="text-warn">{details.project.name}</b>{' '}
          project, entries, commits, comments read-only and disable the API
          access any changes. <br />
          Once archived, you can unarchive the repository at any time.
        </p>
      </>
    );
    setActions(
      <>
        <Button type="cancel" onClick={() => setDeleteModal(false)}>
          Cancel
        </Button>
        <Button type="confirm" onClick={deleteProject}>
          Archive this project
        </Button>
      </>
    );
    setDeleteModal(true);
  };

  return (
    <>
      <Modal
        isOpen={deleteModal}
        title={title}
        content={content}
        actions={actions}
        onClose={() => setDeleteModal(false)}
      />
      <div className="p-10 mt-16 w-3/4 m-auto rounded-md border border-slate-400/50">
        <h1 className="text-lg font-bold">Organization Information</h1>

        <div className="grid gap-4 mb-6 md:grid-cols-3 mt-4">
          <InputField
            name={'name'}
            label={'Name'}
            onValue={setName}
            type={'text'}
            value={name}
            placeholder="Organization name"
          />
          {users && (
            <Select
              onSelect={(value) => setOwner(value.id)}
              label="Owner"
              defaultSelected={
                users
                  .filter((u) => u.id == owner)
                  .map((user) => ({
                    id: user.id,
                    value: `${user.name} <${user.primaryEmail}>`,
                  }))[0]
              }
              values={users.map((user) => ({
                id: user.id,
                value: `${user.name} <${user.primaryEmail}>`,
              }))}
            />
          )}
          {details.project && (
            <Select
              onSelect={(value) => {
                setLocale(value.id);
              }}
              label="Default locale"
              defaultSelected={
                locales
                  .filter((l) => l.tag === details.project.defaultLocale)
                  .map((locale) => ({ id: locale.tag, value: locale.name }))[0]
              }
              values={locales.map((locale) => ({
                id: locale.tag,
                value: locale.name,
              }))}
            />
          )}
        </div>

        <div className="flex justify-end mt-8">
          <Button
            type="action"
            onClick={updateProject}
            disabled={formInvalid()}
          >
            Save
          </Button>
        </div>
      </div>

      <div className="px-10 py-10 w-3/4 mt-8 m-auto rounded-md border border-warn">
        <h5 className="text-lg font-bold text-warn">Danger Zone</h5>

        <div className="mt-8">
          <span className="font-bold">Archive this project?</span>
          <br />
          <span className="-pt-4">
            Mark this repository as archived, read-only and API disabled.
          </span>
          <div className="inline-block float-right -mt-5">
            <Button type="cancel" onClick={openArchiveModal}>
              Archive
            </Button>
          </div>
        </div>
        <div className="mt-8">
          <span className="font-bold">Delete project?</span>
          <br />
          <span className="-pt-4">
            Once you delete a repository, there is no going back. Please be
            certain.
          </span>
          <div className="inline-block float-right -mt-5">
            <Button type="cancel" onClick={openDeletionModal}>
              Delete
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
