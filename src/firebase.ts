import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAshhmYeUN8R797PkPrKF_b5cM0W2H7Eao",
  authDomain: "wolf-customs-5ce9c.firebaseapp.com",
  projectId: "wolf-customs-5ce9c",
  storageBucket: "wolf-customs-5ce9c.firebasestorage.app",
  messagingSenderId: "205863790299",
  appId: "1:205863790299:web:9da32cde064ee067844efe",
  measurementId: "G-1RGMVLRFMF"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firestore (Database) and Storage
export const db = getFirestore(app);
export const storage = getStorage(app);
