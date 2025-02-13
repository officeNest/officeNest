// src/features/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  email: "",
  role: "",
  status: "",
  propertyCount: 0,
  uid: "",
  phone: "",
  city: "",
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      // Update the state with the user's profile data
      const { name, email, role, status, propertyCount, uid, phone, city } =
        action.payload;
      state.name = name;
      state.email = email;
      state.role = role;
      state.status = status;
      state.propertyCount = propertyCount;
      state.uid = uid;
      state.phone = phone;
      state.city = city;
    },
    setLoading: (state, action) => {
      // Set the loading state
      state.loading = action.payload;
    },
    setError: (state, action) => {
      // Set the error message
      state.error = action.payload;
    },
    resetUserProfile: (state) => {
      // Reset the user's profile to initial state
      state.name = "";
      state.email = "";
      state.role = "";
      state.status = "";
      state.propertyCount = 0;
      state.uid = "";
      state.phone = "";
      state.city = "";
      state.loading = false;
      state.error = null;
    },
  },
});

// Export the actions
export const { setUserProfile, setLoading, setError, resetUserProfile } =
  userSlice.actions;

// Export the reducer
export default userSlice.reducer;
