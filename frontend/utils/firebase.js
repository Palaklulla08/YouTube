// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth ,GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_APIKEY ,
  authDomain: "login-e3c2a.firebaseapp.com",
  projectId: "login-e3c2a",
  storageBucket: "login-e3c2a.firebasestorage.app",
  messagingSenderId: "256639554676",
  appId: "1:256639554676:web:cf385e60cfb202a1f96d21"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {auth , provider};