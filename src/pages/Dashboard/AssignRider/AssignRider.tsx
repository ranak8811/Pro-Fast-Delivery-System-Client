import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaMotorcycle } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import useTrackingLogger from "../../../hooks/useTrackingLogger";
import useAuth from "../../../hooks/useAuth";
import Loading from "../../../components/Loading";

interface AssignableParcel {
  _id: string;
  tracking_id: string;
  title: string;
  type: string;
  sender_center: string;
  receiver_center: string;
  cost: number;
  creation_date: string;
}

interface AvailableRider {
  _id: string;
  name: string;
  email: string;
  phone: string;
  bike_brand: string;
  bike_registration: string;
}

const AssignRider: React.FC = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedParcel, setSelectedParcel] = useState<AssignableParcel | null>(null);
  const [selectedRider, setSelectedRider] = useState<AvailableRider | null>(null);
  const [riders, setRiders] = useState<AvailableRider[]>([]);
  const [loadingRiders, setLoadingRiders] = useState(false);
  const queryClient = useQueryClient();
  const { logTracking } = useTrackingLogger();
  const { user } = useAuth();

  const { data: parcels = [], isLoading } = useQuery<AssignableParcel[]>({
    queryKey: ["assignableParcels"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        "/business?payment_status=paid&delivery_status=not_collected",
      );
      return res.data.sort(
        (a: AssignableParcel, b: AssignableParcel) =>
          new Date(a.creation_date).getTime() - new Date(b.creation_date).getTime(),
      );
    },
  });

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

      // track rider assigned
      if (selectedParcel && selectedRider) {
        await logTracking({
          tracking_id: selectedParcel.tracking_id,
          status: "rider_assigned",
          details: `Assigned to ${selectedRider.name}`,
          updated_by: user?.email || undefined,
        });
      }
      const dialog = document.getElementById("assignModal") as HTMLDialogElement | null;
      dialog?.close();
    },
    onError: () => {
      Swal.fire("Error", "Failed to assign rider", "error");
    },
  });

  // Step 2: Open modal and load matching riders
  const openAssignModal = async (parcel: AssignableParcel): Promise<void> => {
    setSelectedParcel(parcel);
    setLoadingRiders(true);
    setRiders([]);

    try {
      const res = await axiosSecure.get("/employee/available", {
        params: {
          district: parcel.sender_center,
        },
      });
      setRiders(res.data);
    } catch (error) {
      console.error("Error fetching riders", error);
      Swal.fire("Error", "Failed to load riders", "error");
    } finally {
      setLoadingRiders(false);
      const dialog = document.getElementById("assignModal") as HTMLDialogElement | null;
      dialog?.showModal();
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Assign Rider to Parcels</h2>

      {isLoading ? (
        <Loading />
      ) : parcels.length === 0 ? (
        <p className="text-gray-500">No parcels available for assignment.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Tracking ID</th>
                <th>Title</th>
                <th>Type</th>
                <th>Sender Center</th>
                <th>Receiver Center</th>
                <th>Cost</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel) => (
                <tr key={parcel._id}>
                  <td>{parcel.tracking_id}</td>
                  <td>{parcel.title}</td>
                  <td>{parcel.type}</td>
                  <td>{parcel.sender_center}</td>
                  <td>{parcel.receiver_center}</td>
                  <td>৳{parcel.cost}</td>
                  <td>{new Date(parcel.creation_date).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => openAssignModal(parcel)}
                      className="btn btn-sm btn-primary text-black"
                    >
                      <FaMotorcycle className="inline-block mr-1" />
                      Assign Rider
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Assign Rider Modal */}
          <dialog id="assignModal" className="modal">
            <div className="modal-box max-w-2xl">
              <h3 className="text-lg font-bold mb-3">
                Assign Rider for Parcel:{" "}
                <span className="text-primary">{selectedParcel?.title}</span>
              </h3>

              {loadingRiders ? (
                <Loading />
              ) : riders.length === 0 ? (
                <p className="text-error">
                  No available riders in this district.
                </p>
              ) : (
                <div className="overflow-x-auto max-h-80 overflow-y-auto">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Bike Info</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {riders.map((rider) => (
                        <tr key={rider._id}>
                          <td>{rider.name}</td>
                          <td>{rider.phone}</td>
                          <td>
                            {rider.bike_brand} - {rider.bike_registration}
                          </td>
                          <td>
                            <button
                              onClick={() => {
                                if (selectedParcel) {
                                  assignRider({
                                    parcelId: selectedParcel._id,
                                    rider,
                                  });
                                }
                              }}
                              className="btn btn-xs btn-success"
                            >
                              Assign
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="modal-action">
                <form method="dialog">
                  <button className="btn">Close</button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      )}
    </div>
  );
};

export default AssignRider;
