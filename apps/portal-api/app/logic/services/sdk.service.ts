/**
 * Update SDK Redis with new values
 * @param {string} defaultLocale The default project locale
 * @return {Project|null} The newly created project, null in case of failure
 */ import { Commit } from '@locale-hub/data/models/commit.model';
import {
  redisGet,
  redisRemove,
  redisSet,
} from '@locale-hub/data/repositories/redis.service';
import { SdkPublishedManifest } from '@locale-hub/data/models/sdk-published-manifest.model';
import { environment } from '../../../environments/environment';

export const sdkRemoveProject = async (projectId: string): Promise<void> => {
  if (!environment.features.sdk) {
    return; // feature not enabled
  }
  await redisRemove(projectId);
};

export const sdkUpdatePublishedCommit = async (
  projectId: string,
  commit?: Commit
): Promise<void> => {
  if (!environment.features.sdk) {
    return; // feature not enabled
  }
  const data: SdkPublishedManifest =
    (await redisGet<SdkPublishedManifest>(projectId)) ?? {};

  data.commitId = commit?.id ?? undefined;
  data.commit = commit?.changeList ?? undefined;

  await redisSet(projectId, data);
};

export const sdkAddApp = async (
  projectId: string,
  subscriptionKey: string
): Promise<void> => {
  if (!environment.features.sdk) {
    return; // feature not enabled
  }
  const data: SdkPublishedManifest =
    (await redisGet<SdkPublishedManifest>(projectId)) ?? {};

  if (undefined === data.subscriptionKeys) {
    data.subscriptionKeys = [];
  }

  data.subscriptionKeys.push(subscriptionKey);

  await redisSet(projectId, data);
};

export const sdkRemoveApp = async (
  projectId: string,
  subscriptionKey: string
): Promise<void> => {
  if (!environment.features.sdk) {
    return; // feature not enabled
  }
  const data: SdkPublishedManifest =
    (await redisGet<SdkPublishedManifest>(projectId)) ?? {};

  if (undefined === data.subscriptionKeys) {
    data.subscriptionKeys = [];
  }

  data.subscriptionKeys = data.subscriptionKeys.filter(
    (sk) => sk !== subscriptionKey
  );

  await redisSet(projectId, data);
};

export const sdkChangeDefaultLocale = async (
  projectId: string,
  defaultLocale: string
): Promise<void> => {
  if (!environment.features.sdk) {
    return; // feature not enabled
  }
  const data: SdkPublishedManifest =
    (await redisGet<SdkPublishedManifest>(projectId)) ?? {};

  data.defaultLocale = defaultLocale;

  await redisSet(projectId, data);
};
