import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ref, get, update } from "firebase/database";  // Add update from Firebase
import { db } from "../firebase";

// Async thunk to fetch offices from Firebase
export const fetchOffices = createAsyncThunk(
  "offices/fetchOffices",
  async (_, { rejectWithValue }) => {
    try {
      const officesRef = ref(db, "properties");
      const snapshot = await get(officesRef);

      if (snapshot.exists()) {
        const officesData = snapshot.val();
        // Convert Firebase object to an array of offices with `id` field
        const officesArray = Object.keys(officesData).map((key) => ({
          id: key,
          ...officesData[key],
        }));
        return officesArray;
      } else {
        return rejectWithValue("No properties found.");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for soft deleting an office (updating its 'deleted' status)
export const softDeleteOffice = createAsyncThunk(
  "offices/softDeleteOffice",
  async (officeId, { rejectWithValue }) => {
    try {
      const officeRef = ref(db, `properties/${officeId}`);
      await update(officeRef, {
        deleted: true,  // Mark the office as deleted (soft delete)
      });
      return officeId; // Return the office ID to update the state locally
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  offices: [], // Array of properties
  loading: false,
  error: null,
};

const officesSlice = createSlice({
  name: "offices",
  initialState,
  reducers: {
    // Set the list of offices (properties) in the state
    setOffices: (state, action) => {
      state.offices = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOffices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOffices.fulfilled, (state, action) => {
        state.loading = false;
        state.offices = action.payload;
      })
      .addCase(fetchOffices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(softDeleteOffice.pending, (state) => {
        state.loading = true;
      })
      .addCase(softDeleteOffice.fulfilled, (state, action) => {
        state.loading = false;
        // Update the state by marking the office as deleted locally
        state.offices = state.offices.map((office) =>
          office.id === action.payload ? { ...office, deleted: true } : office
        );
      })
      .addCase(softDeleteOffice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { setOffices } = officesSlice.actions;

// Export reducer
export default officesSlice.reducer;
