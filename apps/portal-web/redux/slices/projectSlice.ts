import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { ApiError } from '@locale-hub/data/models/api-error.model';
import { ApiConnector } from '@locale-hub/api-connector';
import { ErrorCode } from '@locale-hub/data/enums/error-code.enum';
import { ProjectsGetResponse } from '@locale-hub/data/responses/projects-get.response';
import { User } from '@locale-hub/data/models/user.model';
import { App } from '@locale-hub/data/models/app.model';
import { Commit } from '@locale-hub/data/models/commit.model';
import { ManifestWithStatus } from '@locale-hub/data/models/manifest-with-status.model';
import { Project } from '@locale-hub/data/models/project.model';

export interface ProjectState {
  applications: App[];
  commits: Commit[];
  details: ProjectsGetResponse;
  manifests: ManifestWithStatus;
  orgUsers: User[];
  users: User[];
  error: ApiError;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: ProjectState = {
  applications: undefined,
  commits: undefined,
  details: undefined,
  manifests: undefined,
  orgUsers: undefined,
  users: undefined,
  error: undefined,
  status: 'idle',
};

export const loadProjectAsync = createAsyncThunk(
  'project/getById',
  async (params: { projectId: string }) => {
    const details = await ApiConnector.projects.get(params.projectId);
    return {
      applications: await ApiConnector.projects.applications.list(
        params.projectId
      ),
      commits: await ApiConnector.projects.commits.list(params.projectId),
      details: details,
      manifests: await ApiConnector.projects.manifests.get(params.projectId),
      orgUsers: await ApiConnector.organizations.users.list(
        (details as ProjectsGetResponse).project.organizationId
      ),
      users: await ApiConnector.projects.users.list(params.projectId),
    };
  }
);

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    applicationAdd: (state, payload: PayloadAction<App>) => {
      state.applications.push(payload.payload);
    },
    applicationRemove: (state, payload: PayloadAction<App>) => {
      state.applications = state.applications.filter(
        (app) => app.id !== payload.payload.id
      );
    },
    deployCommit: (state, payload: PayloadAction<string>) => {
      state.commits.find((c) => c.deployed).deployed = false;
      state.commits.find((c) => c.id === payload.payload).deployed = true;
    },
    detailsProjectUpdate: (state, payload: PayloadAction<Project>) => {
      state.details.project = payload.payload;
    },
    manifestsAddKey: (state, payload: PayloadAction<{ key: string }>) => {
      if (state.manifests.keys.includes(payload.payload.key)) {
        return;
      }
      state.manifests.keys.push(payload.payload.key);
      for (const locale of state.manifests.locales) {
        state.manifests.manifest[locale][payload.payload.key] = '';
      }
    },
    manifestsAddLocale: (state, payload: PayloadAction<{ locale: string }>) => {
      if (state.manifests.locales.includes(payload.payload.locale)) {
        return;
      }
      state.manifests.locales.push(payload.payload.locale);
      state.manifests.manifest[payload.payload.locale] = {};
      for (const key of state.manifests.keys) {
        state.manifests.manifest[payload.payload.locale][key] = '';
      }
    },
    manifestsUpdateEntry: (
      state,
      payload: PayloadAction<{ locale: string; key: string; value: string }>
    ) => {
      if (
        false !== state.manifests.locales.includes(payload.payload.locale) ||
        false !== state.manifests.keys.includes(payload.payload.key)
      ) {
        return;
      }
      state.manifests.manifest[payload.payload.locale][payload.payload.key] =
        payload.payload.value;
    },
    userAdd: (state, payload: PayloadAction<User>) => {
      state.users.push(payload.payload);
    },
    userRemove: (state, payload: PayloadAction<User>) => {
      state.users = state.users.filter((u) => u.id !== payload.payload.id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProjectAsync.pending, (state) => {
        state.status = 'loading';
        state.applications = undefined;
        state.commits = undefined;
        state.details = undefined;
        state.manifests = undefined;
        state.orgUsers = undefined;
        state.users = undefined;
        state.error = undefined;
      })
      .addCase(loadProjectAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        if ('error' in action.payload.applications) {
          state.error = action.payload.applications.error;
        } else {
          state.applications = action.payload.applications.applications;
        }
        if ('error' in action.payload.commits) {
          state.error = action.payload.commits.error;
        } else {
          state.commits = action.payload.commits.commits;
        }
        if ('error' in action.payload.details) {
          state.error = action.payload.details.error;
        } else {
          state.details = action.payload.details;
        }
        if ('error' in action.payload.manifests) {
          state.error = action.payload.manifests.error;
        } else {
          state.manifests = action.payload.manifests.manifest;
        }
        if ('error' in action.payload.orgUsers) {
          state.error = action.payload.orgUsers.error;
        } else {
          state.orgUsers = action.payload.orgUsers.users;
        }
        if ('error' in action.payload.users) {
          state.error = action.payload.users.error;
        } else {
          state.users = action.payload.users.users;
        }
      })
      .addCase(loadProjectAsync.rejected, (state) => {
        state.status = 'failed';
        state.error = {
          code: ErrorCode.serverError,
          message: 'Failed to retrieve project',
          statusCode: 500,
        };
      });
  },
});

export const selectProjectApplications = (state: RootState) =>
  state.project.applications;
export const selectProjectCommits = (state: RootState) => state.project.commits;
export const selectProjectDetails = (state: RootState) => state.project.details;
export const selectProjectManifests = (state: RootState) =>
  state.project.manifests;
export const selectProjectOrgUsers = (state: RootState) =>
  state.project.orgUsers;
export const selectProjectUsers = (state: RootState) => state.project.users;

export const projectActions = projectSlice.actions;

export default projectSlice.reducer;
