import React, { useState, Fragment } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../components/Loading";
import { format, parseISO } from "date-fns";
import { Dialog, Transition } from "@headlessui/react";

const TrackParcel = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [selectedTrackingId, setSelectedTrackingId] = useState(null);
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
    setSelectedTrackingId(null);
  }

  function openModal(trackingId) {
    setSelectedTrackingId(trackingId);
    setIsOpen(true);
  }

  // Fetch all parcels for the logged-in user
  const {
    data: userParcels = [],
    isLoading: parcelsLoading,
    isError: parcelsError,
    error: parcelsErrorMessage,
  } = useQuery({
    queryKey: ["userParcels", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await axiosSecure.get(`/users/parcels?email=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email && !authLoading,
  });

  // Fetch detailed tracking data for the selected parcel (for modal)
  const {
    data: detailedTrackingData,
    isLoading: detailedLoading,
    isError: detailedError,
    error: detailedErrorMessage,
  } = useQuery({
    queryKey: ["detailedParcelTracking", selectedTrackingId],
    queryFn: async () => {
      if (!selectedTrackingId) return null;
      const res = await axiosSecure.get(
        `/tracking/details/${selectedTrackingId}`,
      );
      return res.data;
    },
    enabled: !!selectedTrackingId && isOpen, // Only fetch when modal is open and trackingId is set
  });

  if (parcelsLoading || authLoading) {
    return <Loading />;
  }

  if (parcelsError) {
    return (
      <div className="text-red-500 text-center mb-4">
        Error loading parcels:{" "}
        {parcelsErrorMessage?.response?.data?.message ||
          parcelsErrorMessage.message}
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-5xl font-bold mb-8 text-center">My Parcels</h2>

      {userParcels.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>You have not created any parcels yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-md">
          <table className="table">
            <thead>
              <tr>
                <th>Tracking ID</th>
                <th>Sender</th>
                <th>Receiver</th>
                <th>Status</th>
                <th>Creation Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userParcels.map((parcel) => (
                <tr key={parcel._id}>
                  <td>{parcel.tracking_id}</td>
                  <td>{parcel.sender_name}</td>
                  <td>{parcel.receiver_name}</td>
                  <td>
                    {parcel.delivery_status === "delivered" ? (
                      <span className="badge badge-success">Done</span>
                    ) : (
                      <span className="badge badge-info">
                        {parcel.delivery_status.replace(/_/g, " ")}
                      </span>
                    )}
                  </td>
                  <td>{format(parseISO(parcel.creation_date), "PPP")}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline btn-info"
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

      {/* Modal for detailed tracking */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
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
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Parcel Tracking Details
                  </Dialog.Title>
                  <div className="mt-2">
                    {detailedLoading && <Loading />}
                    {detailedError && (
                      <div className="text-red-500">
                        Error:{" "}
                        {detailedErrorMessage?.response?.data?.message ||
                          detailedErrorMessage.message}
                      </div>
                    )}
                    {detailedTrackingData && detailedTrackingData.parcel ? (
                      <div className="mt-4 space-y-4">
                        {/* Parcel Details */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="text-md font-semibold mb-2">
                            Basic Info
                          </h4>
                          <p>
                            <strong>Tracking ID:</strong>{" "}
                            {detailedTrackingData.parcel.tracking_id}
                          </p>
                          <p>
                            <strong>Status:</strong>{" "}
                            {detailedTrackingData.parcel.delivery_status.replace(
                              /_/g,
                              " ",
                            )}
                          </p>
                          <p>
                            <strong>Cost:</strong> $
                            {detailedTrackingData.parcel.cost}
                          </p>
                          <p>
                            <strong>Sender:</strong>{" "}
                            {detailedTrackingData.parcel.sender_name}
                          </p>
                          <p>
                            <strong>Receiver:</strong>{" "}
                            {detailedTrackingData.parcel.receiver_name}
                          </p>
                        </div>

                        {/* Rider Details */}
                        {detailedTrackingData.riderDetails && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-md font-semibold mb-2">
                              Rider Info
                            </h4>
                            <p>
                              <strong>Name:</strong>{" "}
                              {detailedTrackingData.riderDetails.name}
                            </p>
                            <p>
                              <strong>Contact:</strong>{" "}
                              {detailedTrackingData.riderDetails.phone}
                            </p>
                            <p>
                              <strong>Bike:</strong>{" "}
                              {detailedTrackingData.riderDetails.bike_brand}
                            </p>
                          </div>
                        )}

                        {/* Payment Details */}
                        {detailedTrackingData.paymentDetails && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-md font-semibold mb-2">
                              Payment Info
                            </h4>
                            <p>
                              <strong>Amount:</strong> $
                              {detailedTrackingData.paymentDetails.amount}
                            </p>
                            <p>
                              <strong>Transaction ID:</strong>{" "}
                              {detailedTrackingData.paymentDetails.transactionId}
                            </p>
                            <p>
                              <strong>Paid At:</strong>{" "}
                              {format(
                                parseISO(detailedTrackingData.paymentDetails.paid_at),
                                "PPP p",
                              )}
                            </p>
                          </div>
                        )}

                        {/* Tracking Timeline */}
                        {detailedTrackingData.trackingEvents &&
                          detailedTrackingData.trackingEvents.length > 0 && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="text-md font-semibold mb-2">
                                Event Timeline
                              </h4>
                              <ul className="timeline timeline-vertical">
                                {detailedTrackingData.trackingEvents.map(
                                  (event, index) => (
                                    <li key={event._id || index}>
                                      {index > 0 && <hr />}
                                      <div className="timeline-middle">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                          className="w-5 h-5"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.06l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      </div>
                                      <div className="timeline-end timeline-box mb-10">
                                        <time className="font-mono italic">
                                          {format(parseISO(event.time), "PPP p")}
                                        </time>
                                        <div className="text-lg font-black">
                                          {event.status.replace(/_/g, " ")}
                                        </div>
                                        {event.message && <p>{event.message}</p>}
                                      </div>
                                      {index <
                                        detailedTrackingData.trackingEvents.length -
                                          1 && <hr />}
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          )}
                            </div>
                    ) : (
                      !detailedLoading &&
                      !detailedError && (
                        <p>No detailed tracking data available.</p>
                      )
                    )}
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
