// features/favorites/favoriteSlice.js

import { createSlice } from '@reduxjs/toolkit';

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: [], // Array of favorite item IDs
  },
  reducers: {
    toggleFavorite(state, action) {
      const itemId = action.payload;
      if (state.items.includes(itemId)) {
        state.items = state.items.filter(id => id !== itemId);
      } else {
        state.items.push(itemId);
      }
    },
    setFavorites(state, action) {
      state.items = action.payload;
    },
  },
});

export const { toggleFavorite, setFavorites } = favoriteSlice.actions;

export default favoriteSlice.reducer;
