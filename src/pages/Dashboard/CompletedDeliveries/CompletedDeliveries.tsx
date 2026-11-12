import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import useTitle from "../../../hooks/useTitle";
import { DataTable, ColumnDef } from "../../../components/common/DataTable";
import toast from "react-hot-toast";
import {
  FaCheckCircle,
  FaCopy,
  FaWallet,
  FaMoneyBillWave,
  FaCheck,
  FaShippingFast,
} from "react-icons/fa";

export interface CompletedParcel {
  _id: string;
  tracking_id: string;
  title: string;
  sender_center: string;
  receiver_center: string;
  picked_at?: string;
  delivered_at?: string;
  cost: number | string;
  cashout_status?: string;
}

interface CompletedParcelsApiResponse {
  data: CompletedParcel[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const CompletedDeliveries: React.FC = () => {
  useTitle("Completed Deliveries");
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const email = user?.email;

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const { data: apiResponse, isLoading } = useQuery<CompletedParcelsApiResponse | CompletedParcel[]>({
    queryKey: ["completedDeliveries", email, page, pageSize],
    enabled: !!email,
    queryFn: async () => {
      const params = new URLSearchParams({
        email: email || "",
        page: String(page),
        limit: String(pageSize),
      });
      const res = await axiosSecure.get(
        `/business/rider/completed-parcels?${params.toString()}`,
      );
      return res.data;
    },
  });

  const isPaginated = apiResponse && !Array.isArray(apiResponse) && "data" in apiResponse;
  const parcels: CompletedParcel[] = isPaginated
    ? (apiResponse as CompletedParcelsApiResponse).data
    : Array.isArray(apiResponse)
    ? apiResponse
    : [];

  const totalItems: number = isPaginated
    ? (apiResponse as CompletedParcelsApiResponse).total
    : parcels.length;

  const totalPages: number = isPaginated
    ? (apiResponse as CompletedParcelsApiResponse).totalPages
    : Math.max(1, Math.ceil(parcels.length / pageSize));

  const calculateEarning = (parcel: CompletedParcel): number => {
    const cost = Number(parcel.cost) || 0;
    if (parcel.sender_center === parcel.receiver_center) {
      return Math.round(cost * 0.8);
    } else {
      return Math.round(cost * 0.3);
    }
  };

  const { mutateAsync: cashout } = useMutation({
    mutationFn: async (id: string) => {
      return await axiosSecure.patch(`/business/${id}/cashout`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["completedDeliveries"] });
    },
  });

  const handleCashout = (id: string, earning: number) => {
    Swal.fire({
      title: "Cash out this delivery?",
      text: `You will withdraw ৳${earning} for this completed delivery.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#008060",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Confirm Cashout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        cashout(id)
          .then(() => {
            Swal.fire("Success", `৳${earning} cashed out successfully.`, "success");
          })
          .catch(() => {
            Swal.fire("Error", "Failed to cash out. Try again.", "error");
          });
      }
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Tracking ID copied!");
  };

  const totalEarnings = parcels.reduce((sum, p) => sum + calculateEarning(p), 0);
  const cashedOutEarnings = parcels
    .filter((p) => p.cashout_status === "cashed_out")
    .reduce((sum, p) => sum + calculateEarning(p), 0);
  const pendingCashout = totalEarnings - cashedOutEarnings;

  const columns: ColumnDef<CompletedParcel>[] = [
    {
      header: "#",
      render: (_, idx) => (
        <span className="font-semibold text-xs text-slate-400">
          {(page - 1) * pageSize + idx + 1}
        </span>
      ),
      className: "w-12 text-center",
    },
    {
      header: "Tracking ID & Title",
      render: (parcel) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
              {parcel.tracking_id}
            </span>
            <button
              onClick={() => handleCopy(parcel.tracking_id)}
              className="text-slate-400 hover:text-[#20363A] text-xs p-1"
              title="Copy ID"
            >
              <FaCopy />
            </button>
          </div>
          <p className="text-sm font-semibold text-slate-800 line-clamp-1 max-w-[200px]">
            {parcel.title}
          </p>
        </div>
      ),
    },
    {
      header: "Route",
      render: (parcel) => (
        <div className="text-xs text-slate-600 space-y-0.5">
          <p>
            <span className="text-slate-400">From:</span> {parcel.sender_center}
          </p>
          <p className="font-medium text-slate-800">
            <span className="text-slate-400">To:</span> {parcel.receiver_center}
          </p>
        </div>
      ),
    },
    {
      header: "Total Fee",
      render: (parcel) => (
        <span className="font-semibold text-xs text-slate-700">৳{parcel.cost}</span>
      ),
    },
    {
      header: "Your Earning",
      render: (parcel) => {
        const earning = calculateEarning(parcel);
        return (
          <span className="font-bold text-sm text-[#008060]">৳{earning}</span>
        );
      },
    },
    {
      header: "Delivered At",
      render: (parcel) => (
        <span className="text-xs text-slate-500">
          {parcel.delivered_at
            ? new Date(parcel.delivered_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "N/A"}
        </span>
      ),
    },
    {
      header: "Cashout",
      className: "text-right",
      headerClassName: "text-right",
      render: (parcel) => {
        const earning = calculateEarning(parcel);
        const isCashed = parcel.cashout_status === "cashed_out";

        return (
          <div className="flex items-center justify-end">
            {isCashed ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500">
                <FaCheck className="text-[10px]" /> Cashed Out
              </span>
            ) : (
              <button
                onClick={() => handleCashout(parcel._id, earning)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#008060] hover:bg-[#006e52] text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
              >
                <FaMoneyBillWave className="text-[10px]" /> Cash Out
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#20363A] to-[#122326] p-6 rounded-2xl text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#CAEB66]">
            Delivery History
          </span>
          <h1 className="text-2xl font-bold tracking-tight mt-0.5">Completed Deliveries</h1>
          <p className="text-slate-300 text-sm mt-1">
            Track your completed shipments and withdraw your earned fees
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#008060] flex items-center justify-center shrink-0">
            <FaCheckCircle className="text-xl" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Completed Tasks
            </p>
            <p className="text-2xl font-extrabold text-slate-800 mt-0.5">
              {totalItems}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FaWallet className="text-xl" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Available to Cashout
            </p>
            <p className="text-2xl font-extrabold text-[#008060] mt-0.5">
              ৳{pendingCashout}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <FaMoneyBillWave className="text-xl" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Already Cashed Out
            </p>
            <p className="text-2xl font-extrabold text-slate-800 mt-0.5">
              ৳{cashedOutEarnings}
            </p>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <DataTable<CompletedParcel>
        columns={columns}
        data={parcels}
        keyExtractor={(p) => p._id}
        isLoading={isLoading}
        emptyMessage="No completed deliveries yet"
        emptySubtext="Deliveries that you complete will be listed here with your earning shares."
        emptyIcon={<FaShippingFast className="text-2xl text-slate-400" />}
        pagination={{
          page,
          pageSize,
          totalItems,
          totalPages,
          onPageChange: (newPage) => setPage(newPage),
          onPageSizeChange: (newSize) => setPageSize(newSize),
        }}
      />
    </div>
  );
};

export default CompletedDeliveries;
