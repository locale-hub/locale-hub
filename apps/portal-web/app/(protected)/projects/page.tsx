'use client';

import React, { useEffect, useState } from 'react';

import { ApiConnector } from '@locale-hub/api-connector';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { routes } from '../../../constants/routes';
import toast from 'react-hot-toast';
import { Project } from '@locale-hub/data/models/project.model';
import Table from '@locale-hub/design-system/table/table';
import Button from '@locale-hub/design-system/button/button';
import DateFormat from '@locale-hub/design-system/date-format/date-format';
import { MeDashboardResponse } from '@locale-hub/data/responses/me-dashboard.response';
import Menu from '@locale-hub/design-system/menu/menu';
import Modal from '@locale-hub/design-system/modal/modal';
import ProgressBar from '@locale-hub/design-system/progress-bar/progress-bar';

export default function ProjectsPage() {
  const [data, setData] = useState<MeDashboardResponse>(null);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    ApiConnector.me.dashboard().then((data) => {
      if ('error' in data) {
        toast.error('Failed to retrieve dashboard');
        return;
      }
      setData(data);
    });
  }, []);

  const projectName = (project: Project) => {
    const organizationName = data.organizations.find(
      (org) => org.id === project.organizationId
    ).name;
    return (
      <>
        <Link
          className="text-primary"
          href={routes.organizations.projects(project.organizationId)}
        >
          {organizationName}
        </Link>
        <span className="px-1">/</span>
        <Link
          className="text-primary"
          href={routes.projects.overview(project.id)}
        >
          {project.name}
        </Link>
      </>
    );
  };
  const projectProgress = (projectId: string) => {
    const progress =
      100 *
      data.progress.find((project) => project.projectId === projectId).progress;
    return <ProgressBar fill={progress} />;
  };

  const deleteProject = (projectId: string) => {
    setDeleteModal(false);
    ApiConnector.projects.delete(projectId).then((res) => {
      if ('error' in res) {
        toast.error('Failed to delete project');
        return;
      }
      toast.success('Project deleted!');
      data.projects = data.projects.filter((p) => p.id !== projectId);
      setData(data);
    });
  };

  const [title, setTitle] = useState('');
  const [content, setContent] = useState<React.ReactNode>(null);
  const [actions, setActions] = useState<React.ReactNode>(null);
  const openDeletionModalFor = (project: Project) => {
    setTitle('Are you sure?');
    setContent(
      <>
        <p>
          This action cannot be undone.
          <br />
          This will permanently delete the{' '}
          <b className="text-warn">{project.name}</b> project and all it commits
          and entries.
          <br />
        </p>
      </>
    );
    setActions(
      <>
        <Button type="cancel" onClick={() => setDeleteModal(false)}>
          Cancel
        </Button>
        <Button type="confirm" onClick={() => deleteProject(project.id)}>
          Confirm
        </Button>
      </>
    );
    setDeleteModal(true);
  };

  return (
    <div className="px-10 py-10">
      <Modal
        isOpen={deleteModal}
        title={title}
        content={content}
        actions={actions}
        onClose={() => setDeleteModal(false)}
      />
      <Table
        className="w-7/12 mx-auto mt-12"
        heads={[
          { key: 'name', label: 'Project Name', className: 'w-7/12' },
          { key: 'status', label: 'Status', className: 'w-2/12' },
          { key: 'createdAt', label: 'Creation Date', className: 'w-2/12' },
          { key: 'actions', label: 'Actions', className: 'w-1/12' },
        ]}
        entries={
          data?.projects.map((project) => ({
            name: projectName(project),
            status: projectProgress(project.id),
            createdAt: <DateFormat date={project.createdAt} />,
            actions: (
              <Menu
                onClick={() => openDeletionModalFor(project)}
                button={
                  <EllipsisHorizontalIcon className="h-6 w-6 text-white" />
                }
              >
                <span className="text-warn">Delete</span>
              </Menu>
            ),
          })) ?? []
        }
      />
    </div>
  );
}
