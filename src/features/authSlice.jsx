import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth, db } from "../firebase";
import { ref, set, get } from "firebase/database";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const extractUserData = (user) => {
  return {
    uid: user.uid,
    email: user.email,
    emailVerified: user.emailVerified,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userData = extractUserData(userCredential.user);

      // Fetch additional user data (role, status, etc.)
      const userRef = ref(db, `users/${userCredential.user.uid}`);
      const snapshot = await get(userRef);
      const userDbData = snapshot.val();

      return {
        success: true,
        ...userData,
        role: userDbData.role,
        status: userDbData.status,
      };
    } catch (error) {
      console.error("Login error details:", error);
      return rejectWithValue(error.message || "An unknown error occurred");
    }
  }
);

export const signupUser = createAsyncThunk(
  "auth/signup",
  async (
    {
      email,
      password,
      role,
      name,
      propertyCount,
      businessName,
      phoneNumber,
      address,
    },
    { rejectWithValue }
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const userData = extractUserData(user);

      const userRef = ref(db, `users/${user.uid}`);
      await set(userRef, {
        uid: user.uid,
        email: user.email,
        role,
        name,
        propertyCount: role === "landlord" ? propertyCount : 0,
        status: "pending",
        ...(role === "landlord" && {
          businessName,
          phoneNumber,
          address,
        }),
      });

      console.log("User data successfully stored in Firebase Database");

      return {
        success: true,
        ...userData,
        role,
        name,
        propertyCount,
        businessName,
        phoneNumber,
        address,
      };
    } catch (error) {
      console.error("Error storing user data in Firebase Database:", error);
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    role: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.role = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.role = action.payload.role;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
