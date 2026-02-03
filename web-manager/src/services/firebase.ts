// Import Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuration Firebase (même config que mobile)
const firebaseConfig = {
  apiKey: "AIzaSyBsyEY-00HehGTX7Ofy-lS6BFscumv3nHk",
  authDomain: "auth-notif-ef20f.firebaseapp.com",
  projectId: "auth-notif-ef20f",
  storageBucket: "auth-notif-ef20f.firebasestorage.app",
  messagingSenderId: "234682122750",
  appId: "1:234682122750:web:c38f4b07bfb828b91f40af"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Exporter les services Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
