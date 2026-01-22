import React from "react";
import useAuth from "../hooks/useAuth";
import Forbidden from "../components/Forbidden";

const RiderRoute = ({ children }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <span className="loading loading-spinner loading-xl"></span>;
  }

  if (!user || role !== "rider") {
    return <Forbidden />;
  }

  return children;
};

export default RiderRoute;
