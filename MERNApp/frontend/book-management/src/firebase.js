// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "book-management-426009.firebaseapp.com",
  projectId: "book-management-426009",
  storageBucket: "book-management-426009.appspot.com",
  messagingSenderId: "952901711989",
  appId: "1:952901711989:web:9693fe0ef8db5e7673a03c",
  measurementId: "G-6JP73P84WE"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);