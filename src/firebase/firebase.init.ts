import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey as string,
  authDomain: import.meta.env.VITE_authDomain as string,
  projectId: import.meta.env.VITE_projectId as string,
  storageBucket: import.meta.env.VITE_storageBucket as string,
  messagingSenderId: import.meta.env.VITE_messagingSenderId as string,
  appId: import.meta.env.VITE_appId as string,
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth: Auth = getAuth(app);
