import React, { useState, useEffect, Fragment } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { Dialog, Transition } from "@headlessui/react";
import {
  FaSearch,
  FaBoxOpen,
  FaTimes,
  FaCopy,
  FaCheckCircle,
  FaTruck,
  FaClock,
  FaEye,
  FaUserAlt,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import useTitle from "../../../hooks/useTitle";
import Loading from "../../../components/Loading";
import AITrackingAssistantCard from "../../../components/AITrackingAssistantCard";
import { DataTable, ColumnDef } from "../../../components/common/DataTable";
import { Parcel } from "../../../types/parcel";

interface TrackingEvent {
  _id?: string;
  time: string;
  status: string;
  message?: string;
}

interface RiderDetails {
  name: string;
  phone: string;
  bike_brand?: string;
}

interface PaymentDetails {
  amount: number;
  transactionId: string;
  paid_at: string;
}

interface DetailedParcelTracking {
  parcel?: Parcel;
  riderDetails?: RiderDetails | null;
  paymentDetails?: PaymentDetails | null;
  trackingEvents?: TrackingEvent[];
}

interface PaginatedParcelsResponse {
  data: Parcel[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const TrackParcel: React.FC = () => {
  useTitle("Track Parcel");
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { trackingId: routeTrackingId } = useParams<{ trackingId?: string }>();
  const [searchParams] = useSearchParams();
  const queryTrackingId = searchParams.get("trackingId");

  const [selectedTrackingId, setSelectedTrackingId] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Sync route param or query param if present
  useEffect(() => {
    const targetId = routeTrackingId || queryTrackingId;
    if (targetId && targetId.trim().length > 0) {
      setSelectedTrackingId(targetId.trim());
      setSearchInput(targetId.trim());
      setIsOpen(true);
    }
  }, [routeTrackingId, queryTrackingId]);

  const closeModal = () => {
    setIsOpen(false);
    setSelectedTrackingId(null);
  };

  const openModal = (trackingId: string) => {
    if (!trackingId) return;
    setSelectedTrackingId(trackingId);
    setIsOpen(true);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      openModal(searchInput.trim());
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Tracking ID copied to clipboard!");
  };

  // Fetch all parcels for the logged-in user with pagination support
  const {
    data: apiResponse,
    isLoading: parcelsLoading,
    isError: parcelsError,
    error: parcelsErrorObj,
  } = useQuery<PaginatedParcelsResponse | Parcel[], Error>({
    queryKey: ["userParcels", user?.email, page, pageSize],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await axiosSecure.get(
        `/users/parcels?email=${encodeURIComponent(user.email)}&page=${page}&limit=${pageSize}`
      );
      return res.data;
    },
    enabled: Boolean(user?.email && !authLoading),
  });

  const isPaginated =
    apiResponse && !Array.isArray(apiResponse) && "data" in (apiResponse as any);
  const parcels: Parcel[] = isPaginated
    ? (apiResponse as PaginatedParcelsResponse).data
    : Array.isArray(apiResponse)
    ? apiResponse
    : [];
  const totalCount: number = isPaginated
    ? (apiResponse as PaginatedParcelsResponse).total
    : parcels.length;
  const totalPages: number = isPaginated
    ? (apiResponse as PaginatedParcelsResponse).totalPages
    : Math.ceil(parcels.length / pageSize) || 1;

  // Fetch detailed tracking data for the selected parcel (for modal)
  const {
    data: detailedTrackingData,
    isLoading: detailedLoading,
    isError: detailedError,
    error: detailedErrorObj,
  } = useQuery<DetailedParcelTracking, Error>({
    queryKey: ["detailedParcelTracking", selectedTrackingId],
    queryFn: async () => {
      if (!selectedTrackingId) return {};
      const res = await axiosSecure.get(
        `/tracking/details/${encodeURIComponent(selectedTrackingId)}`
      );
      return res.data;
    },
    enabled: Boolean(selectedTrackingId && isOpen),
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <FaCheckCircle className="text-emerald-500 text-xs" />
            Delivered
          </span>
        );
      case "in_transit":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-600 border border-sky-500/20">
            <FaTruck className="text-sky-500 text-xs" />
            In Transit
          </span>
        );
      case "rider_assigned":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
            <FaTruck className="text-indigo-500 text-xs" />
            Rider Assigned
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 border border-rose-500/20">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
            <FaClock className="text-amber-500 text-xs" />
            {status ? status.replace(/_/g, " ") : "Pending"}
          </span>
        );
    }
  };

  const columns: ColumnDef<Parcel>[] = [
    {
      header: "Tracking ID",
      accessorKey: "tracking_id",
      render: (item: Parcel) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-base-content bg-base-200/70 px-2 py-0.5 rounded border border-base-300">
            {item.tracking_id}
          </span>
          <button
            onClick={() => copyToClipboard(item.tracking_id)}
            title="Copy Tracking ID"
            className="p-1 rounded text-base-content/40 hover:text-base-content hover:bg-base-200 transition-colors"
          >
            <FaCopy className="text-xs" />
          </button>
        </div>
      ),
    },
    {
      header: "Sender",
      accessorKey: "sender_name",
      render: (item: Parcel) => (
        <div className="flex flex-col text-xs">
          <span className="font-semibold text-base-content flex items-center gap-1">
            <FaUserAlt className="text-base-content/40 text-[10px]" />
            {item.sender_name || "N/A"}
          </span>
          {item.sender_contact && (
            <span className="text-base-content/60 flex items-center gap-1 mt-0.5">
              <FaPhoneAlt className="text-base-content/40 text-[10px]" />
              {item.sender_contact}
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Receiver",
      accessorKey: "receiver_name",
      render: (item: Parcel) => (
        <div className="flex flex-col text-xs">
          <span className="font-semibold text-base-content flex items-center gap-1">
            <FaUserAlt className="text-base-content/40 text-[10px]" />
            {item.receiver_name || "N/A"}
          </span>
          {item.receiver_district && (
            <span className="text-base-content/60 flex items-center gap-1 mt-0.5">
              <FaMapMarkerAlt className="text-base-content/40 text-[10px]" />
              {item.receiver_district}
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "delivery_status",
      render: (item: Parcel) => getStatusBadge(item.delivery_status),
    },
    {
      header: "Created Date",
      accessorKey: "creation_date",
      render: (item: Parcel) => (
        <span className="text-xs text-base-content/70">
          {item.creation_date
            ? format(parseISO(item.creation_date), "MMM dd, yyyy")
            : "N/A"}
        </span>
      ),
    },
    {
      header: "Action",
      className: "text-right",
      render: (item: Parcel) => (
        <div className="flex justify-end">
          <button
            onClick={() => openModal(item.tracking_id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#20363A] text-white hover:bg-[#20363A]/90 transition-all shadow-xs"
          >
            <FaEye className="text-xs text-[#CAEB66]" />
            Track Details
          </button>
        </div>
      ),
    },
  ];

  if (authLoading) {
    return <Loading />;
  }

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#20363A] rounded-3xl p-6 md:p-10 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#CAEB66]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#CAEB66] text-xs font-medium mb-3 backdrop-blur-md">
            <FaTruck className="text-xs" /> Live Tracking Center
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-2">
            Track Any Shipment
          </h1>
          <p className="text-white/70 text-sm md:text-base leading-relaxed">
            Enter your unique parcel tracking code for instant, real-time AI status prediction, carrier location updates, and delivery timelines.
          </p>

          {/* Search bar inside header */}
          <form onSubmit={handleSearchSubmit} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-lg">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter tracking ID (e.g. PCL-20260126-3Z0HU)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#CAEB66] shadow-sm font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={!searchInput.trim()}
              className="px-6 py-3 rounded-xl bg-[#CAEB66] text-[#20363A] font-bold text-sm hover:bg-[#bfe259] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
            >
              <FaSearch className="text-xs" />
              Track Now
            </button>
          </form>
        </div>
      </div>

      {parcelsError && (
        <div className="alert alert-error max-w-xl mx-auto my-4 text-sm">
          <span>Error loading parcels: {parcelsErrorObj?.message || "Unknown error occurred"}</span>
        </div>
      )}

      {/* Parcels Table with Server Pagination */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-base-content">
              Your Recent Parcels
            </h2>
            <p className="text-xs text-base-content/60">
              Select any parcel to view live events and AI milestone analysis
            </p>
          </div>
          <div className="text-xs font-semibold text-base-content/60">
            Total {totalCount} {totalCount === 1 ? "parcel" : "parcels"}
          </div>
        </div>

        <DataTable<Parcel>
          columns={columns}
          data={parcels}
          isLoading={parcelsLoading}
          keyExtractor={(item) => item._id || item.tracking_id}
          emptyIcon={<FaBoxOpen className="text-3xl text-slate-400" />}
          emptyMessage="No shipments found"
          emptySubtext="You have not created any parcels yet. Enter a Tracking ID above to track any existing parcel."
          pagination={{
            page: page,
            totalPages: totalPages,
            pageSize: pageSize,
            totalItems: totalCount,
            onPageChange: (newPage) => setPage(newPage),
            onPageSizeChange: (newPageSize) => {
              setPageSize(newPageSize);
              setPage(1);
            },
            pageSizeOptions: [5, 10, 20, 50],
          }}
        />
      </div>

      {/* Modal for detailed tracking with AI Assistant Card */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-base-100 p-6 md:p-8 text-left align-middle shadow-2xl transition-all border border-base-200">
                  <div className="flex items-center justify-between pb-4 border-b border-base-200">
                    <div>
                      <Dialog.Title
                        as="h3"
                        className="text-lg md:text-xl font-extrabold text-base-content"
                      >
                        Parcel Tracking Information
                      </Dialog.Title>
                      {selectedTrackingId && (
                        <p className="text-xs text-base-content/60 font-mono mt-0.5">
                          ID: {selectedTrackingId}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={closeModal}
                      className="p-2 rounded-xl text-base-content/40 hover:text-base-content hover:bg-base-200 transition-colors"
                      aria-label="Close"
                    >
                      <FaTimes className="text-sm" />
                    </button>
                  </div>

                  <div className="mt-5 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                    {/* Integrated AI Smart Tracking Assistant Card */}
                    {selectedTrackingId && (
                      <AITrackingAssistantCard
                        trackingId={selectedTrackingId}
                        className="mb-2"
                      />
                    )}

                    {detailedLoading && (
                      <div className="py-8 flex justify-center">
                        <Loading />
                      </div>
                    )}

                    {detailedError && (
                      <div className="alert alert-warning text-xs">
                        <span>Could not fetch full timeline: {detailedErrorObj?.message}</span>
                      </div>
                    )}

                    {detailedTrackingData && detailedTrackingData.parcel && (
                      <div className="space-y-4">
                        {/* Basic Info */}
                        <div className="bg-base-200/50 p-5 rounded-2xl border border-base-200/80">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/60 mb-3">
                            Parcel Overview
                          </h4>
                          <div className="grid grid-cols-2 gap-3 text-xs md:text-sm">
                            <div>
                              <span className="text-base-content/60 block text-[11px]">Tracking ID</span>
                              <span className="font-mono font-bold text-base-content">
                                {detailedTrackingData.parcel.tracking_id}
                              </span>
                            </div>
                            <div>
                              <span className="text-base-content/60 block text-[11px]">Delivery Status</span>
                              <span className="capitalize font-semibold text-base-content">
                                {detailedTrackingData.parcel.delivery_status?.replace(/_/g, " ")}
                              </span>
                            </div>
                            <div>
                              <span className="text-base-content/60 block text-[11px]">Cost</span>
                              <span className="font-bold text-base-content">
                                ${detailedTrackingData.parcel.cost}
                              </span>
                            </div>
                            <div>
                              <span className="text-base-content/60 block text-[11px]">Payment</span>
                              <span className="capitalize font-semibold text-base-content">
                                {detailedTrackingData.parcel.payment_status}
                              </span>
                            </div>
                            <div>
                              <span className="text-base-content/60 block text-[11px]">Sender</span>
                              <span className="font-medium text-base-content">
                                {detailedTrackingData.parcel.sender_name}
                              </span>
                            </div>
                            <div>
                              <span className="text-base-content/60 block text-[11px]">Receiver</span>
                              <span className="font-medium text-base-content">
                                {detailedTrackingData.parcel.receiver_name}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Rider Info */}
                        {detailedTrackingData.riderDetails && (
                          <div className="bg-base-200/50 p-5 rounded-2xl border border-base-200/80">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/60 mb-3">
                              Assigned Courier Rider
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs md:text-sm">
                              <div>
                                <span className="text-base-content/60 block text-[11px]">Courier Name</span>
                                <span className="font-bold text-base-content">
                                  {detailedTrackingData.riderDetails.name}
                                </span>
                              </div>
                              <div>
                                <span className="text-base-content/60 block text-[11px]">Phone</span>
                                <span className="font-medium text-base-content">
                                  {detailedTrackingData.riderDetails.phone}
                                </span>
                              </div>
                              {detailedTrackingData.riderDetails.bike_brand && (
                                <div>
                                  <span className="text-base-content/60 block text-[11px]">Vehicle</span>
                                  <span className="font-medium text-base-content">
                                    {detailedTrackingData.riderDetails.bike_brand}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Payment Info */}
                        {detailedTrackingData.paymentDetails && (
                          <div className="bg-base-200/50 p-5 rounded-2xl border border-base-200/80">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/60 mb-3">
                              Payment Summary
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs md:text-sm">
                              <div>
                                <span className="text-base-content/60 block text-[11px]">Amount</span>
                                <span className="font-bold text-emerald-600">
                                  ${detailedTrackingData.paymentDetails.amount}
                                </span>
                              </div>
                              <div>
                                <span className="text-base-content/60 block text-[11px]">Transaction ID</span>
                                <span className="font-mono text-xs text-base-content/80">
                                  {detailedTrackingData.paymentDetails.transactionId}
                                </span>
                              </div>
                              <div>
                                <span className="text-base-content/60 block text-[11px]">Paid At</span>
                                <span className="text-xs text-base-content/80">
                                  {detailedTrackingData.paymentDetails.paid_at
                                    ? format(
                                        parseISO(detailedTrackingData.paymentDetails.paid_at),
                                        "PPP p"
                                      )
                                    : "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Event Timeline */}
                        {detailedTrackingData.trackingEvents &&
                          detailedTrackingData.trackingEvents.length > 0 && (
                            <div className="bg-base-200/50 p-5 rounded-2xl border border-base-200/80">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/60 mb-3">
                                Status Timeline
                              </h4>
                              <ul className="timeline timeline-vertical">
                                {detailedTrackingData.trackingEvents.map((event, index) => (
                                  <li key={event._id || index}>
                                    {index > 0 && <hr />}
                                    <div className="timeline-middle">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="w-5 h-5 text-[#20363A]"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.06l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </div>
                                    <div className="timeline-end timeline-box mb-4 bg-base-100 shadow-xs border border-base-200 rounded-xl p-3">
                                      <time className="font-mono text-[11px] text-base-content/60">
                                        {event.time
                                          ? format(parseISO(event.time), "PPP p")
                                          : ""}
                                      </time>
                                      <div className="text-sm font-bold capitalize text-base-content">
                                        {event.status?.replace(/_/g, " ")}
                                      </div>
                                      {event.message && (
                                        <p className="text-xs text-base-content/80 mt-1">
                                          {event.message}
                                        </p>
                                      )}
                                    </div>
                                    {index <
                                      (detailedTrackingData.trackingEvents?.length ?? 0) - 1 && <hr />}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      className="px-5 py-2.5 rounded-xl bg-base-200 hover:bg-base-300 text-xs font-semibold text-base-content transition-colors"
                      onClick={closeModal}
                    >
                      Close Details
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default TrackParcel;
