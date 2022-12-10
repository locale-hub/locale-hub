'use client';

import React, { useEffect, useState } from 'react';
import { Button, DateFormat, Modal, UserIcon } from '@locale-hub/design-system';
import { ApiConnector } from '@locale-hub/api-connector';
import { Commit, User } from '@locale-hub/data';
import { CloudArrowUpIcon, CodeBracketIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { routes } from '../../../../../constants/routes';

export default function ProjectCommitsPage({
  params
}: {
  params: { projectId: string }
}) {
  const [commits, setCommits] = useState<Commit[]>();
  const [users, setUsers] = useState<User[]>();

  useEffect(() => {
    ApiConnector.projects.commits.list(params.projectId).then(data => {
      if ('error' in data) {
        // TODO Toast
        return;
      }
      // Showing latest first
      setCommits(data.commits.reverse());
    });
    ApiConnector.projects.users(params.projectId).then(data => {
      if ('error' in data) {
        // TODO Toast
        return;
      }
      setUsers(data.users);
    });
  }, []);


  const deployCommit = async (commitId: string) => {
    setDeployModal(false);
    ApiConnector.projects.commits.publish(params.projectId, commitId).then(() => {
      setCommits(commits.map(commit => {
        commit.deployed = commit.id === commitId;
        return commit;
      }));
    });
  }

  const [deployModal, setDeployModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<React.ReactNode>(null);
  const [actions, setActions] = useState<React.ReactNode>(null);
  const openDeployModal = (commitId: string) => {
    setTitle('You are about to release new changes');
    setContent(<>
      <p>
        This action will publish all changes since last published version.<br />
        It means that the changes made until that commit will be sent to you apps.<br />
        Note: This will unpublished the previous published commit.
      </p>
    </>);
    setActions(<>
      <Button type='cancel' onClick={() => setDeployModal(false)}>Cancel</Button>
      <Button type='confirm' onClick={() => deployCommit(commitId)}>Publish changes</Button>
    </>);
    setDeployModal(true);
  };

  return <div className='px-10 py-10 m-auto w-full center'>
    <Modal isOpen={deployModal} title={title} content={content} actions={actions} onClose={() => setDeployModal(false)} />
    <ol className="relative border-l border-slate-400/50">
      { commits && users && commits.map(commit =>
        <li key={commit.id} className="mb-10 ml-6">
          <span className="flex absolute -left-3 justify-center items-center w-6 h-6 ">
            <UserIcon name={users.find(u => u.id === commit.authorId).name} />
          </span>

          <div className="p-4 bg-white dark:bg-gray-700 rounded-md border border-slate-400/50">
            <div className="justify-between items-center sm:flex">
              <div className="text-sm font-normal">
                <p className='text-lg font-bold'>{commit.title}</p>
                <p>
                  <span className='font-bold'>{ users.find(u => u.id === commit.authorId).name }</span>
                  <span className='px-2'>committed on</span>
                  <DateFormat date={commit.createdAt} />
                </p>
              </div>
              <div className="mb-1 sm:order-last sm:mb-0">
                <div className="inline-flex rounded-md mx-4" role="group">
                  <button type="button" onClick={() => navigator.clipboard.writeText(commit.id)}
                      className="py-2 px-4 text-sm font-medium bg-white rounded-l-md border border-slate-400/50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600">
                    <DocumentDuplicateIcon className='w-4 h-4' />
                  </button>
                  <button disabled={true} className="px-6 text-sm font-medium bg-white rounded-r-md border border-slate-400/50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600">
                    { commit.id }
                  </button>
                </div>

                <div className="inline-flex rounded-md mx-4" role="group">
                  <button className="py-2 px-4 text-sm font-medium bg-white rounded-l-md border border-slate-400/50 dark:text-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600">
                    <Link href={routes.projects.commits.get(params.projectId, commit.id)}>
                      <CodeBracketIcon className='w-4 h-4' />
                    </Link>
                  </button>
                  <button type="button" onClick={() => openDeployModal(commit.id)}
                    className="py-2 px-4 text-sm font-medium bg-white rounded-r-md border border-slate-400/50 dark:text-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600">
                    <CloudArrowUpIcon className={`${commit.deployed ? 'text-primary' : ''} w-4 h-4`} />
                  </button>
                </div>

              </div>
            </div>
          </div>
        </li>
      )}
    </ol>

  </div>;
}
