// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "youth-opportunities-hub-iv0ix",
  "appId": "1:392350583650:web:7001a6d04c65c368cbba3b",
  "storageBucket": "youth-opportunities-hub-iv0ix.firebasestorage.app",
  "apiKey": "AIzaSyBk50N-T8YqVlcOjvyAK6zqLVCRID7sXBo",
  "authDomain": "youth-opportunities-hub-iv0ix.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "392350583650"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
