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
      // Fetch property details from Firebase
      const propertyRef = ref(db, `properties/${propertyId}`);
      const propertySnapshot = await get(propertyRef);

      if (!propertySnapshot.exists()) {
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

      // Save the booking to the "bookings" collection
      await set(newBookingRef, booking);

      // Save the booking to the landlord's dashboard
      const landlordBookingRef = ref(
        db,
        `landlordDashboard/${ownerId}/bookings/${bookingId}`
      );
      await set(landlordBookingRef, booking);

      return booking;
    } catch (error) {
      console.error("Error creating booking:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch all bookings (useful for admin or landlord dashboards)
export const fetchBookings = createAsyncThunk(
  "bookings/fetchBookings",
  async (_, { rejectWithValue }) => {
    try {
      const bookingsRef = ref(db, "bookings");
      const snapshot = await get(bookingsRef);

      if (!snapshot.exists()) {
        return []; // Return empty array if no bookings exist
      }

      // Convert Firebase object to an array of bookings
      const bookingsArray = Object.keys(snapshot.val()).map((key) => ({
        id: key,
        ...snapshot.val()[key],
      }));

      return bookingsArray; // Return the array of bookings
    } catch (error) {
      console.error("Error fetching bookings:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch bookings for a specific landlord
export const fetchLandlordBookings = createAsyncThunk(
  "bookings/fetchLandlordBookings",
  async (landlordId, { rejectWithValue }) => {
    try {
      const landlordBookingsRef = ref(
        db,
        `landlordDashboard/${landlordId}/bookings`
      );
      const snapshot = await get(landlordBookingsRef);

      if (!snapshot.exists()) {
        return []; // Return empty array if no bookings exist
      }

      // Convert Firebase object to an array of bookings
      const bookingsArray = Object.keys(snapshot.val()).map((key) => ({
        id: key,
        ...snapshot.val()[key],
      }));

      return bookingsArray; // Return the array of bookings
    } catch (error) {
      console.error("Error fetching landlord bookings:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Define the initial state for the bookings slice
const initialState = {
  bookings: [], // Array of all bookings
  landlordBookings: [], // Array of bookings for a specific landlord
  loading: false, // Loading state
  error: null, // Error message
};

// Create the bookings slice
const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    // Add any additional reducers here if needed
  },
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
      })

      // Handle fetchBookings actions
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload; // Set the fetched bookings
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set the error message
      })

      // Handle fetchLandlordBookings actions
      .addCase(fetchLandlordBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLandlordBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.landlordBookings = action.payload; // Set the fetched landlord bookings
      })
      .addCase(fetchLandlordBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set the error message
      });
  },
});

// Export the reducer
export default bookingSlice.reducer;
