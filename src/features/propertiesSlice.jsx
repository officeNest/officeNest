import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../firebase";
import { ref, get } from "firebase/database";

export const fetchProperties = createAsyncThunk(
  "properties/fetchProperties",
  async (_, { getState, rejectWithValue }) => {
    const { user } = getState().auth;

    if (!user || !user.uid) {
      return rejectWithValue("User not logged in");
    }

    try {
      const propertiesRef = ref(db, `properties/${user.uid}`);
      const snapshot = await get(propertiesRef);

      if (snapshot.exists()) {
        return Object.entries(snapshot.val()).map(([id, property]) => ({
          id,
          ...property,
        }));
      } else {
        return [];
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// إنشاء Slice للعقارات
const propertiesSlice = createSlice({
  name: "properties",
  initialState: {
    properties: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default propertiesSlice.reducer;
