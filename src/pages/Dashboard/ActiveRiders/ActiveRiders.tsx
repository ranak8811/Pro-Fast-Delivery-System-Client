import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import {
  FaSearch,
  FaUserSlash,
  FaUserCheck,
  FaTimes,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaMotorcycle,
} from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useTitle from "../../../hooks/useTitle";
import { DataTable, ColumnDef } from "../../../components/common/DataTable";

export interface RiderData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  region: string;
  district: string;
  bike_brand: string;
  bike_registration: string;
  status?: string;
}

interface ActiveRidersApiResponse {
  data: RiderData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const ActiveRiders: React.FC = () => {
  useTitle("Active Riders");
  const axiosSecure = useAxiosSecure();

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const {
    data: apiResponse,
    isLoading,
    refetch,
  } = useQuery<ActiveRidersApiResponse | RiderData[]>({
    queryKey: ["activeRiders", page, pageSize, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(pageSize),
      });
      if (searchTerm) params.append("search", searchTerm);
      const res = await axiosSecure.get(`/employee/active?${params.toString()}`);
      return res.data;
    },
  });

  const isPaginated = apiResponse && !Array.isArray(apiResponse) && "data" in apiResponse;
  const riders: RiderData[] = isPaginated
    ? (apiResponse as ActiveRidersApiResponse).data
    : Array.isArray(apiResponse)
    ? apiResponse
    : [];

  const totalItems: number = isPaginated
    ? (apiResponse as ActiveRidersApiResponse).total
    : riders.length;

  const totalPages: number = isPaginated
    ? (apiResponse as ActiveRidersApiResponse).totalPages
    : Math.max(1, Math.ceil(riders.length / pageSize));

  // Handle Deactivation
  const handleDeactivate = async (rider: RiderData): Promise<void> => {
    const confirm = await Swal.fire({
      title: "Deactivate this rider?",
      text: `Do you want to revoke active status for "${rider.name}"? They will no longer receive assignments.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, deactivate",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.patch(`/employee/${rider._id}/status`, {
          status: "pending",
          email: rider.email,
        });
        Swal.fire("Deactivated", `${rider.name} has been deactivated.`, "success");
        refetch();
      } catch (err: unknown) {
        Swal.fire(
          "Error",
          err instanceof Error ? err.message : "Failed to deactivate rider",
          "error",
        );
      }
    }
  };

  const columns: ColumnDef<RiderData>[] = [
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
      header: "Delivery Hero",
      render: (rider) => (
        <div>
          <p className="font-bold text-sm text-slate-900">{rider.name}</p>
          <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
            <FaEnvelope className="text-[10px] text-slate-400" />
            <span>{rider.email}</span>
          </p>
        </div>
      ),
    },
    {
      header: "Contact Phone",
      render: (rider) => (
        <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <FaPhoneAlt className="text-[10px] text-slate-400" />
          <span>{rider.phone}</span>
        </span>
      ),
    },
    {
      header: "Coverage Area",
      render: (rider) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-700">
          <FaMapMarkerAlt className="text-rose-500 text-[10px] shrink-0" />
          <span>{rider.district}, {rider.region}</span>
        </div>
      ),
    },
    {
      header: "Vehicle Info",
      render: (rider) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <FaMotorcycle className="text-slate-400 shrink-0" />
          <span>{rider.bike_brand} ({rider.bike_registration})</span>
        </div>
      ),
    },
    {
      header: "Status",
      render: () => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Active Hero
        </span>
      ),
    },
    {
      header: "Action",
      className: "text-right",
      headerClassName: "text-right",
      render: (rider) => (
        <div className="flex items-center justify-end">
          <button
            onClick={() => handleDeactivate(rider)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl transition-colors"
            title="Deactivate Rider"
          >
            <FaUserSlash className="text-[10px]" /> Deactivate
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#20363A] to-[#122326] p-6 rounded-2xl text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#CAEB66]">
            Administration
          </span>
          <h1 className="text-2xl font-bold tracking-tight mt-0.5">Active Riders</h1>
          <p className="text-slate-300 text-sm mt-1">
            Manage certified Delivery Heroes currently operating in the logistics fleet
          </p>
        </div>
        <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm text-center shrink-0">
          <p className="text-xs text-slate-300 font-medium">Fleet Size</p>
          <p className="text-2xl font-extrabold text-[#CAEB66]">{totalItems}</p>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          <input
            type="text"
            placeholder="Search by rider name, email, or phone..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#20363A] focus:bg-white transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                setPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <DataTable<RiderData>
        columns={columns}
        data={riders}
        keyExtractor={(r) => r._id}
        isLoading={isLoading}
        emptyMessage="No active riders found"
        emptySubtext={
          searchTerm
            ? "No active Delivery Heroes matched your search."
            : "No active riders in the system. Approve pending riders to add them here."
        }
        emptyIcon={<FaUserCheck className="text-2xl text-slate-400" />}
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

export default ActiveRiders;
