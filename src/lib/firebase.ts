import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDyuIRgZPlzUgoSdGUNvWW26FB7syJK1qI",
  authDomain: "admin-laptopzonelb.firebaseapp.com",
  projectId: "admin-laptopzonelb",
  storageBucket: "admin-laptopzonelb.firebasestorage.app",
  messagingSenderId: "494909338315",
  appId: "1:494909338315:web:273bb74064da35f066214e",
  measurementId: "G-FZS2F0K4GV"
};


export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
