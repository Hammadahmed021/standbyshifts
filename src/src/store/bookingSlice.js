// bookingSlice.js
import { createSlice } from "@reduxjs/toolkit";

let nextId = 1; // Used for generating unique IDs

const initialState = [];

const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    addBooking: (state, action) => {
      state.push({ ...action.payload, id: nextId++ }); // Ensure each booking has a unique ID
    },
    clearBookingById: (state, action) => {
      const index = state.findIndex((booking) => booking.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1); // Remove booking by ID
      }
    },
    clearAllBookings: (state) => {
      state.splice(0, state.length); // Clear all bookings by resetting state to an empty array
    },
  },
});

export const { addBooking, clearBookingById, clearAllBookings } = bookingSlice.actions;
export default bookingSlice.reducer;
