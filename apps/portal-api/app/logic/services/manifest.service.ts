import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { ChangeList } from '@locale-hub/data/models/change-list.model';
import { ManifestRepository } from '@locale-hub/data/repositories/manifest.repository';
import { CommitRepository } from '@locale-hub/data/repositories/commit.repository';
dayjs.extend(utc);

const commitRepository = new CommitRepository();
const manifestRepository = new ManifestRepository();

type HistoryEntry = { date: string; value: string };

/**
 * Generate a manifest with the latest values
 * @param {string} projectId The projectId to generate the manifest
 * @return {ChangeList} The latest manifest
 */
export const getManifestFromProject = async (
  projectId: string
): Promise<ChangeList> => {
  const changeList = await manifestRepository.get(projectId);

  if (null === changeList) {
    return {
      locales: [],
      keys: [],
      manifest: {},
    };
  }

  return changeList;
};

/**
 * Update a manifest
 * @param {string} authorId The user that is updating the manifest
 * @param {string} projectId The project to update
 * @param {ChangeList} changeList The manifest to update
 * @param {string} commitTitle Short title of the commit
 * @param {string} commitDescription Longer description of the commit
 */
export const updateManifestFromProject = async (
  authorId: string,
  projectId: string,
  changeList: ChangeList,
  commitTitle: string,
  commitDescription: string
): Promise<void> => {
  const createdAt = dayjs().utc().toISOString();

  await commitRepository.insert(
    projectId,
    authorId,
    commitTitle,
    commitDescription,
    changeList,
    createdAt
  );
};

/**
 * List all changes made for a given key and locale
 * @param {string} projectId A project Id
 * @param {string} key The key from which we desire the history
 * @param {string} locale The locale from which we desire the history
 * @return {HistoryEntry[]} List of changes made
 */
export const getKeyHistoryFromProject = async (
  projectId: string,
  key: string,
  locale: string
): Promise<HistoryEntry[]> => {
  const commits = await commitRepository.findByProject(projectId);

  const history: HistoryEntry[] = [];
  let lastValue = undefined;

  for (const commit of commits) {
    const changeList = commit.changeList;
    if (
      !changeList.locales.includes(locale) &&
      !changeList.keys.includes(key)
    ) {
      continue;
    }
    if (lastValue === changeList.manifest[locale][key]) {
      continue;
    }
    lastValue = changeList.manifest[locale][key];
    history.push({
      date: commit.createdAt,
      value: changeList.manifest[locale][key],
    });
  }

  // return latest first
  return history.reverse();
};
