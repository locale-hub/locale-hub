'use client';

import { useRouter } from 'next/navigation';
import { routes } from '../../../../../constants/routes';

export default function ProjectOverview({
  params,
}: {
  params: { projectId: string };
}) {
  const router = useRouter();
  router.push(routes.projects.overview(params.projectId));
}
