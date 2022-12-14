import { Organization } from '../models/organization.model';
import { Project } from '../models/project.model';
import { ProjectTranslationProgress } from '../models/project-translation-progress.model';

export interface MeDashboardResponse {
  organizations: Organization[];
  projects: Project[];
  progress: ProjectTranslationProgress[];
}
