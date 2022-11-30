import {OrganizationApiUsage, OrganizationStorageUsage} from '../models/usage.model';

export interface OrganizationsUsageGetResponse {
  usage: {
    storage: OrganizationStorageUsage;
    api: OrganizationApiUsage;
  };
}
