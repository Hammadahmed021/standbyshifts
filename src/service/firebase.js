import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
//GetAuth Method is used to Configure our app to use Firebase Authentication
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY_FB,
  authDomain: import.meta.env.VITE_AUTHDOMAIN_FB,
  projectId: import.meta.env.VITE_PROJECTID_FB,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET_FB,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID_FB,
  appId: import.meta.env.VITE_APPID_FB,
};

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);




