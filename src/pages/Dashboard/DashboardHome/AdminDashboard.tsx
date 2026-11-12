import React, { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FaMotorcycle,
  FaCheckCircle,
  FaShippingFast,
  FaBoxOpen,
  FaUserCheck,
  FaUserClock,
  FaUserShield,
  FaArrowRight,
} from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Loading from "../../../components/Loading";
import useTitle from "../../../hooks/useTitle";
import { Link } from "react-router-dom";

const COLORS: Record<string, string> = {
  not_collected: "#f59e0b", // amber-500
  in_transit: "#3b82f6", // blue-500
  rider_assigned: "#8b5cf6", // purple-500
  delivered: "#008060", // emerald/brand green
};

const statusLabels: Record<string, string> = {
  rider_assigned: "Assigned to Rider",
  delivered: "Delivered",
  in_transit: "In Transit",
  not_collected: "Pending Pickup",
};

interface StatusCountItem {
  status: string;
  count: number;
}

export default function AdminDashboard(): React.ReactElement {
  useTitle("Admin Dashboard");
  const axiosSecure = useAxiosSecure();
  const {
    data: deliveryStatus = [],
    isLoading,
    isError,
    error,
  } = useQuery<StatusCountItem[]>({
    queryKey: ["parcelStatusCount"],
    queryFn: async () => {
      const res = await axiosSecure.get("/business/delivery/status-count");
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const processedPieData = deliveryStatus.map((item) => ({
    name: statusLabels[item.status] || item.status,
    value: item.count,
    status: item.status,
  }));

  const totalVolume = deliveryStatus.reduce((sum, item) => sum + item.count, 0);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-700 p-6 rounded-2xl">
        <p className="font-bold">Error loading delivery analytics</p>
        <p className="text-sm mt-1">{error instanceof Error ? error.message : "Unknown error"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#20363A] to-[#122326] p-6 rounded-2xl text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#CAEB66]">
            System Administration
          </span>
          <h1 className="text-2xl font-bold tracking-tight mt-0.5">Fleet Overview & Analytics</h1>
          <p className="text-slate-300 text-sm mt-1">
            Real-time delivery progress and logistics operations monitor
          </p>
        </div>
        <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm text-center shrink-0">
          <p className="text-xs text-slate-300 font-medium">Total Shipments</p>
          <p className="text-2xl font-extrabold text-[#CAEB66]">{totalVolume}</p>
        </div>
      </div>

      {/* 4 Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {deliveryStatus.map(({ count, status }) => {
          const color = COLORS[status] || "#64748b";
          return (
            <div
              key={status}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-4"
            >
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {statusLabels[status] || status}
                </p>
                <p className="text-3xl font-extrabold text-slate-800 mt-1">
                  {count}
                </p>
              </div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${color}15`, color }}
              >
                {status === "delivered" ? (
                  <FaCheckCircle className="text-2xl" />
                ) : status === "in_transit" ? (
                  <FaShippingFast className="text-2xl" />
                ) : status === "rider_assigned" ? (
                  <FaMotorcycle className="text-2xl" />
                ) : (
                  <FaBoxOpen className="text-2xl" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pie Chart & Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart (2 cols) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">
              Delivery Status Breakdown
            </h3>
            <span className="text-xs font-medium text-slate-400">All Locations</span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={processedPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  label={({ name, percent }) =>
                    `${name} (${((percent || 0) * 100).toFixed(0)}%)`
                  }
                >
                  {processedPieData.map((entry) => (
                    <Cell
                      key={`cell-${entry.status}`}
                      fill={COLORS[entry.status] || "#94a3b8"}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Operations Panel (1 col) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              Admin Quick Controls
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Direct access to logistics management tools
            </p>

            <div className="space-y-2.5">
              <Link
                to="/dashboard/assign-rider"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:border-[#20363A] hover:bg-slate-50 transition-all text-xs font-semibold text-slate-700"
              >
                <div className="flex items-center gap-2.5">
                  <FaMotorcycle className="text-[#008060]" />
                  <span>Assign Rider to Parcels</span>
                </div>
                <FaArrowRight className="text-slate-400" />
              </Link>

              <Link
                to="/dashboard/active-riders"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:border-[#20363A] hover:bg-slate-50 transition-all text-xs font-semibold text-slate-700"
              >
                <div className="flex items-center gap-2.5">
                  <FaUserCheck className="text-blue-600" />
                  <span>Active Delivery Heroes</span>
                </div>
                <FaArrowRight className="text-slate-400" />
              </Link>

              <Link
                to="/dashboard/pending-riders"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:border-[#20363A] hover:bg-slate-50 transition-all text-xs font-semibold text-slate-700"
              >
                <div className="flex items-center gap-2.5">
                  <FaUserClock className="text-amber-500" />
                  <span>Pending Applications</span>
                </div>
                <FaArrowRight className="text-slate-400" />
              </Link>

              <Link
                to="/dashboard/makeAdmin"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:border-[#20363A] hover:bg-slate-50 transition-all text-xs font-semibold text-slate-700"
              >
                <div className="flex items-center gap-2.5">
                  <FaUserShield className="text-purple-600" />
                  <span>User Roles & Permissions</span>
                </div>
                <FaArrowRight className="text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
