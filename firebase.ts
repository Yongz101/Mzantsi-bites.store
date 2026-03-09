
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCZqyfWFwjqiCeb7Pklpyq44d0esSFhY1I",
  authDomain: "mzantsi-bites.firebaseapp.com",
  projectId: "mzantsi-bites",
  storageBucket: "mzantsi-bites.firebasestorage.app",
  messagingSenderId: "66791392386",
  appId: "1:66791392386:web:593ac689ad087955a1e09b",
  measurementId: "G-LPLLD23TFH"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
