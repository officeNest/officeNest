// bookingSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { db } from "../firebase"; // Assuming you have a Firebase config file
import { ref, set, push } from "firebase/database";

const initialState = {
  checkInDate: "",
  checkOutDate: "",
  numberOfPeople: 1,
  officeId: "",
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBookingDetails(state, action) {
      const { field, value } = action.payload;
      state[field] = value;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    resetBooking(state) {
      state.checkInDate = "";
      state.checkOutDate = "";
      state.numberOfPeople = 1;
      state.officeId = "";
    },
  },
});

export const { setBookingDetails, setLoading, setError, resetBooking } =
  bookingSlice.actions;

export const saveBooking = (bookingData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const newBookingRef = push(ref(db, "bookings")); // Save to Firebase bookings collection
    await set(newBookingRef, bookingData);
    dispatch(resetBooking()); // Reset form after successful submission
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export default bookingSlice.reducer;
