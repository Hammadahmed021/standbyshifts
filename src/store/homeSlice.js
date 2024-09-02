import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getListDetails } from "../utils/Api";

const initialState = {
  url: {}, // Initialize url as an empty object
  loading: false,
  error: null,
};

export const fetchApiData = createAsyncThunk(
  "home/fetchApiData",
  async (url, { rejectWithValue }) => {
    try {
      const data = await getListDetails(url);
      return { url, data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const HomeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApiData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApiData.fulfilled, (state, action) => {
        const { url, data } = action.payload;

        // Ensure the `url` object exists before setting properties on it
        if (!state.url) {
          state.url = {};
        }

        state.url[url] = data;
        state.loading = false;
      })
      .addCase(fetchApiData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default HomeSlice.reducer;
