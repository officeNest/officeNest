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

// Load user from localStorage (if exists)
const loadUserFromStorage = () => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
};

// Login user
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

      const userRef = ref(db, `users/${userCredential.user.uid}`);
      const userSnapshot = await get(userRef);

      if (userSnapshot.exists()) {
        const userDetails = userSnapshot.val();
        userData.name = userDetails.name || "Guest";

        localStorage.setItem("user", JSON.stringify(userData));
      }

      return { success: true, ...userData };
    } catch (error) {
      return rejectWithValue(error.message || "An unknown error occurred");
    }
  }
);

// Signup user
export const signupUser = createAsyncThunk(
  "auth/signup",
  async ({ email, password, name }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const userData = extractUserData(user);

      await set(ref(db, `users/${user.uid}`), {
        uid: user.uid,
        email: user.email,
        role: "visitor",
        name,
        status: "pending",
      });

      const fullUserData = { ...userData, role: "visitor", name };

      localStorage.setItem("user", JSON.stringify(fullUserData));

      return fullUserData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Logout user
export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("user");
  dispatch(logout());
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: loadUserFromStorage(),
    role: loadUserFromStorage()?.role || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.role = null;
      localStorage.removeItem("user");
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
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
