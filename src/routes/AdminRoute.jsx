import React, { Children } from "react";
import useAuth from "../hooks/useAuth";
import Forbidden from "../components/Forbidden";
import Loading from "../components/Loading";

const AdminRoute = ({ children }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user || role !== "admin") {
    return <Forbidden />;
  }

  return children;
};

export default AdminRoute;
