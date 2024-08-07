// store/homeSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getListDetails } from "../utils/Api";

const initialState = {
  url: {},
  loading: false,
  error: null
};

export const fetchApiData = createAsyncThunk(
  'home/fetchApiData',  // Changed to match slice name
  async (url, { rejectWithValue }) => {
    try {
      const data = await getListDetails(url);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const HomeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApiData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApiData.fulfilled, (state, action) => {
        state.url[action.meta.arg] = action.payload;
        state.loading = false;
      })
      .addCase(fetchApiData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default HomeSlice.reducer;
