import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../firebase"; // Adjust the import path to your Firebase config
import { ref, get, set , update } from "firebase/database";


// Fetch all users with role = "owner" and status = "pending"
export const fetchPendingOwnerRequests = createAsyncThunk(
  "requests/fetchPendingOwnerRequests",
  async (_, { rejectWithValue }) => {
    try {
      const usersRef = ref(db, "users");
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        const users = snapshot.val();
        const pendingOwners = Object.entries(users)
          .filter(([key, user]) => user.role === "owner" && user.status === "pending")
          .map(([key, user]) => ({ uid: key, ...user })); // Include UID in the object
        return pendingOwners;
      } else {
        return rejectWithValue("No users found");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Correctly Update User Status in Firebase
export const updateRequestStatus = createAsyncThunk(
  "requests/updateRequestStatus",
  async ({ requestId, status }, { rejectWithValue }) => {
    try {
      const userRef = ref(db, `users/${requestId}`);
      await update(userRef, { status }); // ✅ Use update() instead of set()

      return { requestId, status };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const requestsSlice = createSlice({
  name: "requests",
  initialState: {
    requests: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingOwnerRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingOwnerRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchPendingOwnerRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateRequestStatus.fulfilled, (state, action) => {
        const { requestId, status } = action.payload;
        const request = state.requests.find((req) => req.uid === requestId);
        if (request) {
          request.status = status;
        }
      })
      .addCase(updateRequestStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default requestsSlice.reducer;
