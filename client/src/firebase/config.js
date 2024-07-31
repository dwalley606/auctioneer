// src/firebase/config.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC8g-optTCtJlHVZkgNz71NA2ZD-V5F_9s",
  authDomain: "auctioneer-10f39.firebaseapp.com",
  projectId: "auctioneer-10f39",
  storageBucket: "auctioneer-10f39.appspot.com",
  messagingSenderId: "92992834492",
  appId: "1:92992834492:web:03462841657e96cf1639b9",
  measurementId: "G-7CEQP0EPV5",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
