import { createContext } from "react";
import { User, UserCredential } from "firebase/auth";

export interface UserProfileInfo {
  displayName?: string | null;
  photoURL?: string | null;
}

export interface AuthContextType {
  createUser: (email: string, password: string) => Promise<UserCredential>;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  updateUserProfile: (profileInfo: UserProfileInfo) => Promise<void>;
  logout: () => Promise<void>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  role: string | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);
