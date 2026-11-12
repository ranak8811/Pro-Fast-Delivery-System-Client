import React, { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useTitle from "../../../hooks/useTitle";
import { DataTable, ColumnDef } from "../../../components/common/DataTable";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  FaCreditCard,
  FaCheckCircle,
  FaCopy,
  FaSearch,
  FaTimes,
  FaReceipt,
  FaWallet,
  FaArrowRight,
} from "react-icons/fa";

export interface PaymentRecord {
  _id?: string;
  transactionId: string;
  parcelId: string;
  amount: number;
  paid_at_string?: string;
  paid_at?: string;
  paymentMethod?: string;
}

interface PaymentApiResponse {
  data: PaymentRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const PaymentHistory: React.FC = () => {
  useTitle("Payment History");
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Pagination & Search
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: apiResponse, isLoading } = useQuery<PaymentApiResponse | PaymentRecord[]>({
    queryKey: ["payments", user?.email, page, pageSize],
    queryFn: async () => {
      if (!user?.email) return { data: [], total: 0, page: 1, limit: pageSize, totalPages: 1 };
      const params = new URLSearchParams({
        email: user.email,
        page: String(page),
        limit: String(pageSize),
      });
      const res = await axiosSecure.get(`/payment/payments?${params.toString()}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Normalize response
  const isPaginated = apiResponse && !Array.isArray(apiResponse) && "data" in apiResponse;
  const rawPayments: PaymentRecord[] = isPaginated
    ? (apiResponse as PaymentApiResponse).data
    : Array.isArray(apiResponse)
    ? apiResponse
    : [];

  const totalItems: number = isPaginated
    ? (apiResponse as PaymentApiResponse).total
    : rawPayments.length;

  const totalPages: number = isPaginated
    ? (apiResponse as PaymentApiResponse).totalPages
    : Math.max(1, Math.ceil(rawPayments.length / pageSize));

  // Client-side search filter
  const payments = searchQuery
    ? rawPayments.filter(
        (p) =>
          p.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.parcelId.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : rawPayments;

  // Calculate stats from available records
  const totalSpent = rawPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const formatDate = (iso?: string): string => {
    if (!iso) return "N/A";
    const d = new Date(iso);
    return isNaN(d.getTime())
      ? iso
      : d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  const columns: ColumnDef<PaymentRecord>[] = [
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
      header: "Transaction ID",
      render: (p) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
            {p.transactionId}
          </span>
          <button
            onClick={() => handleCopy(p.transactionId, "Transaction ID")}
            className="text-slate-400 hover:text-[#20363A] text-xs transition-colors p-1"
            title="Copy Transaction ID"
          >
            <FaCopy />
          </button>
        </div>
      ),
    },
    {
      header: "Parcel ID",
      render: (p) => (
        <div className="flex items-center gap-1.5 font-mono text-xs text-slate-600">
          <span>{p.parcelId.slice(0, 10)}...</span>
          <button
            onClick={() => handleCopy(p.parcelId, "Parcel ID")}
            className="text-slate-400 hover:text-[#20363A] text-[11px] p-0.5"
            title="Copy Full Parcel ID"
          >
            <FaCopy />
          </button>
        </div>
      ),
    },
    {
      header: "Amount Paid",
      render: (p) => (
        <span className="font-bold text-sm text-[#008060]">
          ৳{p.amount}
        </span>
      ),
    },
    {
      header: "Method",
      render: (p) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
          <FaCreditCard className="text-slate-500 text-xs" />
          {p.paymentMethod || "Stripe"}
        </span>
      ),
    },
    {
      header: "Status",
      render: () => (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#008060]/10 text-[#008060]">
          <FaCheckCircle className="text-[10px]" /> Completed
        </span>
      ),
    },
    {
      header: "Paid At",
      render: (p) => (
        <span className="text-xs text-slate-500">
          {formatDate(p.paid_at_string || p.paid_at)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-[#20363A] to-[#122326] p-6 rounded-2xl text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payment History</h1>
          <p className="text-slate-300 text-sm mt-1">
            Review your delivery payment receipts and transactions
          </p>
        </div>
        <Link
          to="/dashboard/myParcels"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#CAEB66] hover:bg-[#bfe258] text-[#122326] font-bold text-sm rounded-xl transition-all shadow-sm shrink-0"
        >
          <span>View My Parcels</span>
          <FaArrowRight className="text-xs" />
        </Link>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#008060] flex items-center justify-center shrink-0">
            <FaWallet className="text-xl" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Spent
            </p>
            <p className="text-2xl font-extrabold text-slate-800 mt-0.5">
              ৳{totalSpent}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FaReceipt className="text-xl" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Transactions
            </p>
            <p className="text-2xl font-extrabold text-slate-800 mt-0.5">
              {totalItems}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <FaCheckCircle className="text-xl" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Success Rate
            </p>
            <p className="text-2xl font-extrabold text-slate-800 mt-0.5">
              100%
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          <input
            type="text"
            placeholder="Search by Transaction ID or Parcel ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#20363A] focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      {/* Main Data Table */}
      <DataTable<PaymentRecord>
        columns={columns}
        data={payments}
        keyExtractor={(p) => p.transactionId}
        isLoading={isLoading}
        emptyMessage="No payment records found"
        emptySubtext={
          searchQuery
            ? "No transactions match your search query."
            : "You haven't made any parcel payments yet."
        }
        emptyIcon={<FaReceipt className="text-2xl text-slate-400" />}
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

export default PaymentHistory;
