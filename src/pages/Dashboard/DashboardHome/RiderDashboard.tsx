import React from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../components/Loading";
import DeliveryStatsChart from "../../../components/charts/DeliveryStatsChart";
import RiderEarningsChart from "../../../components/charts/RiderEarningsChart";
import useTitle from "../../../hooks/useTitle";
import { DataTable, ColumnDef } from "../../../components/common/DataTable";
import { Link } from "react-router-dom";
import {
  FaMotorcycle,
  FaCheckCircle,
  FaClock,
  FaWallet,
  FaTasks,
} from "react-icons/fa";

interface RecentDelivery {
  _id: string;
  tracking_id?: string;
  status: string;
  origin: string;
  destination: string;
  creation_date: string;
}

interface RiderDashboardSummary {
  totalDeliveriesCompleted?: number;
  totalDeliveriesPending?: number;
  averageDeliveryTime?: string;
  totalEarnings?: number;
  monthlyEarnings?: { month: string; amount: number }[];
  recentDeliveries?: RecentDelivery[];
}

const RiderDashboard: React.FC = () => {
  useTitle("Rider Dashboard");
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: riderDashboardSummary = {},
    isLoading,
    isError,
    error,
  } = useQuery<RiderDashboardSummary>({
    queryKey: ["riderDashboardSummary", user?.email],
    queryFn: async () => {
      if (!user?.email) return {};
      const res = await axiosSecure.get(
        `/employee/dashboard-summary?email=${user?.email}`,
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
        <p className="font-bold">Error loading rider dashboard</p>
        <p className="text-sm mt-1">{error instanceof Error ? error.message : "Unknown error"}</p>
      </div>
    );
  }

  const {
    totalDeliveriesCompleted = 0,
    totalDeliveriesPending = 0,
    averageDeliveryTime = "N/A",
    totalEarnings = 0,
    monthlyEarnings = [],
    recentDeliveries = [],
  } = riderDashboardSummary;


  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <FaCheckCircle className="text-[10px]" /> Delivered
          </span>
        );
      case "in_transit":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
            <FaMotorcycle className="text-[10px]" /> In Transit
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
            <FaClock className="text-[10px]" /> Assigned
          </span>
        );
    }
  };

  const recentColumns: ColumnDef<RecentDelivery>[] = [
    {
      header: "#",
      render: (_, idx) => (
        <span className="font-semibold text-xs text-slate-400">{idx + 1}</span>
      ),
      className: "w-12 text-center",
    },
    {
      header: "Parcel ID",
      render: (p) => (
        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
          {p.tracking_id || p._id.slice(0, 10)}
        </span>
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
      header: "Creation Date",
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
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#20363A] to-[#122326] p-6 rounded-2xl text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#CAEB66]">
            Delivery Hero Dashboard
          </span>
          <h1 className="text-2xl font-bold tracking-tight mt-0.5">
            {user?.displayName || "Rider"}
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            Summary of your delivery performance, active routes, and earnings
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/dashboard/pending-deliveries"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl backdrop-blur-sm transition-all"
          >
            <FaTasks className="text-xs" /> Pending Deliveries
          </Link>
          <Link
            to="/dashboard/my-earnings"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#CAEB66] hover:bg-[#bfe258] text-[#122326] font-bold text-xs rounded-xl transition-all shadow-sm"
          >
            <FaWallet className="text-xs" /> View Earnings
          </Link>
        </div>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Completed Deliveries */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#008060] flex items-center justify-center shrink-0">
            <FaCheckCircle className="text-xl" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Completed Tasks
            </p>
            <p className="text-2xl font-extrabold text-slate-800 mt-0.5">
              {totalDeliveriesCompleted}
            </p>
          </div>
        </div>

        {/* Pending Deliveries */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FaMotorcycle className="text-xl" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Pending Tasks
            </p>
            <p className="text-2xl font-extrabold text-slate-800 mt-0.5">
              {totalDeliveriesPending}
            </p>
          </div>
        </div>

        {/* Total Earnings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <FaWallet className="text-xl" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Earnings
            </p>
            <p className="text-2xl font-extrabold text-[#008060] mt-0.5">
              ৳{totalEarnings.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Avg Delivery Time */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <FaClock className="text-xl" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Avg Delivery Time
            </p>
            <p className="text-xl font-extrabold text-slate-800 mt-0.5">
              {averageDeliveryTime}
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 mb-4">
            Delivery Ratio
          </h3>
          {totalDeliveriesCompleted > 0 || totalDeliveriesPending > 0 ? (
            <DeliveryStatsChart
              completed={totalDeliveriesCompleted}
              pending={totalDeliveriesPending}
            />
          ) : (
            <div className="py-12 text-center text-slate-400 text-sm">
              No delivery data available yet.
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 mb-4">
            Monthly Earnings
          </h3>
          {monthlyEarnings && monthlyEarnings.length > 0 ? (
            <RiderEarningsChart monthlyEarnings={monthlyEarnings} />
          ) : (
            <div className="py-12 text-center text-slate-400 text-sm">
              No monthly earnings data recorded.
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Table using DataTable */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-bold text-slate-800">Recent Deliveries</h3>
          <Link
            to="/dashboard/completed-deliveries"
            className="text-xs font-bold text-[#008060] hover:underline"
          >
            View Completed &rarr;
          </Link>
        </div>

        <DataTable<RecentDelivery>
          columns={recentColumns}
          data={recentDeliveries}
          keyExtractor={(p) => p._id}
          emptyMessage="No recent deliveries to display"
          emptySubtext="When you complete delivery assignments, they will be listed here."
          emptyIcon={<FaMotorcycle className="text-2xl text-slate-400" />}
        />
      </div>
    </div>
  );
};

export default RiderDashboard;
