import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  startOfYear,
  isAfter,
} from "date-fns";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Loading from "../../../components/Loading";
import useTitle from "../../../hooks/useTitle";
import { Link } from "react-router-dom";
import {
  FaWallet,
  FaMoneyCheckAlt,
  FaClock,
  FaCalendarDay,
  FaCalendarWeek,
  FaCalendarAlt,
  FaArrowRight,
} from "react-icons/fa";

interface CompletedParcelEarning {
  cost: number | string;
  sender_center: string;
  receiver_center: string;
  delivered_at?: string;
  cashout_status?: string;
}

const MyEarnings: React.FC = () => {
  useTitle("My Earnings");
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const email = user?.email;

  const { data: parcels = [], isLoading } = useQuery<CompletedParcelEarning[]>({
    queryKey: ["completedDeliveries", email],
    enabled: !!email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/business/rider/completed-parcels?email=${email}`,
      );
      return res.data;
    },
  });

  const calculateEarning = (parcel: CompletedParcelEarning): number => {
    const cost = Number(parcel.cost) || 0;
    return parcel.sender_center === parcel.receiver_center
      ? Math.round(cost * 0.8)
      : Math.round(cost * 0.3);
  };

  const now = new Date();
  const todayStart = startOfDay(now);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);
  const yearStart = startOfYear(now);

  let total = 0,
    totalCashedOut = 0,
    totalPending = 0,
    today = 0,
    week = 0,
    month = 0,
    year = 0;

  parcels.forEach((p) => {
    const earning = calculateEarning(p);
    const deliveredAt = p.delivered_at ? new Date(p.delivered_at) : new Date(0);
    total += earning;
    if (p.cashout_status === "cashed_out") totalCashedOut += earning;
    else totalPending += earning;

    if (isAfter(deliveredAt, todayStart)) today += earning;
    if (isAfter(deliveredAt, weekStart)) week += earning;
    if (isAfter(deliveredAt, monthStart)) month += earning;
    if (isAfter(deliveredAt, yearStart)) year += earning;
  });

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#20363A] to-[#122326] p-6 rounded-2xl text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#CAEB66]">
            Payouts & Earnings
          </span>
          <h1 className="text-2xl font-bold tracking-tight mt-0.5">My Earnings</h1>
          <p className="text-slate-300 text-sm mt-1">
            Track your delivery commission and cashout history
          </p>
        </div>
        <Link
          to="/dashboard/completed-deliveries"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#CAEB66] hover:bg-[#bfe258] text-[#122326] font-bold text-sm rounded-xl transition-all shadow-sm shrink-0"
        >
          <span>Cashout Deliveries</span>
          <FaArrowRight className="text-xs" />
        </Link>
      </div>

      {/* 3 Primary Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Total Earnings */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Earnings
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#008060] flex items-center justify-center">
              <FaWallet className="text-lg" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#008060]">
            ৳{total.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Combined total commission earned across all tasks
          </p>
        </div>

        {/* Cashed Out */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Cashed Out
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FaMoneyCheckAlt className="text-lg" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-800">
            ৳{totalCashedOut.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Successfully withdrawn into your payout account
          </p>
        </div>

        {/* Pending Cashout */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Available to Cashout
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FaClock className="text-lg" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-amber-600">
            ৳{totalPending.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Ready to be withdrawn from Completed Deliveries
          </p>
        </div>
      </div>

      {/* Time Breakdown Cards */}
      <div>
        <h3 className="text-base font-bold text-slate-800 mb-3 px-1">
          Earnings Breakdown by Timeline
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase mb-1.5">
              <FaCalendarDay className="text-slate-400" />
              <span>Today</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">৳{today}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase mb-1.5">
              <FaCalendarWeek className="text-slate-400" />
              <span>This Week</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">৳{week}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase mb-1.5">
              <FaCalendarAlt className="text-slate-400" />
              <span>This Month</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">৳{month}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase mb-1.5">
              <FaCalendarAlt className="text-slate-400" />
              <span>This Year</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">৳{year}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyEarnings;
