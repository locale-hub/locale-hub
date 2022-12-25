'use client';

import React, { useEffect, useState } from 'react';
import {
  AdjustmentsHorizontalIcon,
  ArrowsUpDownIcon,
  ArrowUpTrayIcon,
  DevicePhoneMobileIcon,
  HomeIcon,
  LanguageIcon,
  UsersIcon,
} from '@heroicons/react/24/solid';
import { routes } from '../../../../constants/routes';
import Sidebar from '@locale-hub/design-system/sidebar/sidebar';
import { useAppDispatch, useAppSelector } from '../../../../redux/hook';
import {
  loadProjectAsync,
  selectProjectErrors,
} from '../../../../redux/slices/projectSlice';
import toast from 'react-hot-toast';

export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { projectId: string };
}) {
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectProjectErrors);
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>(
    'loading'
  );

  useEffect(() => {
    dispatch(loadProjectAsync({ projectId: params.projectId }))
      .then(() => {
        if (undefined !== error) {
          toast.error('Failed to load project...');
        }
        setStatus(undefined !== error ? 'error' : 'success');
      })
      .catch(() => {
        setStatus('error');
        toast.error('Failed to load project...');
      });
  }, [params.projectId]);

  if ('loading' === status) {
    // TODO: skeleton
    return <></>;
  }

  return (
    <div className="flex height-full">
      <div className="w-2/12 min-h-full">
        <Sidebar
          data={[
            {
              name: 'Overview',
              link: routes.projects.overview(params.projectId),
              icon: <HomeIcon className="w-6 h-6" />,
            },
            {
              name: 'Translations',
              link: routes.projects.translations(params.projectId),
              icon: <LanguageIcon className="w-6 h-6" />,
            },
            {
              name: 'Import/Export',
              link: routes.projects.transfers(params.projectId),
              icon: <ArrowsUpDownIcon className="w-6 h-6" />,
            },
            {
              name: 'Users',
              link: routes.projects.users(params.projectId),
              icon: <UsersIcon className="w-6 h-6" />,
            },
            {
              name: 'Commits',
              link: routes.projects.commits.list(params.projectId),
              icon: <ArrowUpTrayIcon className="w-6 h-6" />,
            },
            {
              name: 'Apps',
              link: routes.projects.applications(params.projectId),
              icon: <DevicePhoneMobileIcon className="w-6 h-6" />,
            },
            {
              name: 'Settings',
              link: routes.projects.settings(params.projectId),
              icon: <AdjustmentsHorizontalIcon className="w-6 h-6" />,
            },
          ]}
        />
      </div>
      <div className="w-10/12 px-10 py-10 overflow-y-scroll">
        {'error' !== status && children}
      </div>
    </div>
  );
}
