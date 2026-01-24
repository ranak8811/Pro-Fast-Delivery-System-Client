import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../firebase/firebase.init";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const queryClient = useQueryClient();

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const updateUserProfile = (profileInfo) => {
    return updateProfile(auth.currentUser, profileInfo);
  };

  const logout = async () => {
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
      if (user) {
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

  const authInfo = {
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
