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
        // Remove item if it is already in the favorites
        state.items = state.items.filter(id => id !== itemId);
      } else {
        // Add item to the favorites
        state.items = [...state.items, itemId];
      }
    },
  },
});

export const { toggleFavorite } = favoriteSlice.actions;

export default favoriteSlice.reducer;
