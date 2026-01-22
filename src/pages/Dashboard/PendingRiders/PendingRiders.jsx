import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaCheck, FaTimes } from "react-icons/fa";

const PendingRiders = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Load Pending Riders
  const {
    data: riders = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pendingRiders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/employee/pending");
      return res.data;
    },
  });

  // Mutation for updating rider status
  const { mutateAsync: updateRiderStatus } = useMutation({
    mutationFn: async ({ id, status, email }) => {
      await axiosSecure.patch(`/employee/${id}/status`, { status, email });
    },
    onSuccess: () => {
      queryClient.invalidateQueries("pendingRiders");
    },
  });

  // Handle status update
  const handleUpdateStatus = async (rider, newStatus) => {
    const confirm = await Swal.fire({
      title: `Are you sure you want to ${newStatus}?`,
      icon: "question",
      showCancelButton: true,
    });

    if (confirm.isConfirmed) {
      try {
        await updateRiderStatus({
          id: rider._id,
          status: newStatus,
          email: rider.email,
        });
        Swal.fire("Success", `Rider has been ${newStatus}.`, "success");
      } catch (err) {
        Swal.fire("Error", `Failed to ${newStatus} rider.`, err);
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Pending Rider Applications
      </h2>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">Failed to load applications.</p>}
      {!isLoading && !error && (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Region</th>
                <th>District</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {riders.map((rider) => (
                <tr key={rider._id}>
                  <td>{rider.name}</td>
                  <td>{rider.email}</td>
                  <td>{rider.phone}</td>
                  <td>{rider.region}</td>
                  <td>{rider.district}</td>
                  <td className="flex gap-2">
                    <button
                      onClick={() => handleUpdateStatus(rider, "active")}
                      className="btn btn-sm btn-success"
                    >
                      <FaCheck /> Approve
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(rider, "rejected")}
                      className="btn btn-sm btn-error"
                    >
                      <FaTimes /> Reject
                    </button>
                  </td>
                </tr>
              ))}
              {riders.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center">
                    No pending applications.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PendingRiders;
