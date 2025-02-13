import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database"; // Import Realtime Database
import { getStorage } from "firebase/storage";
import { ref, push, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDUJc9ZGLKLbm7vSb5eiQg7i-vFnAjAd3k",
  authDomain: "officenest-380c1.firebaseapp.com",
  databaseURL: "https://officenest-380c1-default-rtdb.firebaseio.com",
  projectId: "officenest-380c1",
  storageBucket: "officenest-380c1.firebasestorage.app",
  messagingSenderId: "1413113770",
  appId: "1:1413113770:web:9b3aee3af672dacf842dd3",
  measurementId: "G-1V4QX70XKH",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export { ref, push, onValue, app };
