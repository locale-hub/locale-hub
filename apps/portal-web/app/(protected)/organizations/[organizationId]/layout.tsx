'use client';

import React, { useEffect, useState } from 'react';
import {
  AdjustmentsHorizontalIcon,
  ChartPieIcon,
  HomeIcon,
  UsersIcon,
} from '@heroicons/react/24/solid';
import { routes } from '../../../../constants/routes';
import Sidebar from '@locale-hub/design-system/sidebar/sidebar';
import { useAppDispatch } from '../../../../redux/hook';
import toast from 'react-hot-toast';
import { loadOrganizationAsync } from '../../../../redux/slices/organizationSlice';

export default function OrganizationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { organizationId: string };
}) {
  const dispatch = useAppDispatch();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    dispatch(loadOrganizationAsync({ organizationId: params.organizationId }))
      // Wait project to be loaded before displaying child content as they require project data
      // TODO: store might contain error
      .then(() => setLoaded(true))
      .catch(() => toast.error('Failed to load organization...'));
  }, [params.organizationId]);

  if (false === loaded) {
    // TODO: skeleton
    return <></>;
  }

  return (
    <div className="flex height-full">
      <div className="w-2/12 min-h-full">
        <Sidebar
          data={[
            {
              name: 'Projects',
              link: routes.organizations.projects(params.organizationId),
              icon: <HomeIcon className="w-6 h-6" />,
            },
            {
              name: 'Users',
              link: routes.organizations.users(params.organizationId),
              icon: <UsersIcon className="w-6 h-6" />,
            },
            {
              name: 'Usage',
              link: routes.organizations.usage(params.organizationId),
              icon: <ChartPieIcon className="w-6 h-6" />,
            },
            {
              name: 'Settings',
              link: routes.organizations.settings(params.organizationId),
              icon: <AdjustmentsHorizontalIcon className="w-6 h-6" />,
            },
          ]}
        />
      </div>
      <div className="w-10/12 px-10 py-10 overflow-y-scroll">{children}</div>
    </div>
  );
}
