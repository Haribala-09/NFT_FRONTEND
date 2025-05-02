// src/firebase.jsx
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database'; // Importing Realtime Database function
import { getFirestore } from 'firebase/firestore'; // Firestore
import { getStorage } from 'firebase/storage'; // Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyCheFDH1udW_XCsKc4Z5pKFw-8by6a5hV4",
  authDomain: "marketplace-8d3a7.firebaseapp.com",
  databaseURL: "https://marketplace-8d3a7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "marketplace-8d3a7",
  storageBucket: "marketplace-8d3a7.firebasestorage.app",
  messagingSenderId: "158316099203",
  appId: "1:158316099203:web:a4a07176464e3453a5cdb6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exporting Firebase services to be used in other parts of the app
export const auth = getAuth(app);
export const database = getDatabase(app); // Realtime Database
export const firestore = getFirestore(app); // Firestore
export const storage = getStorage(app); // Firebase Storage
