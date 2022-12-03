import {ChangeList} from './change-list.model';

export interface Commit {
  id: string;
  projectId: string;
  authorId: string;
  title: string;
  description: string;
  changeList: ChangeList;
  deployed: boolean;
  createdAt: string;
}
