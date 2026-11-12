import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import useTitle from "../../../hooks/useTitle";
import { DataTable, ColumnDef } from "../../../components/common/DataTable";
import {
  FaBoxOpen,
  FaCheckCircle,
  FaTruck,
  FaClock,
  FaEye,
  FaCreditCard,
  FaTrashAlt,
  FaCopy,
  FaSearch,
  FaFilter,
  FaTimes,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaUserAlt,
  FaPlus,
} from "react-icons/fa";

export interface ParcelItem {
  _id: string;
  tracking_id?: string;
  title: string;
  type: string;
  weight?: string | number;
  cost: number;
  payment_status: string;
  delivery_status: string;
  creation_date: string;
  created_by?: string;
  sender_name?: string;
  sender_contact?: string;
  sender_region?: string;
  sender_center?: string;
  sender_address?: string;
  pickup_instruction?: string;
  receiver_name?: string;
  receiver_contact?: string;
  receiver_region?: string;
  receiver_center?: string;
  receiver_address?: string;
  delivery_instruction?: string;
}

interface ParcelsApiResponse {
  data: ParcelItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const MyParcels: React.FC = () => {
  useTitle("My Parcels");
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // Filters & Pagination State
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [deliveryFilter, setDeliveryFilter] = useState<string>("");
  const [paymentFilter, setPaymentFilter] = useState<string>("");

  // Modal State
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedParcel, setSelectedParcel] = useState<ParcelItem | null>(null);

  // Fetch paginated parcels from server
  const {
    data: apiResponse,
    isLoading,
    refetch,
  } = useQuery<ParcelsApiResponse | ParcelItem[]>({
    queryKey: [
      "my-parcels",
      user?.email,
      page,
      pageSize,
      deliveryFilter,
      paymentFilter,
      searchQuery,
    ],
    queryFn: async () => {
      if (!user?.email) return { data: [], total: 0, page: 1, limit: pageSize, totalPages: 1 };
      const params = new URLSearchParams({
        email: user.email,
        page: String(page),
        limit: String(pageSize),
      });

      if (deliveryFilter) params.append("delivery_status", deliveryFilter);
      if (paymentFilter) params.append("payment_status", paymentFilter);
      if (searchQuery) params.append("search", searchQuery);

      const res = await axiosSecure.get(`/business?${params.toString()}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Normalize response (in case server returns raw array or paginated object)
  const isPaginated = apiResponse && !Array.isArray(apiResponse) && "data" in apiResponse;
  const parcels: ParcelItem[] = isPaginated
    ? (apiResponse as ParcelsApiResponse).data
    : Array.isArray(apiResponse)
    ? apiResponse
    : [];

  const totalItems: number = isPaginated
    ? (apiResponse as ParcelsApiResponse).total
    : parcels.length;

  const totalPages: number = isPaginated
    ? (apiResponse as ParcelsApiResponse).totalPages
    : Math.max(1, Math.ceil(parcels.length / pageSize));

  // Copy tracking ID
  const handleCopy = (trackingId?: string) => {
    if (!trackingId) return;
    navigator.clipboard.writeText(trackingId);
    toast.success("Tracking ID copied to clipboard!");
  };

  const handleView = (parcel: ParcelItem): void => {
    setSelectedParcel(parcel);
    setShowModal(true);
  };

  const handlePay = (id: string): void => {
    navigate(`/dashboard/payment/${id}`);
  };

  const handleDelete = async (id: string, title: string): Promise<void> => {
    const result = await Swal.fire({
      title: "Delete this parcel?",
      text: `Are you sure you want to remove "${title}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/business/${id}`);
        if (res.data.deletedCount) {
          toast.success("Parcel deleted successfully.");
          refetch();
        }
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Failed to delete parcel");
      }
    }
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
        });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
      case "service_center_delivered":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <FaCheckCircle className="text-[10px]" /> Delivered
          </span>
        );
      case "in_transit":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
            <FaTruck className="text-[10px]" /> In Transit
          </span>
        );
      case "rider_assigned":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/60">
            <FaClock className="text-[10px]" /> Rider Assigned
          </span>
        );
      case "not_collected":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
            <FaClock className="text-[10px]" /> Pending Pickup
          </span>
        );
    }
  };

  const columns: ColumnDef<ParcelItem>[] = [
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
      header: "Tracking & Title",
      render: (parcel) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#20363A] bg-slate-100 px-2 py-0.5 rounded-md">
              {parcel.tracking_id || "PENDING"}
            </span>
            {parcel.tracking_id && (
              <button
                onClick={() => handleCopy(parcel.tracking_id)}
                className="text-slate-400 hover:text-[#20363A] text-xs transition-colors p-1"
                title="Copy Tracking ID"
              >
                <FaCopy />
              </button>
            )}
          </div>
          <p className="text-sm font-semibold text-slate-800 line-clamp-1 max-w-[220px]">
            {parcel.title}
          </p>
          <span className="inline-block text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded">
            {parcel.type} {parcel.weight ? `• ${parcel.weight} kg` : ""}
          </span>
        </div>
      ),
    },
    {
      header: "Route",
      render: (parcel) => (
        <div className="text-xs space-y-0.5">
          <p className="text-slate-600 truncate max-w-[160px]">
            <span className="text-slate-400">From:</span> {parcel.sender_center || "N/A"}
          </p>
          <p className="text-slate-800 font-medium truncate max-w-[160px]">
            <span className="text-slate-400">To:</span> {parcel.receiver_center || "N/A"}
          </p>
        </div>
      ),
    },
    {
      header: "Fee",
      render: (parcel) => (
        <span className="font-bold text-slate-800 text-sm">৳{parcel.cost}</span>
      ),
    },
    {
      header: "Payment",
      render: (parcel) =>
        parcel.payment_status === "paid" ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#008060]/10 text-[#008060]">
            <FaCheckCircle className="text-[10px]" /> Paid
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200/60">
            Unpaid
          </span>
        ),
    },
    {
      header: "Delivery Status",
      render: (parcel) => getStatusBadge(parcel.delivery_status),
    },
    {
      header: "Created",
      render: (parcel) => (
        <span className="text-xs text-slate-500">
          {formatDate(parcel.creation_date)}
        </span>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      headerClassName: "text-right",
      render: (parcel) => (
        <div className="flex items-center justify-end gap-1.5">
          {/* View Details */}
          <button
            onClick={() => handleView(parcel)}
            className="p-2 text-slate-600 hover:text-[#20363A] hover:bg-slate-100 rounded-lg transition-colors"
            title="View Details"
          >
            <FaEye className="text-sm" />
          </button>

          {/* Pay Button */}
          {parcel.payment_status === "unpaid" && (
            <button
              onClick={() => handlePay(parcel._id)}
              className="px-2.5 py-1 text-xs font-bold bg-[#008060] hover:bg-[#006e52] text-white rounded-lg shadow-sm transition-colors flex items-center gap-1"
              title="Pay Now"
            >
              <FaCreditCard className="text-[10px]" /> Pay
            </button>
          )}

          {/* Delete Button */}
          <button
            onClick={() => handleDelete(parcel._id, parcel.title)}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete Parcel"
          >
            <FaTrashAlt className="text-sm" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header section with Send Parcel button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#20363A] to-[#122326] p-6 rounded-2xl text-white shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Parcels</h1>
          <p className="text-slate-300 text-sm mt-1">
            Track, manage, and pay for your delivery shipments
          </p>
        </div>
        <Link
          to="/sendParcel"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#CAEB66] hover:bg-[#bfe258] text-[#122326] font-bold text-sm rounded-xl transition-all duration-200 shadow-sm shrink-0"
        >
          <FaPlus className="text-xs" />
          <span>Send New Parcel</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          <input
            type="text"
            placeholder="Search by title or tracking ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#20363A] focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              <FaTimes />
            </button>
          )}
        </div>

        {/* Dropdown filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <FaFilter className="text-slate-400" />
            <span>Filters:</span>
          </div>

          {/* Delivery Status Filter */}
          <select
            value={deliveryFilter}
            onChange={(e) => {
              setDeliveryFilter(e.target.value);
              setPage(1);
            }}
            className="select select-sm select-bordered bg-slate-50 border-slate-200 text-slate-700 text-xs rounded-xl focus:border-[#20363A]"
          >
            <option value="">All Delivery Status</option>
            <option value="not_collected">Pending Pickup</option>
            <option value="rider_assigned">Rider Assigned</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
          </select>

          {/* Payment Status Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => {
              setPaymentFilter(e.target.value);
              setPage(1);
            }}
            className="select select-sm select-bordered bg-slate-50 border-slate-200 text-slate-700 text-xs rounded-xl focus:border-[#20363A]"
          >
            <option value="">All Payment</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
      </div>

      {/* Main Reusable Data Table */}
      <DataTable<ParcelItem>
        columns={columns}
        data={parcels}
        keyExtractor={(p) => p._id}
        isLoading={isLoading}
        emptyMessage="No parcels found"
        emptySubtext={
          searchQuery || deliveryFilter || paymentFilter
            ? "Try resetting your search query or filters to see more results."
            : "You haven't created any parcel delivery requests yet."
        }
        emptyIcon={<FaBoxOpen className="text-2xl text-slate-400" />}
        emptyAction={
          !searchQuery && !deliveryFilter && !paymentFilter ? (
            <Link
              to="/sendParcel"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#20363A] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#122326] transition-colors"
            >
              <FaPlus className="text-xs" /> Send Your First Parcel
            </Link>
          ) : undefined
        }
        pagination={{
          page,
          pageSize,
          totalItems,
          totalPages,
          onPageChange: (newPage) => setPage(newPage),
          onPageSizeChange: (newSize) => setPageSize(newSize),
        }}
      />

      {/* Parcel Details Modal */}
      {showModal && selectedParcel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <span className="font-mono text-xs font-bold text-[#008060] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60 inline-block mb-1.5">
                  {selectedParcel.tracking_id || "NO TRACKING ID"}
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedParcel.title}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-5 text-sm">
              {/* Route & Status Grid */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Delivery Status</p>
                  <div className="mt-1">{getStatusBadge(selectedParcel.delivery_status)}</div>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Payment Status</p>
                  <p className="mt-1 font-bold capitalize text-slate-800">
                    ৳{selectedParcel.cost} ({selectedParcel.payment_status})
                  </p>
                </div>
              </div>

              {/* Sender & Receiver Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Sender Card */}
                <div className="p-4 rounded-2xl border border-slate-200/80 bg-white">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FaUserAlt className="text-slate-400" /> Sender Info
                  </p>
                  <p className="font-semibold text-slate-800">{selectedParcel.sender_name || "N/A"}</p>
                  <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                    <FaPhoneAlt className="text-[10px] text-slate-400" /> {selectedParcel.sender_contact || "N/A"}
                  </p>
                  <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                    <FaMapMarkerAlt className="text-[10px] text-slate-400" /> {selectedParcel.sender_center}, {selectedParcel.sender_region}
                  </p>
                  {selectedParcel.sender_address && (
                    <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2 rounded-lg">
                      {selectedParcel.sender_address}
                    </p>
                  )}
                </div>

                {/* Receiver Card */}
                <div className="p-4 rounded-2xl border border-slate-200/80 bg-white">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FaUserAlt className="text-[#008060]" /> Receiver Info
                  </p>
                  <p className="font-semibold text-slate-800">{selectedParcel.receiver_name || "N/A"}</p>
                  <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                    <FaPhoneAlt className="text-[10px] text-slate-400" /> {selectedParcel.receiver_contact || "N/A"}
                  </p>
                  <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                    <FaMapMarkerAlt className="text-[10px] text-slate-400" /> {selectedParcel.receiver_center}, {selectedParcel.receiver_region}
                  </p>
                  {selectedParcel.receiver_address && (
                    <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2 rounded-lg">
                      {selectedParcel.receiver_address}
                    </p>
                  )}
                </div>
              </div>

              {/* Instructions */}
              {(selectedParcel.pickup_instruction || selectedParcel.delivery_instruction) && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-2">
                  {selectedParcel.pickup_instruction && (
                    <div>
                      <p className="text-xs font-bold text-slate-500">Pickup Instructions:</p>
                      <p className="text-xs text-slate-700 mt-0.5">{selectedParcel.pickup_instruction}</p>
                    </div>
                  )}
                  {selectedParcel.delivery_instruction && (
                    <div>
                      <p className="text-xs font-bold text-slate-500">Delivery Instructions:</p>
                      <p className="text-xs text-slate-700 mt-0.5">{selectedParcel.delivery_instruction}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-6">
              {selectedParcel.tracking_id ? (
                <Link
                  to={`/dashboard/track/${selectedParcel.tracking_id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#008060] hover:underline"
                >
                  <FaTruck /> View Live Tracking &rarr;
                </Link>
              ) : (
                <div />
              )}

              <button
                onClick={() => setShowModal(false)}
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

export default MyParcels;
