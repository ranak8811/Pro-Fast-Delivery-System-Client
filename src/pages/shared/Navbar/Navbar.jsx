import React from "react";
import { Link, NavLink } from "react-router-dom";
import { FaUserShield, FaMotorcycle, FaUser, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";
import ProFastLogo from "../../shared/ProFastLogo/ProFastLogo";
import useAuth from "../../../hooks/useAuth";

const Navbar = () => {
  const { user, logout, role } = useAuth();

  const handleLogout = () => {
    logout()
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
        console.error(error);
      });
  };

  const renderRoleBadge = (roleName) => {
    const normalized = (roleName || "user").toLowerCase();

    if (normalized === "admin") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-gradient-to-r from-purple-700 via-indigo-700 to-indigo-800 text-white shadow-sm ring-1 ring-purple-900/10">
          <FaUserShield className="text-[10px] text-purple-200" />
          Admin
        </span>
      );
    }

    if (normalized === "rider") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-gradient-to-r from-amber-600 via-orange-600 to-orange-700 text-white shadow-sm ring-1 ring-orange-900/10">
          <FaMotorcycle className="text-[10px] text-amber-200" />
          Rider
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-gradient-to-r from-teal-700 via-emerald-700 to-emerald-800 text-white shadow-sm ring-1 ring-emerald-900/10">
        <FaUser className="text-[9px] text-teal-200" />
        Customer
      </span>
    );
  };
  const navItems = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "text-[#4d5502] font-bold underline"
              : "hover:text-[#4d5502]"
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/sendParcel"
          className={({ isActive }) =>
            isActive
              ? "text-[#4d5502] font-bold underline"
              : "hover:text-[#4d5502]"
          }
        >
          Send Parcel
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/coverage"
          className={({ isActive }) =>
            isActive
              ? "text-[#4d5502] font-bold underline"
              : "hover:text-[#4d5502]"
          }
        >
          Coverage
        </NavLink>
      </li>

      {user && (
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? "text-[#4d5502] font-bold underline"
                : "hover:text-[#4d5502]"
            }
          >
            Dashboard
          </NavLink>
        </li>
      )}

      <li>
        <NavLink
          to="/beARider"
          className={({ isActive }) =>
            isActive
              ? "text-[#4d5502] font-bold underline"
              : "hover:text-[#4d5502]"
          }
        >
          Be a Rider
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive
              ? "text-[#4d5502] font-bold underline"
              : "hover:text-[#4d5502]"
          }
        >
          About Us
        </NavLink>
      </li>
    </>
  );
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
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
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
          >
            {navItems}
          </ul>
        </div>
        <Link to="/" className="p-2 rounded-lg hover:bg-base-200">
          <ProFastLogo />
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal space-x-2 px-1">{navItems}</ul>
      </div>
      <div className="navbar-end">
        {user ? (
          <div className="flex items-center gap-3">
            {/* User Name & Role Badge Container */}
            <div className="hidden sm:flex flex-col items-end text-right">
              <span
                className="font-semibold text-xs md:text-sm text-base-content leading-tight max-w-[150px] truncate"
                title={user?.displayName || "User"}
              >
                {user?.displayName || "User"}
              </span>
              <div className="mt-1">
                {renderRoleBadge(role)}
              </div>
            </div>

            {/* Avatar Dropdown with Ring */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar transition-transform duration-200 hover:scale-105 focus:outline-none"
              >
                <div className="w-10 rounded-full ring-2 ring-primary/40 ring-offset-2 ring-offset-base-100 shadow-sm overflow-hidden">
                  <img
                    alt="User avatar"
                    referrerPolicy="no-referrer"
                    src={
                      user?.photoURL ||
                      "https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg"
                    }
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-2xl z-50 mt-3 w-60 p-3 shadow-xl border border-base-200"
              >
                {/* Profile Header within Dropdown */}
                <li className="menu-title px-2 py-1.5 border-b border-base-200 mb-2">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-sm text-base-content truncate">
                      {user?.displayName || "User"}
                    </span>
                    <span className="text-xs text-base-content/60 truncate font-normal">
                      {user?.email}
                    </span>
                    <div className="mt-1">
                      {renderRoleBadge(role)}
                    </div>
                  </div>
                </li>

                <li>
                  <Link to="/dashboard" className="flex items-center gap-2.5 py-2 hover:bg-base-200 rounded-lg">
                    <FaTachometerAlt className="text-sm text-primary" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/my-profile" className="flex items-center gap-2.5 py-2 hover:bg-base-200 rounded-lg">
                    <FaUser className="text-sm text-base-content/70" />
                    <span className="font-medium">My Profile</span>
                  </Link>
                </li>
                <div className="divider my-1"></div>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 py-2 text-error hover:bg-error/10 hover:text-error rounded-lg"
                  >
                    <FaSignOutAlt className="text-sm" />
                    <span className="font-medium">Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <Link to="/login">
            <button className="btn btn-primary btn-sm md:btn-md shadow-sm">
              Login
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
