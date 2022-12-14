'use client';

import { redirect } from 'next/navigation';
import { routes } from '../../../../../constants/routes';

export default function ProjectOverview({
  params,
}: {
  params: { projectId: string };
}) {
  redirect(routes.projects.overview(params.projectId));
}
