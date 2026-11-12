import React, { useEffect, useState, ReactNode } from "react";
import { AuthContext, AuthContextType, UserProfileInfo } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User,
  UserCredential,
} from "firebase/auth";
import { auth } from "../../firebase/firebase.init";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const googleProvider = new GoogleAuthProvider();

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [role, setRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState<boolean>(true);
  const queryClient = useQueryClient();

  const createUser = (email: string, password: string): Promise<UserCredential> => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email: string, password: string): Promise<UserCredential> => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = (): Promise<UserCredential> => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const updateUserProfile = (profileInfo: UserProfileInfo): Promise<void> => {
    if (!auth.currentUser) {
      return Promise.reject(new Error("No user currently signed in"));
    }
    return updateProfile(auth.currentUser, profileInfo);
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
      queryClient.clear();
    } catch (error) {
      toast.error("Failed to log out.");
      console.error(error);
    }
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      unSubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchRole = async () => {
      setRoleLoading(true);
      if (user && user.email) {
        try {
          const encodedEmail = encodeURIComponent(user.email);
          const url = new URL(`/users/${encodedEmail}/role`, import.meta.env.VITE_API_URL).toString();

          const res = await axios.get(
            url,
            {
              headers: {
                authorization: `Bearer ${await user.getIdToken()}`,
              },
            },
          );
          setRole(res.data.role);
        } catch (error) {
          console.error(
            "Failed to fetch user role, defaulting to 'user'.",
            error,
          );
          setRole("user");
        } finally {
          setRoleLoading(false);
        }
      } else {
        setRole(null);
      }
      setRoleLoading(false);
    };

    fetchRole();
  }, [user]);

  const authInfo: AuthContextType = {
    createUser,
    signIn,
    user,
    setUser,
    role,
    loading: loading || roleLoading,
    logout,
    signInWithGoogle,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
