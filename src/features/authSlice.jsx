import { createSlice } from "@reduxjs/toolkit";
import { auth, db, googleProvider } from "../firebase";
import { ref, set, get } from "firebase/database";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
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

const loadUserFromStorage = () => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
};

export const loginUser = (email, password) => async (dispatch) => {
  dispatch(setLoading(true));
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
      userData.role = userDetails.role || "visitor";
      localStorage.setItem("user", JSON.stringify(userData));
    }

    dispatch(setUser(userData));
  } catch (error) {
    dispatch(setError(error.message || "An unknown error occurred"));
  } finally {
    dispatch(setLoading(false));
  }
};

export const signupUser = (email, password, name) => async (dispatch) => {
  dispatch(setLoading(true));
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
    dispatch(setUser(fullUserData));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const loginWithGoogle = () => async (dispatch) => {
  dispatch(setLoading(true));
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
      });
    }

    const fullUserData = {
      ...userData,
      role: "visitor",
      name: user.displayName || "Guest",
    };
    localStorage.setItem("user", JSON.stringify(fullUserData));
    dispatch(setUser(fullUserData));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

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
    setUser: (state, action) => {
      state.user = action.payload;
      state.role = action.payload.role;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer;
