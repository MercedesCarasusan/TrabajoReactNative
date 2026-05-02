import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBR0W7nLe3VguWZWqRBLtjUlcRvtLpLHsk",
  authDomain: "fitness-app-expo-d75ec.firebaseapp.com",
  projectId: "fitness-app-expo-d75ec",
  storageBucket: "fitness-app-expo-d75ec.firebasestorage.app",
  messagingSenderId: "1023119196874",
  appId: "1:1023119196874:web:28a94492555b4ccb456a33"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Servicios
export const auth = getAuth(app);
export const db = getFirestore(app);