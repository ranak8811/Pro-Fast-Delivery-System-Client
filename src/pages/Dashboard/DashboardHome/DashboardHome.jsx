import React from "react";
import useAuth from "../../../hooks/useAuth";
import Loading from "../../../components/Loading";
import UserDashboard from "./UserDashboard";
import RiderDashboard from "./RiderDashboard";
import AdminDashboard from "./AdminDashboard";
import Forbidden from "../../../components/Forbidden";

const DashboardHome = () => {
  const { role, loading } = useAuth();

  if (loading) {
    return <Loading></Loading>;
  }

  if (role === "user") {
    return <UserDashboard></UserDashboard>;
  } else if (role === "rider") {
    return <RiderDashboard></RiderDashboard>;
  } else if (role === "admin") {
    return <AdminDashboard></AdminDashboard>;
  } else {
    return <Forbidden></Forbidden>;
  }
};

export default DashboardHome;
