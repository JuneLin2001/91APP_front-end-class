// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "f2e-2bac8.firebaseapp.com",
  projectId: "f2e-2bac8",
  storageBucket: "f2e-2bac8.appspot.com",
  messagingSenderId: "1090396320136",
  appId: "1:1090396320136:web:5efeb2385745e378940a3d",
  measurementId: "G-71LMXD9XE3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const provider = new GithubAuthProvider();

export { auth, provider };
