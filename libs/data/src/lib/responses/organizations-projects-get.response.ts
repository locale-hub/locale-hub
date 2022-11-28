import {Project} from '../models/project.model';
import {ProjectTranslationProgress} from '../models/project-translation-progress.model';

export interface OrganizationsProjectsGetResponse {
  projects: Project[];
  progress: ProjectTranslationProgress[];
}
