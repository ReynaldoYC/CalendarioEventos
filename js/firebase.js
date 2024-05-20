import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCJShYpj770vafPLVHxrNlefmEMbmmfZ8",
  authDomain: "administradoreventos.firebaseapp.com",
  projectId: "administradoreventos",
  storageBucket: "administradoreventos.appspot.com",
  messagingSenderId: "716079131272",
  appId: "1:716079131272:web:a0d8cc24af22b2a2d94d3d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
 