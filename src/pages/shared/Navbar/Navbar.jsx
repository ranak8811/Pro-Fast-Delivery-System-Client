import React from "react";
import { Link, NavLink } from "react-router-dom";
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
        console.log(error);
      });
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
        <Link to="/" className="btn btn-ghost text-xl">
          <ProFastLogo />
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal space-x-2 px-1">{navItems}</ul>
      </div>
      <div className="navbar-end">
        {user ? (
          <div className="flex items-center space-x-2">
            <div>
              <p className="font-bold text-black">{user?.displayName}</p>
              <p className="text-sm text-black">{role}</p>
            </div>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
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
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
              >
                <li className="flex justify-center items-center">
                  <Link to="/dashboard/my-profile">My Profile</Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="btn btn-ghost">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <Link to="/login">
            <button className="btn btn-primary">Login</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
