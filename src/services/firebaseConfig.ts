// src/services/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBVEqQ3OpaRdzbvCVKG23qDRSr895Gv6bA",
  authDomain: "cartatienda.firebaseapp.com",
  projectId: "cartatienda",
  storageBucket: "cartatienda.firebasestorage.app",
  messagingSenderId: "582597474616",
  appId: "1:582597474616:web:c37179ad8abf29c6c229cd"
};


// Inicializa la app de Firebase
const app = initializeApp(firebaseConfig);

// Exporta servicios que usarás
export const auth = getAuth(app);
export const db = getFirestore(app);
