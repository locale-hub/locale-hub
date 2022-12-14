'use client';

import React from 'react';
import {
  AdjustmentsHorizontalIcon,
  ChartPieIcon,
  HomeIcon,
  UsersIcon,
} from '@heroicons/react/24/solid';
import { routes } from '../../../../constants/routes';
import Sidebar from '@locale-hub/design-system/sidebar/sidebar';

export default function OrganizationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { organizationId: string };
}) {
  const organizationId = params.organizationId;

  return (
    <div className="flex height-full">
      <div className="w-2/12 min-h-full">
        <Sidebar
          data={[
            {
              name: 'Projects',
              link: routes.organizations.projects(organizationId),
              icon: <HomeIcon className="w-6 h-6" />,
            },
            {
              name: 'Users',
              link: routes.organizations.users(organizationId),
              icon: <UsersIcon className="w-6 h-6" />,
            },
            {
              name: 'Usage',
              link: routes.organizations.usage(organizationId),
              icon: <ChartPieIcon className="w-6 h-6" />,
            },
            {
              name: 'Settings',
              link: routes.organizations.settings(organizationId),
              icon: <AdjustmentsHorizontalIcon className="w-6 h-6" />,
            },
          ]}
        />
      </div>
      <div className="w-10/12 px-10 py-10 overflow-y-scroll">{children}</div>
    </div>
  );
}
