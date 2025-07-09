// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYiNXgIh-C8jwL5hijC6JGqWBn4TQwsts",
  authDomain: "anorthdeca-291fd.firebaseapp.com",
  projectId: "anorthdeca-291fd",
  storageBucket: "anorthdeca-291fd.firebasestorage.app",
  messagingSenderId: "670460601436",
  appId: "1:670460601436:web:f4f9394b2007c521737299",
  measurementId: "G-JHMTG8YBMN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth();
const provider = new GoogleAuthProvider();

auth.languageCode = 'it';

const firebaseErrorMap = {
  "auth/email-already-in-use": "Email already registered.",
  "auth/invalid-email": "Email not valid.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/user-not-found": "No account found with that email.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/missing-password": "Please enter your password.",
  "auth/too-many-requests": "Too many attempts.",
  "auth/network-request-failed": "Network error.",
};

function translateErr() {

}

export { auth, provider, firebaseErrorMap };