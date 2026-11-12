import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FaMotorcycle,
  FaCopy,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTimes,
  FaUserTie,
  FaCheck,
} from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import useTrackingLogger from "../../../hooks/useTrackingLogger";
import useAuth from "../../../hooks/useAuth";
import useTitle from "../../../hooks/useTitle";
import { DataTable, ColumnDef } from "../../../components/common/DataTable";
import toast from "react-hot-toast";

export interface AssignableParcel {
  _id: string;
  tracking_id: string;
  title: string;
  type: string;
  sender_center: string;
  receiver_center: string;
  cost: number;
  creation_date: string;
}

interface AssignableParcelsApiResponse {
  data: AssignableParcel[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AvailableRider {
  _id: string;
  name: string;
  email: string;
  phone: string;
  bike_brand: string;
  bike_registration: string;
}

const AssignRider: React.FC = () => {
  useTitle("Assign Rider");
  const axiosSecure = useAxiosSecure();
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const [selectedParcel, setSelectedParcel] = useState<AssignableParcel | null>(null);
  const [selectedRider, setSelectedRider] = useState<AvailableRider | null>(null);
  const [riders, setRiders] = useState<AvailableRider[]>([]);
  const [loadingRiders, setLoadingRiders] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();
  const { logTracking } = useTrackingLogger();
  const { user } = useAuth();

  const { data: apiResponse, isLoading } = useQuery<AssignableParcelsApiResponse | AssignableParcel[]>({
    queryKey: ["assignableParcels", page, pageSize],
    queryFn: async () => {
      const params = new URLSearchParams({
        payment_status: "paid",
        delivery_status: "not_collected",
        page: String(page),
        limit: String(pageSize),
      });
      const res = await axiosSecure.get(`/business?${params.toString()}`);
      return res.data;
    },
  });

  const isPaginated = apiResponse && !Array.isArray(apiResponse) && "data" in apiResponse;
  const parcels: AssignableParcel[] = isPaginated
    ? (apiResponse as AssignableParcelsApiResponse).data
    : Array.isArray(apiResponse)
    ? apiResponse
    : [];

  const totalItems: number = isPaginated
    ? (apiResponse as AssignableParcelsApiResponse).total
    : parcels.length;

  const totalPages: number = isPaginated
    ? (apiResponse as AssignableParcelsApiResponse).totalPages
    : Math.max(1, Math.ceil(parcels.length / pageSize));

  const { mutateAsync: assignRider } = useMutation({
    mutationFn: async ({
      parcelId,
      rider,
    }: {
      parcelId: string;
      rider: AvailableRider;
    }) => {
      setSelectedRider(rider);
      const res = await axiosSecure.patch(`/business/${parcelId}/assign`, {
        riderId: rider._id,
        riderEmail: rider.email,
        riderName: rider.name,
      });
      return res.data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["assignableParcels"] });
      Swal.fire("Success", "Rider assigned successfully!", "success");

      // Track rider assigned
      if (selectedParcel && selectedRider) {
        await logTracking({
          tracking_id: selectedParcel.tracking_id,
          status: "rider_assigned",
          details: `Assigned to ${selectedRider.name}`,
          updated_by: user?.email || undefined,
        });
      }
      setIsModalOpen(false);
    },
    onError: () => {
      Swal.fire("Error", "Failed to assign rider", "error");
    },
  });

  const openAssignModal = async (parcel: AssignableParcel): Promise<void> => {
    setSelectedParcel(parcel);
    setLoadingRiders(true);
    setRiders([]);
    setIsModalOpen(true);

    try {
      const res = await axiosSecure.get("/employee/available", {
        params: {
          district: parcel.sender_center,
        },
      });
      setRiders(res.data);
    } catch (error) {
      console.error("Error fetching riders", error);
      Swal.fire("Error", "Failed to load matching riders", "error");
    } finally {
      setLoadingRiders(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Tracking ID copied!");
  };

  const columns: ColumnDef<AssignableParcel>[] = [
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
      header: "Pickup Service Center",
      render: (parcel) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
          <FaMapMarkerAlt className="text-amber-500 text-[10px] shrink-0" />
          <span>{parcel.sender_center}</span>
        </div>
      ),
    },
    {
      header: "Destination Center",
      render: (parcel) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
          <FaMapMarkerAlt className="text-rose-500 text-[10px] shrink-0" />
          <span>{parcel.receiver_center}</span>
        </div>
      ),
    },
    {
      header: "Fee",
      render: (parcel) => (
        <span className="font-bold text-sm text-slate-800">৳{parcel.cost}</span>
      ),
    },
    {
      header: "Order Date",
      render: (parcel) => (
        <span className="text-xs text-slate-500">
          {new Date(parcel.creation_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      header: "Dispatch",
      className: "text-right",
      headerClassName: "text-right",
      render: (parcel) => (
        <div className="flex items-center justify-end">
          <button
            onClick={() => openAssignModal(parcel)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#20363A] hover:bg-[#122326] text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
          >
            <FaMotorcycle className="text-[11px] text-[#CAEB66]" />
            <span>Assign Rider</span>
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
            Dispatch Management
          </span>
          <h1 className="text-2xl font-bold tracking-tight mt-0.5">Assign Rider to Parcels</h1>
          <p className="text-slate-300 text-sm mt-1">
            Dispatch paid shipments to certified Delivery Heroes in their active operating districts
          </p>
        </div>
        <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm text-center shrink-0">
          <p className="text-xs text-slate-300 font-medium">Ready for Dispatch</p>
          <p className="text-2xl font-extrabold text-[#CAEB66]">{totalItems}</p>
        </div>
      </div>

      {/* Main Table */}
      <DataTable<AssignableParcel>
        columns={columns}
        data={parcels}
        keyExtractor={(p) => p._id}
        isLoading={isLoading}
        emptyMessage="No parcels waiting for rider assignment"
        emptySubtext="All paid shipments have already been assigned to delivery riders."
        emptyIcon={<FaMotorcycle className="text-2xl text-slate-400" />}
        pagination={{
          page,
          pageSize,
          totalItems,
          totalPages,
          onPageChange: (newPage) => setPage(newPage),
          onPageSizeChange: (newSize) => setPageSize(newSize),
        }}
      />

      {/* Assign Rider Modal Dialog */}
      {isModalOpen && selectedParcel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Assign Delivery Hero
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {selectedParcel.title}
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  ID: {selectedParcel.tracking_id} • Pickup: {selectedParcel.sender_center}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            {/* Rider List */}
            <div>
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Available Heroes in {selectedParcel.sender_center} ({riders.length})
              </p>

              {loadingRiders ? (
                <div className="py-12 text-center text-slate-400 text-sm">
                  <span className="loading loading-spinner loading-md text-[#20363A]"></span>
                  <p className="mt-2 text-xs">Finding available riders in district...</p>
                </div>
              ) : riders.length === 0 ? (
                <div className="p-6 bg-slate-50 rounded-2xl text-center border border-slate-200/60">
                  <p className="text-sm font-semibold text-slate-700">
                    No active riders available in {selectedParcel.sender_center}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Approve pending riders or wait for active riders to become available in this hub.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {riders.map((r) => (
                    <div
                      key={r._id}
                      className="p-3.5 rounded-2xl border border-slate-200/80 hover:border-[#20363A] bg-white transition-all flex items-center justify-between gap-3 shadow-sm"
                    >
                      <div>
                        <p className="font-bold text-sm text-slate-900">{r.name}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <FaPhoneAlt className="text-[10px] text-slate-400" />
                          <span>{r.phone}</span>
                          <span>•</span>
                          <span>{r.bike_brand} ({r.bike_registration})</span>
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          assignRider({
                            parcelId: selectedParcel._id,
                            rider: r,
                          })
                        }
                        className="px-3.5 py-1.5 bg-[#008060] hover:bg-[#006e52] text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1 shrink-0"
                      >
                        <FaCheck className="text-[10px]" /> Assign
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-5 border-t border-slate-100 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignRider;
