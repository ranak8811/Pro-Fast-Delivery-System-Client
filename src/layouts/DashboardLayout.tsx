import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import ProFastLogo from "../pages/shared/ProFastLogo/ProFastLogo";
import {
  FaHome,
  FaBoxOpen,
  FaMoneyCheckAlt,
  FaSearchLocation,
  FaUserCheck,
  FaUserClock,
  FaUserShield,
  FaMotorcycle,
  FaTasks,
  FaCheckCircle,
  FaWallet,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaShippingFast,
} from "react-icons/fa";
import useAuth from "../hooks/useAuth";

const DashboardLayout: React.FC = () => {
  const { user, role, loading, logout } = useAuth();

  const handleLogout = (): void => {
    logout()
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getRoleBadge = () => {
    switch (role) {
      case "admin":
        return {
          label: "ADMIN",
          bg: "bg-gradient-to-r from-red-600 to-rose-700",
        };
      case "rider":
        return {
          label: "DELIVERY HERO",
          bg: "bg-gradient-to-r from-emerald-600 to-teal-700",
        };
      case "user":
      default:
        return {
          label: "CUSTOMER",
          bg: "bg-[#008060]",
        };
    }
  };

  const roleBadge = getRoleBadge();

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-[#20363A] text-white shadow-sm shadow-[#20363A]/20"
        : "text-slate-600 hover:text-[#20363A] hover:bg-slate-100/80"
    }`;

  const mainNavLinks = (
    <div className="space-y-6">
      {/* Overview Group */}
      <div>
        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Overview
        </p>
        <ul className="space-y-1">
          <li>
            <NavLink to="/dashboard" end className={navItemClass}>
              <FaHome className="text-base shrink-0" />
              <span>Dashboard Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/track" className={navItemClass}>
              <FaSearchLocation className="text-base shrink-0" />
              <span>Live Tracking</span>
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Customer Services Group */}
      <div>
        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Customer Portal
        </p>
        <ul className="space-y-1">
          <li>
            <NavLink to="/sendParcel" className={navItemClass}>
              <FaShippingFast className="text-base shrink-0 text-[#84cc16]" />
              <span>Send New Parcel</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/myParcels" className={navItemClass}>
              <FaBoxOpen className="text-base shrink-0" />
              <span>My Parcels</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/paymentHistory" className={navItemClass}>
              <FaMoneyCheckAlt className="text-base shrink-0" />
              <span>Payment History</span>
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Rider Section */}
      {!loading && role === "rider" && (
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-emerald-600 mb-2">
            Rider Operations
          </p>
          <ul className="space-y-1">
            <li>
              <NavLink to="/dashboard/pending-deliveries" className={navItemClass}>
                <FaTasks className="text-base shrink-0" />
                <span>Pending Deliveries</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/completed-deliveries" className={navItemClass}>
                <FaCheckCircle className="text-base shrink-0" />
                <span>Completed Deliveries</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/my-earnings" className={navItemClass}>
                <FaWallet className="text-base shrink-0" />
                <span>My Earnings</span>
              </NavLink>
            </li>
          </ul>
        </div>
      )}

      {/* Admin Section */}
      {!loading && role === "admin" && (
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-rose-600 mb-2">
            Administration
          </p>
          <ul className="space-y-1">
            <li>
              <NavLink to="/dashboard/assign-rider" className={navItemClass}>
                <FaMotorcycle className="text-base shrink-0" />
                <span>Assign Rider</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/active-riders" className={navItemClass}>
                <FaUserCheck className="text-base shrink-0" />
                <span>Active Riders</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/pending-riders" className={navItemClass}>
                <FaUserClock className="text-base shrink-0" />
                <span>Pending Riders</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/makeAdmin" className={navItemClass}>
                <FaUserShield className="text-base shrink-0" />
                <span>User Roles</span>
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </div>
  );

  const bottomNavLinks = (
    <div className="pt-4 border-t border-slate-200 space-y-1 mt-6">
      <NavLink to="/dashboard/my-profile" className={navItemClass}>
        <FaUser className="text-base shrink-0" />
        <span>My Profile</span>
      </NavLink>
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors duration-200 text-left"
      >
        <FaSignOutAlt className="text-base shrink-0" />
        <span>Logout</span>
      </button>
    </div>
  );

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-slate-50/60">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col min-h-screen">
        {/* Mobile Header */}
        <div className="navbar bg-white border-b border-slate-200 lg:hidden sticky top-0 z-30 px-4">
          <div className="flex-none">
            <label
              htmlFor="my-drawer-2"
              className="btn btn-square btn-ghost text-slate-700"
              aria-label="open sidebar"
            >
              <FaBars className="h-5 w-5" />
            </label>
          </div>
          <div className="flex-1 px-2">
            <Link to="/">
              <ProFastLogo />
            </Link>
          </div>
          {user && (
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] uppercase font-bold tracking-wider text-white px-2 py-0.5 rounded-full ${roleBadge.bg}`}
              >
                {roleBadge.label}
              </span>
              <img
                src={user.photoURL || "https://i.ibb.co/MgsTCcv/avater.jpg"}
                alt={user.displayName || "User"}
                className="w-8 h-8 rounded-full border border-slate-200 object-cover"
              />
            </div>
          )}
        </div>

        {/* Dashboard Main Content Area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Desktop / Mobile Drawer Sidebar */}
      <div className="drawer-side z-40">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <aside className="w-72 min-h-full bg-white border-r border-slate-200/80 p-5 flex flex-col justify-between shadow-sm">
          <div>
            {/* Brand Logo Header */}
            <div className="pb-5 border-b border-slate-100 mb-5">
              <Link to="/" className="inline-block">
                <ProFastLogo />
              </Link>
            </div>

            {/* User Mini Profile Card */}
            {user && (
              <div className="p-3 bg-gradient-to-br from-slate-50 to-slate-100/70 border border-slate-200/60 rounded-2xl mb-6 flex items-center gap-3">
                <img
                  src={user.photoURL || "https://i.ibb.co/MgsTCcv/avater.jpg"}
                  alt={user.displayName || "User"}
                  className="w-11 h-11 rounded-xl object-cover border-2 border-white shadow-sm shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {user.displayName || "ProFast User"}
                  </p>
                  <span
                    className={`inline-block text-[9px] uppercase font-extrabold tracking-wider text-white px-2 py-0.5 rounded-full mt-0.5 ${roleBadge.bg}`}
                  >
                    {roleBadge.label}
                  </span>
                </div>
              </div>
            )}

            {/* Navigation Groups */}
            {mainNavLinks}
          </div>

          {/* Bottom Account & Logout */}
          {bottomNavLinks}
        </aside>
      </div>
    </div>
  );
};

export default DashboardLayout;
