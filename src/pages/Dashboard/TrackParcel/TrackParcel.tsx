import React, { useState, useEffect, Fragment } from "react";
import { useParams, useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { Dialog, Transition } from "@headlessui/react";
import { FaSearch, FaBoxOpen, FaTimes } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Loading from "../../../components/Loading";
import AITrackingAssistantCard from "../../../components/AITrackingAssistantCard";
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

const TrackParcel: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { trackingId: routeTrackingId } = useParams<{ trackingId?: string }>();
  const [searchParams] = useSearchParams();
  const queryTrackingId = searchParams.get("trackingId");

  const [selectedTrackingId, setSelectedTrackingId] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Sync route param or query param if present
  useEffect(() => {
    const targetId = routeTrackingId || queryTrackingId;
    if (targetId && targetId.trim().length > 0) {
      setSelectedTrackingId(targetId.trim());
      setSearchInput(targetId.trim());
      setIsOpen(true);
    }
  }, [routeTrackingId, queryTrackingId]);

  function closeModal() {
    setIsOpen(false);
    setSelectedTrackingId(null);
  }

  function openModal(trackingId: string) {
    if (!trackingId) return;
    setSelectedTrackingId(trackingId);
    setIsOpen(true);
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      openModal(searchInput.trim());
    }
  };

  // Fetch all parcels for the logged-in user
  const {
    data: userParcels = [],
    isLoading: parcelsLoading,
    isError: parcelsError,
    error: parcelsErrorObj,
  } = useQuery<Parcel[], Error>({
    queryKey: ["userParcels", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await axiosSecure.get(`/users/parcels?email=${encodeURIComponent(user.email)}`);
      return res.data;
    },
    enabled: Boolean(user?.email && !authLoading),
  });

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

  if (parcelsLoading || authLoading) {
    return <Loading />;
  }

  if (parcelsError) {
    return (
      <div className="alert alert-error max-w-xl mx-auto my-8">
        <span>Error loading parcels: {parcelsErrorObj?.message || "Unknown error occurred"}</span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-5xl font-extrabold text-base-content tracking-tight">
          Track Your Parcels
        </h2>
        <p className="text-base-content/70 mt-2 text-sm md:text-base">
          Real-time updates powered by AI Smart Tracking Assistant
        </p>
      </div>

      {/* Direct Search Bar */}
      <div className="max-w-xl mx-auto mb-8 bg-base-100 p-3 md:p-4 rounded-2xl shadow-sm border border-base-200">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by Tracking ID (e.g. PCL-20260126-3Z0HU)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="input input-bordered w-full focus:input-primary text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={!searchInput.trim()}
            className="btn btn-primary gap-2 text-sm"
          >
            <FaSearch />
            Track
          </button>
        </form>
      </div>

      {/* Parcels Table */}
      {userParcels.length === 0 ? (
        <div className="text-center bg-base-100 p-8 rounded-2xl border border-base-200 shadow-sm max-w-lg mx-auto">
          <FaBoxOpen className="mx-auto text-4xl text-base-content/40 mb-3" />
          <h3 className="text-lg font-semibold text-base-content">No parcels found</h3>
          <p className="text-sm text-base-content/60 mt-1">
            You have not created any parcels yet. Enter a Tracking ID above to track any existing parcel.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 p-4 md:p-6 rounded-2xl shadow-sm border border-base-200">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="text-base-content/70 text-xs md:text-sm">
                <th>Tracking ID</th>
                <th>Sender</th>
                <th>Receiver</th>
                <th>Status</th>
                <th>Creation Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userParcels.map((parcel) => (
                <tr key={parcel._id || parcel.tracking_id} className="hover">
                  <td className="font-mono text-xs md:text-sm font-semibold text-primary">
                    {parcel.tracking_id}
                  </td>
                  <td>{parcel.sender_name}</td>
                  <td>{parcel.receiver_name}</td>
                  <td>
                    {parcel.delivery_status === "delivered" ? (
                      <span className="badge badge-success badge-sm font-medium">Delivered</span>
                    ) : (
                      <span className="badge badge-info badge-sm font-medium capitalize">
                        {parcel.delivery_status?.replace(/_/g, " ") || "Pending"}
                      </span>
                    )}
                  </td>
                  <td className="text-xs md:text-sm text-base-content/70">
                    {parcel.creation_date
                      ? format(parseISO(parcel.creation_date), "PPP")
                      : "N/A"}
                  </td>
                  <td className="text-right">
                    <button
                      className="btn btn-sm btn-outline btn-primary gap-1"
                      onClick={() => openModal(parcel.tracking_id)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
            <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" />
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
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-base-100 p-6 text-left align-middle shadow-2xl transition-all border border-base-200">
                  <div className="flex items-center justify-between pb-3 border-b border-base-200">
                    <Dialog.Title
                      as="h3"
                      className="text-lg md:text-xl font-bold text-base-content"
                    >
                      Parcel Tracking Details
                    </Dialog.Title>
                    <button
                      onClick={closeModal}
                      className="btn btn-sm btn-circle btn-ghost"
                      aria-label="Close"
                    >
                      <FaTimes />
                    </button>
                  </div>

                  <div className="mt-4 space-y-4">
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
                        <div className="bg-base-200/50 p-4 rounded-xl border border-base-200">
                          <h4 className="text-sm font-semibold mb-3 text-base-content/80">
                            Basic Information
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs md:text-sm">
                            <p>
                              <strong className="text-base-content/70">Tracking ID:</strong>{" "}
                              <span className="font-mono">{detailedTrackingData.parcel.tracking_id}</span>
                            </p>
                            <p>
                              <strong className="text-base-content/70">Status:</strong>{" "}
                              <span className="capitalize">
                                {detailedTrackingData.parcel.delivery_status?.replace(/_/g, " ")}
                              </span>
                            </p>
                            <p>
                              <strong className="text-base-content/70">Cost:</strong> $
                              {detailedTrackingData.parcel.cost}
                            </p>
                            <p>
                              <strong className="text-base-content/70">Sender:</strong>{" "}
                              {detailedTrackingData.parcel.sender_name}
                            </p>
                            <p>
                              <strong className="text-base-content/70">Receiver:</strong>{" "}
                              {detailedTrackingData.parcel.receiver_name}
                            </p>
                          </div>
                        </div>

                        {/* Rider Info */}
                        {detailedTrackingData.riderDetails && (
                          <div className="bg-base-200/50 p-4 rounded-xl border border-base-200">
                            <h4 className="text-sm font-semibold mb-3 text-base-content/80">
                              Assigned Rider
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs md:text-sm">
                              <p>
                                <strong className="text-base-content/70">Name:</strong>{" "}
                                {detailedTrackingData.riderDetails.name}
                              </p>
                              <p>
                                <strong className="text-base-content/70">Contact:</strong>{" "}
                                {detailedTrackingData.riderDetails.phone}
                              </p>
                              {detailedTrackingData.riderDetails.bike_brand && (
                                <p>
                                  <strong className="text-base-content/70">Vehicle:</strong>{" "}
                                  {detailedTrackingData.riderDetails.bike_brand}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Payment Info */}
                        {detailedTrackingData.paymentDetails && (
                          <div className="bg-base-200/50 p-4 rounded-xl border border-base-200">
                            <h4 className="text-sm font-semibold mb-3 text-base-content/80">
                              Payment Summary
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs md:text-sm">
                              <p>
                                <strong className="text-base-content/70">Amount:</strong> $
                                {detailedTrackingData.paymentDetails.amount}
                              </p>
                              <p>
                                <strong className="text-base-content/70">Txn ID:</strong>{" "}
                                <span className="font-mono text-xs">
                                  {detailedTrackingData.paymentDetails.transactionId}
                                </span>
                              </p>
                              <p>
                                <strong className="text-base-content/70">Paid At:</strong>{" "}
                                {detailedTrackingData.paymentDetails.paid_at
                                  ? format(
                                      parseISO(detailedTrackingData.paymentDetails.paid_at),
                                      "PPP p"
                                    )
                                  : "N/A"}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Event Timeline */}
                        {detailedTrackingData.trackingEvents &&
                          detailedTrackingData.trackingEvents.length > 0 && (
                            <div className="bg-base-200/50 p-4 rounded-xl border border-base-200">
                              <h4 className="text-sm font-semibold mb-3 text-base-content/80">
                                Event Timeline
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
                                        className="w-5 h-5 text-primary"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.06l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </div>
                                    <div className="timeline-end timeline-box mb-6 bg-base-100 shadow-xs border border-base-200">
                                      <time className="font-mono italic text-xs text-base-content/60">
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
                      className="btn btn-sm btn-ghost"
                      onClick={closeModal}
                    >
                      Close
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
