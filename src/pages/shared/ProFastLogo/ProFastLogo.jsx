import React from "react";
import logo from "../../../assets/logo.png";
import { Link } from "react-router-dom";

const ProFastLogo = () => {
  return (
    <div className="flex items-center">
      <img
        src={logo}
        alt="ProFast Logo"
        className="w-10 h-10 md:w-12 md:h-12 mr-2"
      />
      <p className="text-xl md:text-2xl -ml-5.5 mt-4.5 font-extrabold text-gray-800">
        ProFast
      </p>
    </div>
  );
};

export default ProFastLogo;
