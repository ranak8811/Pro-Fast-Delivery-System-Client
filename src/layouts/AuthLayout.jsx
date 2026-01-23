import React from "react";
import { Link, Outlet } from "react-router-dom";
import authImg from "../assets/authImage.png";
import ProFastLogo from "../pages/shared/ProFastLogo/ProFastLogo";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col justify-center items-center">
      <div className="absolute top-4 left-4">
        <Link to="/">
          <ProFastLogo />
        </Link>
      </div>
      <div className="hero-content flex-col lg:flex-row-reverse gap-12 items-center">
        <div className="flex-1">
          <img
            src={authImg}
            className="max-w-md rounded-lg shadow-2xl"
            alt="Authentication"
          />
        </div>
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
