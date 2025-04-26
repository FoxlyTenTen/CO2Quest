// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjIESsmFJpUi9lzhP301Bem_d5MkfVjSs",
  authDomain: "co2quest-de701.firebaseapp.com",
  projectId: "co2quest-de701",
  storageBucket: "co2quest-de701.firebasestorage.app",
  messagingSenderId: "496663034609",
  appId: "1:496663034609:web:dce05784dfd0eb6ae38750"
};

// Initialize Firebase


// ✅ Export only what you use

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // ✅ Initialize Firestore correctly

export { app, auth, db };