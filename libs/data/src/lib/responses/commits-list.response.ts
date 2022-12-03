import {Commit} from '../models/commit.model';

export interface CommitsListResponse {
  commits: Commit[];
}
