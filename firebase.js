// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCqwVQx8NbHucvpYmftMG3uSsTFQ5WBWM0",
  authDomain: "soultabs-c814d.firebaseapp.com",
  projectId: "soultabs-c814d",
  storageBucket: "soultabs-c814d.firebasestorage.app",
  messagingSenderId: "51287038225",
  appId: "1:51287038225:web:f8afac352a833f362214b0",
  measurementId: "G-B24FPHB1GC"
};

// ✅ Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
