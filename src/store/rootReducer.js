// rootReducer.js
import { combineReducers } from '@reduxjs/toolkit';
import HomeSlice from './homeSlice';
import AuthSlice from './authSlice';

const rootReducer = combineReducers({
  home: HomeSlice,
  auth: AuthSlice
});

export default rootReducer;
