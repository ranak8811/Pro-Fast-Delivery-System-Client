import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import ProFastLogo from "../pages/shared/ProFastLogo/ProFastLogo";
import {
  FaHome,
  FaBoxOpen,
  FaMoneyCheckAlt,
  FaUserEdit,
  FaSearchLocation,
  FaUserCheck,
  FaUserClock,
  FaUserShield,
  FaMotorcycle,
  FaTasks,
  FaCheckCircle,
  FaWallet,
  FaUser,
  FaSignOutAlt, // Import FaSignOutAlt for logout icon
} from "react-icons/fa";
import useAuth from "../hooks/useAuth";

const DashboardLayout = () => {
  const { role, loading, logout } = useAuth(); // Destructure logout from useAuth

  const handleLogout = () => {
    logout()
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };

  const activeLink = "text-[#4d5502] font-bold underline";
  const normalLink = "hover:text-[#4d5502]";

  const navLinks = (
    <>
      <li>
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) => (isActive ? activeLink : normalLink)}
        >
          <FaHome className="inline-block mr-2" />
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/dashboard/my-profile"
          className={({ isActive }) => (isActive ? activeLink : normalLink)}
        >
          <FaUser className="inline-block mr-2" />
          My Profile
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/dashboard/myParcels"
          className={({ isActive }) => (isActive ? activeLink : normalLink)}
        >
          <FaBoxOpen className="inline-block mr-2" />
          My Parcels
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/dashboard/paymentHistory"
          className={({ isActive }) => (isActive ? activeLink : normalLink)}
        >
          <FaMoneyCheckAlt className="inline-block mr-2" />
          Payment History
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/dashboard/track"
          className={({ isActive }) => (isActive ? activeLink : normalLink)}
        >
          <FaSearchLocation className="inline-block mr-2" />
          Track a Package
        </NavLink>
      </li>

      {/* rider links */}
      {!loading && role === "rider" && (
        <>
          <li>
            <NavLink
              to="/dashboard/pending-deliveries"
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <FaTasks className="inline-block mr-2" />
              Pending Deliveries
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/completed-deliveries"
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <FaCheckCircle className="inline-block mr-2" />
              Completed Deliveries
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/my-earnings"
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <FaWallet className="inline-block mr-2" />
              My Earnings
            </NavLink>
          </li>
        </>
      )}

      {/* admin link */}
      {!loading && role === "admin" && (
        <>
          <li>
            <NavLink
              to="/dashboard/assign-rider"
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <FaMotorcycle className="inline-block mr-2" />
              Assign Rider
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/active-riders"
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <FaUserCheck className="inline-block mr-2" />
              Active Riders
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/pending-riders"
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <FaUserClock className="inline-block mr-2" />
              Pending Riders
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/makeAdmin"
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <FaUserShield className="inline-block mr-2" />
              Make Admin
            </NavLink>
          </li>
        </>
      )}
      <li>
        <button onClick={handleLogout} className={`w-full text-left py-2 px-4 rounded-md transition-colors duration-200 ${normalLink}`}>
          <FaSignOutAlt className="inline-block mr-2" />
          Logout
        </button>
      </li>
    </>
  );

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Page content here */}
        <div className="navbar bg-base-100 lg:hidden">
          <div className="flex-none">
            <label
              htmlFor="my-drawer-2"
              className="btn btn-square btn-ghost"
              aria-label="open sidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
          </div>
          <div className="flex-1">
            <Link to="/">
              <ProFastLogo />
            </Link>
          </div>
        </div>
        <div className="p-4 w-full mx-auto">
          <Outlet />
        </div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          {/* Sidebar content here */}
          <div className="p-4">
            <Link to="/">
              <ProFastLogo />
            </Link>
          </div>
          {navLinks}
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
