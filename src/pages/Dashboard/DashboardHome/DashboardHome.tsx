import React from "react";
import useAuth from "../../../hooks/useAuth";
import Loading from "../../../components/Loading";
import UserDashboard from "./UserDashboard";
import RiderDashboard from "./RiderDashboard";
import AdminDashboard from "./AdminDashboard";
import Forbidden from "../../../components/Forbidden";
import useTitle from "../../../hooks/useTitle";

const DashboardHome: React.FC = () => {
  useTitle("Dashboard");
  const { role, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (role === "user") {
    return <UserDashboard />;
  } else if (role === "rider") {
    return <RiderDashboard />;
  } else if (role === "admin") {
    return <AdminDashboard />;
  } else {
    return <Forbidden />;
  }
};

export default DashboardHome;
