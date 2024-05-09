//npm i @reduxjs/toolkit react-redux
import { configureStore } from '@reduxjs/toolkit';
import userAuthorReducer from './slices/userAuthorSlice';

export const store = configureStore({
  reducer: {
    userAuthorLoginReducer:userAuthorReducer
  },
});