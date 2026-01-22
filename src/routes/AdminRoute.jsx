import React, { Children } from "react";
import useAuth from "../hooks/useAuth";
import Forbidden from "../components/Forbidden";

const AdminRoute = ({ children }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <span className="loading loading-spinner loading-xl"></span>;
  }

  if (!user || role !== "admin") {
    return <Forbidden />;
  }

  return children;
};

export default AdminRoute;
