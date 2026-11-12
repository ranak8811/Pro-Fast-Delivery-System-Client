import { use } from "react";
import { AuthContext, AuthContextType } from "../contexts/AuthContext/AuthContext";

const useAuth = (): AuthContextType => {
  const authInfo = use(AuthContext);
  if (!authInfo) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return authInfo;
};

export default useAuth;
