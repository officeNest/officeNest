import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth, db, googleProvider } from "../firebase";
import { ref, set, get, onValue } from "firebase/database";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const extractUserData = (user) => {
  return {
    uid: user.uid,
    email: user.email,
    emailVerified: user.emailVerified,
    displayName: user.displayName,
    photoURL: user.photoURL,
    flage: user.flage,
  };
};

// Load user from localStorage if available
const loadUserFromStorage = () => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
};

// Async thunk for logging in a user
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userData = extractUserData(userCredential.user);

      const userRef = ref(db, `users/${userCredential.user.uid}`);
      const userSnapshot = await get(userRef);

      if (userSnapshot.exists()) {
        const userDetails = userSnapshot.val();
        userData.name = userDetails.name || "Guest";
        userData.role = userDetails.role || "visitor";
      }

      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      return rejectWithValue(
        error.message || "An error occurred while logging in"
      );
    }
  }
);

// Async thunk for signing up a new user
export const signupUser = createAsyncThunk(
  "auth/signup",
  async ({ email, password, name }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userData = extractUserData(user);

      await set(ref(db, `users/${user.uid}`), {
        uid: user.uid,
        email: user.email,
        role: "visitor",
        name,
        status: "pending",
        flage:false,
      });

      const fullUserData = { ...userData,flage: false, role: "visitor", name };

      localStorage.setItem("user", JSON.stringify(fullUserData));
      return fullUserData;
    } catch (error) {
      return rejectWithValue(error.message || "Signup failed");
    }
  }
);

// Async thunk for logging in with Google
export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userData = extractUserData(user);

      const userRef = ref(db, `users/${user.uid}`);
      const userSnapshot = await get(userRef);

      if (!userSnapshot.exists()) {
        await set(userRef, {
          uid: user.uid,
          email: user.email,
          role: "visitor",
          name: user.displayName || "Guest",
          status: "active",
          flage: false,
        });
      }

      const fullUserData = {
        ...userData,
        role: "visitor",
        flage: false,
        name: user.displayName || "Guest",
      };
      localStorage.setItem("user", JSON.stringify(fullUserData));
      return fullUserData;
    } catch (error) {
      return rejectWithValue(error.message || "Google login failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    await signOut(auth);
    localStorage.removeItem("user");
    dispatch(logout());
  }
);

// Create the auth slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: loadUserFromStorage(),
    role: loadUserFromStorage()?.role || "visitor",
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.role = "visitor";
      localStorage.removeItem("user");
    },
    updateUserRole: (state, action) => {
      if (state.user) {
        state.user.role = action.payload;
        state.role = action.payload;
      }
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
        state.role = action.payload.role;
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
      })
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.role = action.payload.role;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.role = "visitor";
      });
  },
});

// Export actions and reducer
export const { logout, updateUserRole } = authSlice.actions;
export default authSlice.reducer;
