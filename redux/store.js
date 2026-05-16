import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import trainingReducer from './slices/trainingSlice';
import profileReducer from './slices/profileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    trainings: trainingReducer,
    profile: profileReducer
  }
});
