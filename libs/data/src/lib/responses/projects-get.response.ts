import { Project } from '../models/project.model';

export interface ProjectsGetResponse {
  project: Project;
  deployedCommit?: {
    id: string;
    authorId: string;
    title: string;
    description: string;
    createdAt: string;
  };
  progress?: { [locale: string]: number };
}
