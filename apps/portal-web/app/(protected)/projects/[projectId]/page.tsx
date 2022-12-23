'use client';

import React from 'react';
import Link from 'next/link';
import { routes } from '../../../../constants/routes';
import { environment } from '../../../../environment';
import ProgressBar from '@locale-hub/design-system/progress-bar/progress-bar';
import Card from '@locale-hub/design-system/card/card';
import { useAppSelector } from '../../../../redux/hook';
import { selectProjectDetails } from '../../../../redux/slices/projectSlice';

type Action = {
  img: string;
  title: string;
  url: string;
};

export default function ProjectOverviewPage({
  params,
}: {
  params: { projectId: string };
}) {
  const details = useAppSelector(selectProjectDetails);

  const actions: Action[] = [
    {
      title: 'Translate',
      img: '/images/shared_goals.svg',
      url: routes.projects.translations(params.projectId),
    },
    {
      title: 'App management',
      img: '/images/progressive_app.svg',
      url: routes.projects.applications(params.projectId),
    },
    {
      title: 'Team management',
      img: '/images/selecting_team.svg',
      url: routes.projects.users(params.projectId),
    },
    {
      title: 'Integrations',
      img: '/images/programmer.svg',
      url: environment.documentation.sdk,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">
        {details.project.name}&apos;s overview
      </h1>
      <div className="flex items-stretch">
        {details.deployedCommit && (
          <div className="m-4 w-3/12 h-full">
            <Card title="Deployed commit" className="w-full">
              {details.deployedCommit.title}
            </Card>
          </div>
        )}
        {details.progress && (
          <div className="m-4 w-9/12">
            <Card title="Translation progress" className="w-full">
              {Object.entries(details.progress).map(([locale, progress], idx) => (
                <div key={idx} className="flex mt-4">
                  <p className="w-16">{locale}</p>
                  <p className="w-16">{progress * 100}%</p>
                  <ProgressBar fill={progress * 100} className="mt-[7px]" />
                </div>
              ))}
            </Card>
          </div>
        )}
      </div>

      <h4 className="text-xl font-bold">Actions</h4>
      <div className="flex">
        {actions.map((action, idx) => (
          <Link key={idx} href={action.url} className="w-3/12 mx-2 mt-4">
            <Card className="w-full" title={action.title} image={action.img} />
          </Link>
        ))}
      </div>
    </div>
  );
}
