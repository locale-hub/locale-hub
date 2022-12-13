import { Commit } from '@locale-hub/data/models/commit.model';
import { CommitRepository } from '@locale-hub/data/repositories/commit.repository';

const commitRepository = new CommitRepository();

/**
 * List commits of the given project
 * @param {string} projectId A Project ID
 * @return {Commit[]} List of the commits from the given project
 */
export const getCommitsFromProject = async (projectId: string): Promise<Commit[]> => {
  return await commitRepository.findByProject(projectId);
};

/**
 * Get deployed commit of the given project
 * @param {string} projectId A Project ID
 * @return {Commit} Deployed commits from the given project, null if no deployed commit
 */
export const getDeployedCommitFromProject = async (projectId: string): Promise<Commit> => {
  const commits = await commitRepository.findByProject(projectId);
  return commits.filter((c: Commit) => c.deployed)[0] ?? null;
};

/**
 * Retrieve a commit information
 * @param {string} commitId A commit Id
 * @return {Commit|null} The commit found, null if not found
 */
export const getCommit = async (commitId: string): Promise<Commit> => {
  return await commitRepository.find(commitId);
};

/**
 * Publish of Unpublish a commit, unpublish all previous published commit
 * @param {string} projectId A project Id
 * @param {string} commitId The commit Id to publish|unpublish
 * @param {boolean} deployed true if should be published, false otherwise
 * @return {boolean} true if update is successful, false otherwise
 */
export const publish = async (projectId: string, commitId: string, deployed: boolean): Promise<boolean> => {
  const commits = await getCommitsFromProject(projectId);

  if (null === commits) {
    return false;
  }

  for (const commit of commits) {
    await commitRepository.setPublishState(commit.id, false);
  }

  return await commitRepository.setPublishState(commitId, deployed);
};
