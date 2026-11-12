import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: (import.meta.env.VITE_apiKey || import.meta.env.VITE_API_KEY || "") as string,
  authDomain: (import.meta.env.VITE_authDomain || import.meta.env.VITE_AUTH_DOMAIN || "") as string,
  projectId: (import.meta.env.VITE_projectId || import.meta.env.VITE_PROJECT_ID || "") as string,
  storageBucket: (import.meta.env.VITE_storageBucket || import.meta.env.VITE_STORAGE_BUCKET || "") as string,
  messagingSenderId: (import.meta.env.VITE_messagingSenderId || import.meta.env.VITE_MESSAGING_SENDER_ID || "") as string,
  appId: (import.meta.env.VITE_appId || import.meta.env.VITE_APP_ID || "") as string,
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth: Auth = getAuth(app);
