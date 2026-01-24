import React from "react";
import useAuth from "../hooks/useAuth";
import Forbidden from "../components/Forbidden";
import Loading from "../components/Loading";

const RiderRoute = ({ children }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user || role !== "rider") {
    return <Forbidden />;
  }

  return children;
};

export default RiderRoute;
