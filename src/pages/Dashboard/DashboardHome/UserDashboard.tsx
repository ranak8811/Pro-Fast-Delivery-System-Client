import React from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../components/Loading";
import ParcelStatusChart from "../../../components/charts/ParcelStatusChart";
import SpendingHistoryChart from "../../../components/charts/SpendingHistoryChart";
import useTitle from "../../../hooks/useTitle";
import { DataTable, ColumnDef } from "../../../components/common/DataTable";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaBoxOpen,
  FaCheckCircle,
  FaTruck,
  FaClock,
  FaPlus,
  FaSearchLocation,
  FaCopy,
} from "react-icons/fa";

interface RecentParcel {
  _id: string;
  tracking_id?: string;
  status: string;
  origin: string;
  destination: string;
  creation_date: string;
}

interface UserDashboardSummary {
  totalParcels?: number;
  parcelStatusCounts?: Record<string, number>;
  recentParcels?: RecentParcel[];
  spendingHistory?: { month: string; amount: number }[];
}

const UserDashboard: React.FC = () => {
  useTitle("User Dashboard");
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: userDashboardSummary = {},
    isLoading,
    isError,
    error,
  } = useQuery<UserDashboardSummary>({
    queryKey: ["userDashboardSummary", user?.email],
    queryFn: async () => {
      if (!user?.email) return {};
      const res = await axiosSecure.get(
        `/users/dashboard-summary-for-user?email=${user?.email}&_=${Date.now()}`,
      );
      return res.data;
    },
    enabled: !!user?.email && !authLoading,
  });

  if (isLoading || authLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-700 p-6 rounded-2xl">
        <p className="font-bold">Error loading dashboard</p>
        <p className="text-sm mt-1">{error instanceof Error ? error.message : "Unknown error"}</p>
      </div>
    );
  }

  const {
    totalParcels = 0,
    parcelStatusCounts = {},
    recentParcels = [],
    spendingHistory = [],
  } = userDashboardSummary;

  const deliveredCount =
    (parcelStatusCounts["delivered"] || 0) +
    (parcelStatusCounts["service_center_delivered"] || 0);
  const inTransitCount =
    (parcelStatusCounts["in_transit"] || 0) +
    (parcelStatusCounts["rider_assigned"] || 0);
  const pendingCount = parcelStatusCounts["not_collected"] || 0;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Tracking ID copied!");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
      case "service_center_delivered":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <FaCheckCircle className="text-[10px]" /> Delivered
          </span>
        );
      case "in_transit":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
            <FaTruck className="text-[10px]" /> In Transit
          </span>
        );
      case "rider_assigned":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/60">
            <FaClock className="text-[10px]" /> Rider Assigned
          </span>
        );
      case "not_collected":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
            <FaClock className="text-[10px]" /> Pending Pickup
          </span>
        );
    }
  };

  const recentColumns: ColumnDef<RecentParcel>[] = [
    {
      header: "#",
      render: (_, idx) => (
        <span className="font-semibold text-xs text-slate-400">{idx + 1}</span>
      ),
      className: "w-12 text-center",
    },
    {
      header: "Tracking ID / Parcel",
      render: (p) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
            {p.tracking_id || p._id.slice(0, 10)}
          </span>
          <button
            onClick={() => handleCopy(p.tracking_id || p._id)}
            className="text-slate-400 hover:text-[#20363A] text-xs p-1 transition-colors"
            title="Copy ID"
          >
            <FaCopy />
          </button>
        </div>
      ),
    },
    {
      header: "Origin",
      render: (p) => (
        <span className="text-xs text-slate-600 font-medium">{p.origin || "N/A"}</span>
      ),
    },
    {
      header: "Destination",
      render: (p) => (
        <span className="text-xs text-slate-800 font-semibold">{p.destination || "N/A"}</span>
      ),
    },
    {
      header: "Status",
      render: (p) => getStatusBadge(p.status),
    },
    {
      header: "Created",
      render: (p) => (
        <span className="text-xs text-slate-500">
          {new Date(p.creation_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#20363A] to-[#122326] p-6 rounded-2xl text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#CAEB66]">
            Welcome Back
          </span>
          <h1 className="text-2xl font-bold tracking-tight mt-0.5">
            {user?.displayName || "Customer"}
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            Here is your live shipment summary and recent activity
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/dashboard/track"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl backdrop-blur-sm transition-all"
          >
            <FaSearchLocation className="text-xs" /> Track Package
          </Link>
          <Link
            to="/sendParcel"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#CAEB66] hover:bg-[#bfe258] text-[#122326] font-bold text-xs rounded-xl transition-all shadow-sm"
          >
            <FaPlus className="text-xs" /> Send Parcel
          </Link>
        </div>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Shipments */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-[#20363A] flex items-center justify-center shrink-0">
            <FaBoxOpen className="text-xl" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Shipments
            </p>
            <p className="text-2xl font-extrabold text-slate-800 mt-0.5">
              {totalParcels}
            </p>
          </div>
        </div>

        {/* Delivered */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#008060] flex items-center justify-center shrink-0">
            <FaCheckCircle className="text-xl" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Delivered
            </p>
            <p className="text-2xl font-extrabold text-slate-800 mt-0.5">
              {deliveredCount}
            </p>
          </div>
        </div>

        {/* In Transit */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FaTruck className="text-xl" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              In Transit
            </p>
            <p className="text-2xl font-extrabold text-slate-800 mt-0.5">
              {inTransitCount}
            </p>
          </div>
        </div>

        {/* Pending Pickup */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <FaClock className="text-xl" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Pending Pickup
            </p>
            <p className="text-2xl font-extrabold text-slate-800 mt-0.5">
              {pendingCount}
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">
              Parcel Status Overview
            </h3>
            <span className="text-xs font-medium text-slate-400">Live Status</span>
          </div>
          {parcelStatusCounts && Object.keys(parcelStatusCounts).length > 0 ? (
            <ParcelStatusChart parcelStatusCounts={parcelStatusCounts} />
          ) : (
            <div className="py-12 text-center text-slate-400 text-sm">
              No parcel status data available yet.
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">
              Monthly Spending
            </h3>
            <span className="text-xs font-medium text-slate-400">Last Months</span>
          </div>
          {spendingHistory && spendingHistory.length > 0 ? (
            <SpendingHistoryChart spendingHistory={spendingHistory} />
          ) : (
            <div className="py-12 text-center text-slate-400 text-sm">
              No spending history data recorded.
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Table using DataTable */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-bold text-slate-800">Recent Shipments</h3>
          <Link
            to="/dashboard/myParcels"
            className="text-xs font-bold text-[#008060] hover:underline"
          >
            View All Parcels &rarr;
          </Link>
        </div>

        <DataTable<RecentParcel>
          columns={recentColumns}
          data={recentParcels}
          keyExtractor={(p) => p._id}
          emptyMessage="No recent shipments to display"
          emptySubtext="Send your first parcel now to begin tracking deliveries."
          emptyAction={
            <Link
              to="/sendParcel"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#20363A] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#122326] transition-colors"
            >
              <FaPlus className="text-xs" /> Send Parcel
            </Link>
          }
        />
      </div>
    </div>
  );
};

export default UserDashboard;
