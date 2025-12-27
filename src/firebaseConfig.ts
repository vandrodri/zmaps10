import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBkfiIILeLx-VCqoOxtWNY_moyxq_cssYQ",
  authDomain: "zmaps-pro.firebaseapp.com",
  projectId: "zmaps-pro",
  storageBucket: "zmaps-pro.firebasestorage.app",
  messagingSenderId: "241283338788",
  appId: "1:241283338788:web:1a4114bcac8c7d51d13eb1",
  measurementId: "G-6HPY94QJVE"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
