import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db, ref, push, get, set } from "../firebase"; // Import Firebase functions

// Async thunk to create a booking in Firebase
export const createBooking = createAsyncThunk(
  "bookings/createBooking",
  async (
    { userId, propertyId, checkInDate, checkOutDate, numberOfPeople },
    { rejectWithValue }
  ) => {
    try {
      console.log("Creating booking with data:", {
        userId,
        propertyId,
        checkInDate,
        checkOutDate,
        numberOfPeople,
      });

      // Fetch property details from Firebase
      const propertyRef = ref(db, `properties/${propertyId}`);
      const propertySnapshot = await get(propertyRef);

      if (!propertySnapshot.exists()) {
        console.error("Property not found.");
        return rejectWithValue("Property not found.");
      }

      const propertyData = propertySnapshot.val();
      const ownerId = propertyData.ownerId; // Ensure the property has an ownerId field

      // Generate a new booking ID
      const newBookingRef = push(ref(db, "bookings"));
      const bookingId = newBookingRef.key;

      // Create the booking object
      const booking = {
        id: bookingId,
        userId,
        propertyId,
        ownerId,
        checkInDate,
        checkOutDate,
        numberOfPeople,
        bookingDate: new Date().toISOString(),
        status: "pending",
      };

      console.log("Saving booking to Firebase:", booking);

      // Save the booking to the "bookings" collection
      await set(newBookingRef, booking);

      // Save the booking to the landlord's dashboard
      const landlordBookingRef = ref(
        db,
        `landlordDashboard/${ownerId}/bookings/${bookingId}`
      );
      await set(landlordBookingRef, booking);

      console.log("Booking saved successfully.");
      return booking;
    } catch (error) {
      console.error("Error creating booking:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Define the initial state for the bookings slice
const initialState = {
  bookings: [], // Array of all bookings
  loading: false, // Loading state
  error: null, // Error message
};

// Create the bookings slice
const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle createBooking actions
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.push(action.payload); // Add the new booking to the state
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set the error message
      });
  },
});

// Export the reducer
export default bookingSlice.reducer;
