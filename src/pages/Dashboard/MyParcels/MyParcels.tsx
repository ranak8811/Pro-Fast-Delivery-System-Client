import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

interface ParcelItem {
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

const MyParcels: React.FC = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedParcel, setSelectedParcel] = useState<ParcelItem | null>(null);

  const { data: parcels = [], refetch } = useQuery<ParcelItem[]>({
    queryKey: ["my-parcels", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await axiosSecure.get(`/business?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const handleView = (parcel: ParcelItem): void => {
    setSelectedParcel(parcel);
    setShowModal(true);
  };

  const handlePay = (id: string): void => {
    navigate(`/dashboard/payment/${id}`);
  };

  const handleDelete = async (id: string): Promise<void> => {
    const confirm = window.confirm(
      "Are you sure? This parcel will be permanently deleted!",
    );
    if (confirm) {
      try {
        const res = await axiosSecure.delete(`/business/${id}`);
        if (res.data.deletedCount) {
          toast.success("Parcel has been deleted.");
        }
        refetch();
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Failed to delete parcel");
      }
    }
  };

  const formatDate = (iso?: string): string => {
    if (!iso) return "N/A";
    return new Date(iso).toLocaleString();
  };

  return (
    <div className="overflow-x-auto shadow-md rounded-xl">
      <table className="table table-zebra w-full">
        <thead className="bg-base-200 text-base font-semibold">
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Type</th>
            <th>Created At</th>
            <th>Cost</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {parcels.map((parcel, index) => (
            <tr key={parcel._id}>
              <td>{index + 1}</td>
              <td className="max-w-[180px] truncate">{parcel.title}</td>
              <td className="capitalize">{parcel.type}</td>
              <td>{formatDate(parcel.creation_date)}</td>
              <td>৳{parcel.cost}</td>
              <td>
                <span
                  className={`badge ${
                    parcel.payment_status === "paid"
                      ? "badge-success"
                      : "badge-error"
                  }`}
                >
                  {parcel.payment_status}
                </span>
              </td>
              <td className="space-x-2">
                <button
                  onClick={() => handleView(parcel)}
                  className="btn btn-xs btn-outline"
                >
                  View
                </button>
                {parcel.payment_status === "unpaid" && (
                  <button
                    onClick={() => handlePay(parcel._id)}
                    className="btn btn-xs btn-primary text-black"
                  >
                    Pay
                  </button>
                )}
                <button
                  onClick={() => handleDelete(parcel._id)}
                  className="btn btn-xs btn-error"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {parcels.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center text-gray-500 py-6">
                No parcels found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Parcel Details Modal */}
      {showModal && selectedParcel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full relative">
            <h2 className="text-2xl font-bold mb-4 text-[#20363A]">Parcel Details</h2>
            <button
              onClick={() => setShowModal(false)}
              className="btn btn-sm btn-circle absolute right-2 top-2"
            >
              ✕
            </button>
            <div className="space-y-2 text-gray-700">
              <p><strong>Tracking ID:</strong> {selectedParcel.tracking_id}</p>
              <p><strong>Title:</strong> {selectedParcel.title}</p>
              <p><strong>Type:</strong> <span className="capitalize">{selectedParcel.type}</span></p>
              {selectedParcel.type === "non-document" && (
                <p><strong>Weight:</strong> {selectedParcel.weight} kg</p>
              )}
              <p><strong>Cost:</strong> ৳{selectedParcel.cost}</p>
              <p><strong>Payment Status:</strong> <span className={`badge ${selectedParcel.payment_status === "paid" ? "badge-success" : "badge-error"}`}>{selectedParcel.payment_status}</span></p>
              <p><strong>Delivery Status:</strong> <span className="capitalize">{selectedParcel.delivery_status?.replace(/_/g, " ")}</span></p>
              <p><strong>Created By:</strong> {selectedParcel.created_by}</p>
              <p><strong>Creation Date:</strong> {formatDate(selectedParcel.creation_date)}</p>
              
              <div className="border-t pt-2 mt-2">
                <h3 className="font-semibold text-lg mt-2">Sender Information</h3>
                <p><strong>Name:</strong> {selectedParcel.sender_name}</p>
                <p><strong>Contact:</strong> {selectedParcel.sender_contact}</p>
                <p><strong>Region:</strong> {selectedParcel.sender_region}</p>
                <p><strong>Center:</strong> {selectedParcel.sender_center}</p>
                <p><strong>Address:</strong> {selectedParcel.sender_address}</p>
                <p><strong>Pickup Instruction:</strong> {selectedParcel.pickup_instruction}</p>
              </div>

              <div className="border-t pt-2 mt-2">
                <h3 className="font-semibold text-lg mt-2">Receiver Information</h3>
                <p><strong>Name:</strong> {selectedParcel.receiver_name}</p>
                <p><strong>Contact:</strong> {selectedParcel.receiver_contact}</p>
                <p><strong>Region:</strong> {selectedParcel.receiver_region}</p>
                <p><strong>Center:</strong> {selectedParcel.receiver_center}</p>
                <p><strong>Address:</strong> {selectedParcel.receiver_address}</p>
                <p><strong>Delivery Instruction:</strong> {selectedParcel.delivery_instruction}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyParcels;
