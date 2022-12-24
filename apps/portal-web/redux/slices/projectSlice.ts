import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { ApiError } from '@locale-hub/data/models/api-error.model';
import { ApiConnector } from '@locale-hub/api-connector';
import { ErrorCode } from '@locale-hub/data/enums/error-code.enum';
import { ProjectsGetResponse } from '@locale-hub/data/responses/projects-get.response';
import { User } from '@locale-hub/data/models/user.model';
import { App } from '@locale-hub/data/models/app.model';
import { Commit } from '@locale-hub/data/models/commit.model';
import { ManifestWithStatus } from '@locale-hub/data/models/manifest-with-status.model';

export interface ProjectState {
  applications: App[];
  commits: Commit[];
  details: ProjectsGetResponse;
  manifests: ManifestWithStatus;
  users: User[];
  error: ApiError;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: ProjectState = {
  applications: undefined,
  commits: undefined,
  details: undefined,
  manifests: undefined,
  users: undefined,
  error: undefined,
  status: 'idle',
};

export const loadProjectAsync = createAsyncThunk(
  'project/getById',
  async (params: { projectId: string}) => {
    return {
      applications: await ApiConnector.projects.applications.list(params.projectId),
      commits: await ApiConnector.projects.commits.list(params.projectId),
      details: await ApiConnector.projects.get(params.projectId),
      manifests: await ApiConnector.projects.manifests.get(params.projectId),
      users: await ApiConnector.projects.users.list(params.projectId)
    };
  }
);

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadProjectAsync.pending, (state) => {
        state.status = 'loading';
        state.applications = undefined;
        state.commits = undefined;
        state.details = undefined;
        state.manifests = undefined;
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
          statusCode: 500
        }
      });
  },
});

export const selectProjectApplications = (state: RootState) => state.project.applications;
export const selectProjectCommits = (state: RootState) => state.project.commits;
export const selectProjectDetails = (state: RootState) => state.project.details;
export const selectProjectManifests = (state: RootState) => state.project.manifests;
export const selectProjectUsers = (state: RootState) => state.project.users;

export default projectSlice.reducer;
