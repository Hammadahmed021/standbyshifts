// rootReducer.js
import { combineReducers } from '@reduxjs/toolkit';
import HomeSlice from './homeSlice';
import AuthSlice from './authSlice';
import bookingSlice from './bookingSlice';
import favoriteSlice from './favoriteSlice';
import notificationSlice from './notificationSlice';

const rootReducer = combineReducers({
  home: HomeSlice,
  auth: AuthSlice,
  bookings: bookingSlice,
  favorites: favoriteSlice,
  notification: notificationSlice,
});

export default rootReducer;
