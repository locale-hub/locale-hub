import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import projectReducer from './slices/projectSlice';
import organizationReducer from './slices/organizationSlice';

export const store = configureStore({
  reducer: {
    project: projectReducer,
    organization: organizationReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
