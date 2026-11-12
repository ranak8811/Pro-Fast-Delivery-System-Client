import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useTitle from "../../../hooks/useTitle";
import { DataTable, ColumnDef } from "../../../components/common/DataTable";
import {
  FaCheck,
  FaTimes,
  FaUserClock,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

export interface PendingRider {
  _id: string;
  name: string;
  email: string;
  phone: string;
  region: string;
  district: string;
  bike_brand?: string;
  bike_registration?: string;
  age?: number | string;
  nid?: string;
}

interface PendingRidersApiResponse {
  data: PendingRider[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const PendingRiders: React.FC = () => {
  useTitle("Pending Riders");
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const { data: apiResponse, isLoading } = useQuery<PendingRidersApiResponse | PendingRider[]>({
    queryKey: ["pendingRiders", page, pageSize],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(pageSize),
      });
      const res = await axiosSecure.get(`/employee/pending?${params.toString()}`);
      return res.data;
    },
  });

  const isPaginated = apiResponse && !Array.isArray(apiResponse) && "data" in apiResponse;
  const riders: PendingRider[] = isPaginated
    ? (apiResponse as PendingRidersApiResponse).data
    : Array.isArray(apiResponse)
    ? apiResponse
    : [];

  const totalItems: number = isPaginated
    ? (apiResponse as PendingRidersApiResponse).total
    : riders.length;

  const totalPages: number = isPaginated
    ? (apiResponse as PendingRidersApiResponse).totalPages
    : Math.max(1, Math.ceil(riders.length / pageSize));

  // Mutation for updating rider status
  const { mutateAsync: updateRiderStatus } = useMutation({
    mutationFn: async ({
      id,
      status,
      email,
    }: {
      id: string;
      status: string;
      email: string;
    }) => {
      return await axiosSecure.patch(`/employee/${id}/status`, { status, email });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingRiders"] });
    },
  });

  const handleAction = (rider: PendingRider, status: "active" | "rejected") => {
    const isApprove = status === "active";
    const title = isApprove ? "Approve Rider Application?" : "Reject Application?";
    const text = isApprove
      ? `Promote "${rider.name}" to Active Delivery Hero.`
      : `Decline "${rider.name}"'s rider application.`;

    Swal.fire({
      title,
      text,
      icon: isApprove ? "question" : "warning",
      showCancelButton: true,
      confirmButtonColor: isApprove ? "#008060" : "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: isApprove ? "Yes, Approve!" : "Yes, Reject!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await updateRiderStatus({
            id: rider._id,
            status,
            email: rider.email,
          });
          Swal.fire(
            "Success",
            `Application has been ${isApprove ? "approved" : "rejected"}.`,
            "success",
          );
        } catch {
          Swal.fire("Error", "Failed to update rider status.", "error");
        }
      }
    });
  };

  const columns: ColumnDef<PendingRider>[] = [
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
      header: "Applicant Details",
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
      header: "Coverage Location",
      render: (rider) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-700">
          <FaMapMarkerAlt className="text-rose-500 text-[10px] shrink-0" />
          <span>{rider.district}, {rider.region}</span>
        </div>
      ),
    },
    {
      header: "Vehicle Details",
      render: (rider) => (
        <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
          {rider.bike_brand ? `${rider.bike_brand} (${rider.bike_registration || "N/A"})` : "N/A"}
        </span>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      headerClassName: "text-right",
      render: (rider) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleAction(rider, "active")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#008060] hover:bg-[#006e52] text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
            title="Approve Rider"
          >
            <FaCheck className="text-[10px]" /> Approve
          </button>
          <button
            onClick={() => handleAction(rider, "rejected")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl transition-colors"
            title="Reject Rider"
          >
            <FaTimes className="text-[10px]" /> Reject
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
          <h1 className="text-2xl font-bold tracking-tight mt-0.5">Pending Riders</h1>
          <p className="text-slate-300 text-sm mt-1">
            Review and approve incoming Delivery Hero applications
          </p>
        </div>
        <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm text-center shrink-0">
          <p className="text-xs text-slate-300 font-medium">Pending Review</p>
          <p className="text-2xl font-extrabold text-[#CAEB66]">{totalItems}</p>
        </div>
      </div>

      {/* Main Table */}
      <DataTable<PendingRider>
        columns={columns}
        data={riders}
        keyExtractor={(r) => r._id}
        isLoading={isLoading}
        emptyMessage="No pending rider applications"
        emptySubtext="All incoming rider submissions have been reviewed."
        emptyIcon={<FaUserClock className="text-2xl text-slate-400" />}
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

export default PendingRiders;
