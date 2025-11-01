// Firebase Core Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider 
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

import { 
  getFirestore 
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

// Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCqwVQx8NbHucvpYmftMG3uSsTFQ5WBWM0",
  authDomain: "soultabs-c814d.firebaseapp.com",
  projectId: "soultabs-c814d",
  storageBucket: "soultabs-c814d.firebasestorage.app",
  messagingSenderId: "51287038225",
  appId: "1:51287038225:web:f8afac352a833f362214b0",
  measurementId: "G-B24FPHB1GC"
};

// Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Export to index.html
export { app, auth, db, googleProvider };
