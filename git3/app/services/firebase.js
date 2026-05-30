import { initializeApp, getApps, getApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAvM2jC7uOv5yBVHicpNN7W-3szf7maaxc",
  authDomain: "moviesapprn.firebaseapp.com",
  projectId: "moviesapprn",
  storageBucket: "moviesapprn.firebasestorage.app",
  messagingSenderId: "128641615072",
  appId: "1:128641615072:web:6db0642be27509dec9bc85",
};

export const TMDB_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MDljN2FiYjA4ZWI3ODlkMmE5NWYwYjg4NmI5YTlmZSIsIm5iZiI6MTc3OTMwNzg3Ny43NzcsInN1YiI6IjZhMGUxNTY1MjM2YWU3ZGNkYWZmNGNiZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.dhx2QrQ77hAc0tLi2XIR7TpFH071oy1idtFtOtbDXUE";

// 1. Safe instance checker for hot-reloads
const app = getApps().length === 0 ? initializeApp(FIREBASE_CONFIG) : getApp();

// 2. Safe Auth initializer with AsyncStorage persistence
let authInstance;
try {
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  const { getAuth } = require("firebase/auth");
  authInstance = getAuth(app);
}

export const auth = authInstance;