import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../firebase"; // Adjust the import path to your Firebase config
import { ref, get, set } from "firebase/database";


// Fetch all users with role = "owner" and status = "pending"
export const fetchPendingOwnerRequests = createAsyncThunk(
  "requests/fetchPendingOwnerRequests",
  async (_, { rejectWithValue }) => {
    try {
      const usersRef = ref(db, "users");
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        const users = snapshot.val();
        const pendingOwners = Object.values(users).filter(
          (user) => user.role === "owner" && user.status === "pending"
        );
        return pendingOwners;
      } else {
        return rejectWithValue("No users found");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update the status of a user request
export const updateRequestStatus = createAsyncThunk(
  "requests/updateRequestStatus",
  async ({ requestId, status }, { rejectWithValue }) => {
    try {
      const userRef = ref(db, `users/${requestId}`);
      await set(userRef, { status }, { merge: true }); // Update only the status field
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
      // Fetch pending owner requests
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
      // Update request status
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
