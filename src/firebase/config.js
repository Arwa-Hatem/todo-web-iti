// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5SAoUpX9lWANuRKS-3LTS6r_iA0uRFmM",
  authDomain: "todo-iti.firebaseapp.com",
  projectId: "todo-iti",
  storageBucket: "todo-iti.appspot.com",
  messagingSenderId: "426485232513",
  appId: "1:426485232513:web:e88ef0a656c660bd9dee80",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
