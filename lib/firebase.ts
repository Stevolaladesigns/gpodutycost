import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCSWe43s7FK50OvckdcSHPzAlg2ajVeEEA",
  authDomain: "gpodutycost.firebaseapp.com",
  projectId: "gpodutycost",
  storageBucket: "gpodutycost.firebasestorage.app",
  messagingSenderId: "437877958035",
  appId: "1:437877958035:web:1e4ff3e08b842b8759f466"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
