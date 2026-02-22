import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCJah4JpGbSzB2bV3F_K_1U46-nbtCiMFk",
  authDomain: "eatery-express-49sb5.firebaseapp.com",
  databaseURL: "https://eatery-express-49sb5-default-rtdb.firebaseio.com",
  projectId: "eatery-express-49sb5",
  storageBucket: "eatery-express-49sb5.firebasestorage.app",
  messagingSenderId: "179001430790",
  appId: "1:179001430790:web:703a3c5a13397de7c14487",
  measurementId: "G-45HEDK6QDT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics conditionally (it doesn't work in all environments)
export const analyticsPromise = isSupported().then(yes => yes ? getAnalytics(app) : null);

export default app;
