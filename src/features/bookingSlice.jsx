import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db, ref, push, get } from "../firebase";

// Async thunk to create a booking in Firebase
export const createBooking = createAsyncThunk(
  "bookings/createBooking",
  async (
    { userId, propertyId, checkInDate, checkOutDate, numberOfPeople },
    { rejectWithValue }
  ) => {
    try {
      // Get the property owner's ID from Firebase
      const propertyRef = ref(db, `properties/${propertyId}`);
      const snapshot = await get(propertyRef);

      if (!snapshot.exists()) {
        return rejectWithValue("Property not found.");
      }

      const propertyData = snapshot.val();
      const ownerId = propertyData.ownerId; // Get owner ID

      // Create new booking entry in Firebase
      const newBookingRef = push(ref(db, "bookings"));
      await newBookingRef.set({
        id: newBookingRef.key, // Store Firebase-generated ID
        userId,
        propertyId,
        ownerId,
        checkInDate,
        checkOutDate,
        numberOfPeople,
        bookingDate: new Date().toISOString(),
        status: "pending",
      });

      return {
        id: newBookingRef.key,
        userId,
        propertyId,
        ownerId,
        checkInDate,
        checkOutDate,
        numberOfPeople,
        status: "pending",
      };
    } catch (error) {
      console.error("Error creating booking:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Fetch all bookings (useful for owner dashboard later)
export const fetchBookings = createAsyncThunk(
  "bookings/fetchBookings",
  async (_, { rejectWithValue }) => {
    try {
      const bookingsRef = ref(db, "bookings");
      const snapshot = await get(bookingsRef);

      if (!snapshot.exists()) {
        return [];
      }

      const bookingsArray = Object.keys(snapshot.val()).map((key) => ({
        id: key,
        ...snapshot.val()[key],
      }));

      return bookingsArray;
    } catch (error) {
      console.error("Error fetching bookings:", error);
      return rejectWithValue(error.message);
    }
  }
);

const bookingSlice = createSlice({
  name: "bookings",
  initialState: {
    bookings: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.push(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default bookingSlice.reducer;
