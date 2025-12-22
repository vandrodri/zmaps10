import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBkfiIILeLx-VCqoOxtWNY_moyxq_cssYQ",
  authDomain: "zmaps-pro.firebaseapp.com",
  projectId: "zmaps-pro",
  storageBucket: "zmaps-pro.firebasestorage.app",
  messagingSenderId: "241283338788",
  appId: "1:241283338788:web:1a4114bcac8c7d51d13eb1",
  measurementId: "G-6HPY94QJVE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;