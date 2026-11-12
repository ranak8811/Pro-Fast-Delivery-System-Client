import React, { ReactNode } from "react";
import useAuth from "../hooks/useAuth";
import Forbidden from "../components/Forbidden";
import Loading from "../components/Loading";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user || role !== "admin") {
    return <Forbidden />;
  }

  return <>{children}</>;
};

export default AdminRoute;
