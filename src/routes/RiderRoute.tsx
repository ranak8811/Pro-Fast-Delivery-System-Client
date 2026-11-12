import React, { ReactNode } from "react";
import useAuth from "../hooks/useAuth";
import Forbidden from "../components/Forbidden";
import Loading from "../components/Loading";

interface RiderRouteProps {
  children: ReactNode;
}

const RiderRoute: React.FC<RiderRouteProps> = ({ children }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user || role !== "rider") {
    return <Forbidden />;
  }

  return <>{children}</>;
};

export default RiderRoute;
