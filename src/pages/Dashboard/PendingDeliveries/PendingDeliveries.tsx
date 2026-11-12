import React from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import useTrackingLogger from "../../../hooks/useTrackingLogger";
import Loading from "../../../components/Loading";
import useTitle from "../../../hooks/useTitle";

interface RiderParcel {
  _id: string;
  tracking_id: string;
  title: string;
  type: string;
  receiver_name: string;
  receiver_center: string;
  cost: number;
  delivery_status: string;
}

const PendingDeliveries: React.FC = () => {
  useTitle("Pending Deliveries");
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { logTracking } = useTrackingLogger();
  const { user } = useAuth();

  // Load parcels assigned to the current rider
  const { data: parcels = [], isLoading } = useQuery<RiderParcel[]>({
    queryKey: ["riderParcels"],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/employee/parcels?email=${user?.email}`,
      );
      return res.data;
    },
  });

  // Mutation for updating parcel status
  const { mutateAsync: updateStatus } = useMutation({
    mutationFn: async ({
      parcel,
      status,
    }: {
      parcel: RiderParcel;
      status: string;
    }) => {
      const res = await axiosSecure.patch(`/business/${parcel._id}/status`, {
        status,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["riderParcels"] });
    },
  });

  const handleStatusUpdate = (parcel: RiderParcel, newStatus: string): void => {
    Swal.fire({
      title: "Are you sure?",
      text: `Mark parcel as ${newStatus.replace("_", " ")}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, update",
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatus({ parcel, status: newStatus })
          .then(async () => {
            Swal.fire("Updated!", "Parcel status updated.", "success");

            // log tracking
            let trackDetails = `Picked up by ${user?.displayName || "Rider"}`;
            if (newStatus === "delivered") {
              trackDetails = `Delivered by ${user?.displayName || "Rider"}`;
            }
            await logTracking({
              tracking_id: parcel.tracking_id,
              status: newStatus,
              details: trackDetails,
              updated_by: user?.email || undefined,
            });
          })
          .catch(() => {
            Swal.fire("Error!", "Failed to update status.", "error");
          });
      }
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Pending Deliveries</h2>
      {isLoading ? (
        <Loading />
      ) : parcels.length === 0 ? (
        <p className="text-gray-500">No assigned deliveries.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Tracking ID</th>
                <th>Title</th>
                <th>Type</th>
                <th>Receiver</th>
                <th>Receiver Center</th>
                <th>Cost</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel) => (
                <tr key={parcel._id}>
                  <td>{parcel.tracking_id}</td>
                  <td>{parcel.title}</td>
                  <td>{parcel.type}</td>
                  <td>{parcel.receiver_name}</td>
                  <td>{parcel.receiver_center}</td>
                  <td>৳{parcel.cost}</td>
                  <td className="capitalize">
                    {parcel.delivery_status.replace("_", " ")}
                  </td>
                  <td>
                    {parcel.delivery_status === "rider_assigned" && (
                      <button
                        className="btn btn-sm btn-primary text-black"
                        onClick={() => handleStatusUpdate(parcel, "in_transit")}
                      >
                        Mark Picked Up
                      </button>
                    )}
                    {parcel.delivery_status === "in_transit" && (
                      <button
                        className="btn btn-sm btn-success text-black"
                        onClick={() => handleStatusUpdate(parcel, "delivered")}
                      >
                        Mark Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PendingDeliveries;
