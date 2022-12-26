import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { ApiError } from '@locale-hub/data/models/api-error.model';
import { ApiConnector } from '@locale-hub/api-connector';
import { ErrorCode } from '@locale-hub/data/enums/error-code.enum';
import { User } from '@locale-hub/data/models/user.model';
import { OrganizationsProjectsGetResponse } from '@locale-hub/data/responses/organizations-projects-get.response';
import {
  OrganizationApiUsage,
  OrganizationStorageUsage,
} from '@locale-hub/data/models/usage.model';
import { Organization } from '@locale-hub/data/models/organization.model';

export interface OrganizationState {
  details: Organization;
  projects: OrganizationsProjectsGetResponse;
  usage: { storage: OrganizationStorageUsage; api: OrganizationApiUsage };
  users: User[];
  error: ApiError;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: OrganizationState = {
  details: undefined,
  projects: undefined,
  usage: undefined,
  users: undefined,
  error: undefined,
  status: 'idle',
};

export const loadOrganizationAsync = createAsyncThunk(
  'organization/getById',
  async (params: { organizationId: string }) => {
    return {
      details: await ApiConnector.organizations.get(params.organizationId),
      projects: await ApiConnector.organizations.projects(
        params.organizationId
      ),
      usage: await ApiConnector.organizations.usage(params.organizationId),
      users: await ApiConnector.organizations.users.list(params.organizationId),
    };
  }
);

export const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    userAdd: (state, payload: PayloadAction<User>) => {
      state.users.push(payload.payload);
    },
    userRemove: (state, payload: PayloadAction<User>) => {
      state.users = state.users.filter((u) => u.id !== payload.payload.id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadOrganizationAsync.pending, (state) => {
        state.status = 'loading';
        state.projects = undefined;
        state.users = undefined;
        state.error = undefined;
      })
      .addCase(loadOrganizationAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        if ('error' in action.payload.details) {
          state.error = action.payload.details.error;
        } else {
          state.details = action.payload.details.organization;
        }
        if ('error' in action.payload.projects) {
          state.error = action.payload.projects.error;
        } else {
          state.projects = action.payload.projects;
        }
        if ('error' in action.payload.usage) {
          state.error = action.payload.usage.error;
        } else {
          state.usage = action.payload.usage.usage;
        }
        if ('error' in action.payload.users) {
          state.error = action.payload.users.error;
        } else {
          state.users = action.payload.users.users;
        }
      })
      .addCase(loadOrganizationAsync.rejected, (state) => {
        state.status = 'failed';
        state.error = {
          code: ErrorCode.serverError,
          message: 'Failed to retrieve organization',
          statusCode: 500,
        };
      });
  },
});

export const selectOrganizationDetails = (state: RootState) =>
  state.organization.details;
export const selectOrganizationProjects = (state: RootState) =>
  state.organization.projects;
export const selectOrganizationUsage = (state: RootState) =>
  state.organization.usage;
export const selectOrganizationUsers = (state: RootState) =>
  state.organization.users;
export const selectOrganizationErrors = (state: RootState) =>
  state.organization.error;

export const organizationActions = organizationSlice.actions;

export default organizationSlice.reducer;
