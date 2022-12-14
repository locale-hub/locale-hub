import { ChangeList } from './change-list.model';

export interface SdkPublishedManifest {
  defaultLocale?: string;
  subscriptionKeys?: string[];
  commitId?: string;
  commit?: ChangeList;
}
