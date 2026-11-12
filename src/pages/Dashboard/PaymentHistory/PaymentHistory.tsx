import React from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../components/Loading";
import useTitle from "../../../hooks/useTitle";

interface PaymentRecord {
  transactionId: string;
  parcelId: string;
  amount: number;
  paid_at_string?: string;
  paid_at?: string;
}

const formatDate = (iso?: string): string =>
  iso ? new Date(iso).toLocaleString() : "N/A";

const PaymentHistory: React.FC = () => {
  useTitle("Payment History");
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: payments = [], isPending } = useQuery<PaymentRecord[]>({
    queryKey: ["payments", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await axiosSecure.get(
        `/payment/payments?email=${user.email}`,
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isPending) {
    return <Loading />;
  }

  return (
    <div className="overflow-x-auto shadow-md rounded-xl">
      <table className="table table-zebra w-full">
        <thead className="bg-base-200 text-base font-semibold">
          <tr>
            <th>#</th>
            <th>Parcel ID</th>
            <th>Amount</th>
            <th>Transaction</th>
            <th>Paid At</th>
          </tr>
        </thead>
        <tbody>
          {payments.length > 0 ? (
            payments.map((p, index) => (
              <tr key={p.transactionId}>
                <td>{index + 1}</td>
                <td className="truncate" title={p.parcelId}>
                  {p.parcelId}...
                </td>
                <td>৳{p.amount}</td>
                <td className="font-mono text-sm">
                  <span title={p.transactionId}>{p.transactionId}</span>
                </td>
                <td>{formatDate(p.paid_at_string || p.paid_at)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center text-gray-500 py-6">
                No payment history found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;
