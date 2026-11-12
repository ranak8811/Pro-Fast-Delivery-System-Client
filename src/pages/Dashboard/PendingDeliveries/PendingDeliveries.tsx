import React, { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import useTrackingLogger from "../../../hooks/useTrackingLogger";
import useTitle from "../../../hooks/useTitle";
import { DataTable, ColumnDef } from "../../../components/common/DataTable";
import toast from "react-hot-toast";
import {
  FaTasks,
  FaCopy,
  FaCheckCircle,
  FaTruck,
  FaClock,
  FaMapMarkerAlt,
  FaBoxOpen,
} from "react-icons/fa";

export interface RiderParcel {
  _id: string;
  tracking_id: string;
  title: string;
  type: string;
  receiver_name: string;
  receiver_center: string;
  cost: number;
  delivery_status: string;
}

interface RiderParcelsApiResponse {
  data: RiderParcel[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const PendingDeliveries: React.FC = () => {
  useTitle("Pending Deliveries");
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { logTracking } = useTrackingLogger();
  const { user } = useAuth();

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Load parcels assigned to current rider with server-side pagination
  const { data: apiResponse, isLoading } = useQuery<RiderParcelsApiResponse | RiderParcel[]>({
    queryKey: ["riderParcels", user?.email, page, pageSize],
    enabled: !!user?.email,
    queryFn: async () => {
      const params = new URLSearchParams({
        email: user?.email || "",
        page: String(page),
        limit: String(pageSize),
      });
      const res = await axiosSecure.get(`/employee/parcels?${params.toString()}`);
      return res.data;
    },
  });

  const isPaginated = apiResponse && !Array.isArray(apiResponse) && "data" in apiResponse;
  const parcels: RiderParcel[] = isPaginated
    ? (apiResponse as RiderParcelsApiResponse).data
    : Array.isArray(apiResponse)
    ? apiResponse
    : [];

  const totalItems: number = isPaginated
    ? (apiResponse as RiderParcelsApiResponse).total
    : parcels.length;

  const totalPages: number = isPaginated
    ? (apiResponse as RiderParcelsApiResponse).totalPages
    : Math.max(1, Math.ceil(parcels.length / pageSize));

  // Mutation for updating parcel status
  const { mutateAsync: updateStatus } = useMutation({
    mutationFn: async ({
      parcel,
      status,
    }: {
      parcel: RiderParcel;
      status: string;
    }) => {
      return await axiosSecure.patch(`/business/${parcel._id}/status`, {
        delivery_status: status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["riderParcels"] });
    },
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Tracking ID copied!");
  };

  const handleStatusUpdate = (parcel: RiderParcel, newStatus: string) => {
    const isDelivery = newStatus === "delivered";
    const title = isDelivery ? "Complete Delivery?" : "Pick Up Parcel?";
    const text = isDelivery
      ? `Confirm delivery for parcel "${parcel.title}". This will finalize the shipment.`
      : `Mark parcel "${parcel.title}" as picked up and in-transit.`;

    Swal.fire({
      title,
      text,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: isDelivery ? "#008060" : "#2563eb",
      cancelButtonColor: "#64748b",
      confirmButtonText: isDelivery ? "Yes, Delivered!" : "Yes, Pick Up!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await updateStatus({ parcel, status: newStatus });
          Swal.fire("Updated!", `Parcel is now ${newStatus.replace("_", " ")}.`, "success");

          // Log tracking
          let trackDetails = `Picked up by Rider ${user?.displayName || ""}`;
          if (newStatus === "delivered") {
            trackDetails = `Delivered to recipient by ${user?.displayName || "Rider"}`;
          }

          await logTracking({
            tracking_id: parcel.tracking_id,
            status: newStatus,
            details: trackDetails,
            updated_by: user?.email || undefined,
          });
        } catch {
          Swal.fire("Error!", "Failed to update parcel status.", "error");
        }
      }
    });
  };

  const columns: ColumnDef<RiderParcel>[] = [
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
          <span className="inline-block text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
            {parcel.type}
          </span>
        </div>
      ),
    },
    {
      header: "Recipient",
      render: (parcel) => (
        <span className="font-medium text-xs text-slate-800">
          {parcel.receiver_name}
        </span>
      ),
    },
    {
      header: "Delivery Destination",
      render: (parcel) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <FaMapMarkerAlt className="text-rose-500 text-[10px] shrink-0" />
          <span>{parcel.receiver_center}</span>
        </div>
      ),
    },
    {
      header: "Delivery Fee",
      render: (parcel) => (
        <span className="font-bold text-sm text-slate-800">৳{parcel.cost}</span>
      ),
    },
    {
      header: "Current Status",
      render: (parcel) =>
        parcel.delivery_status === "in_transit" ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
            <FaTruck className="text-[10px]" /> In Transit
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/60">
            <FaClock className="text-[10px]" /> Assigned
          </span>
        ),
    },
    {
      header: "Action",
      className: "text-right",
      headerClassName: "text-right",
      render: (parcel) => (
        <div className="flex items-center justify-end">
          {parcel.delivery_status === "rider_assigned" && (
            <button
              onClick={() => handleStatusUpdate(parcel, "in_transit")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
            >
              <FaTruck className="text-[10px]" /> Pick Up
            </button>
          )}

          {parcel.delivery_status === "in_transit" && (
            <button
              onClick={() => handleStatusUpdate(parcel, "delivered")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#008060] hover:bg-[#006e52] text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
            >
              <FaCheckCircle className="text-[10px]" /> Mark Delivered
            </button>
          )}
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
            Rider Dispatch
          </span>
          <h1 className="text-2xl font-bold tracking-tight mt-0.5">Pending Deliveries</h1>
          <p className="text-slate-300 text-sm mt-1">
            Pick up assigned parcels and mark completed deliveries
          </p>
        </div>
        <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm text-center shrink-0">
          <p className="text-xs text-slate-300 font-medium">Assigned Tasks</p>
          <p className="text-2xl font-extrabold text-[#CAEB66]">{totalItems}</p>
        </div>
      </div>

      {/* Main Table */}
      <DataTable<RiderParcel>
        columns={columns}
        data={parcels}
        keyExtractor={(p) => p._id}
        isLoading={isLoading}
        emptyMessage="No pending deliveries"
        emptySubtext="You currently have no tasks assigned to you. New deliveries will appear here."
        emptyIcon={<FaTasks className="text-2xl text-slate-400" />}
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

export default PendingDeliveries;
