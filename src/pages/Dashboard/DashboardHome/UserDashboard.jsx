import React from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../components/Loading";
import ParcelStatusChart from "../../../components/charts/ParcelStatusChart";
import SpendingHistoryChart from "../../../components/charts/SpendingHistoryChart";

const UserDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: userDashboardSummary = {},
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userDashboardSummary", user?.email],
    queryFn: async () => {
      if (!user?.email) return {};
      const res = await axiosSecure.get(
        `/users/dashboard-summary-for-user?email=${user?.email}&_=${Date.now()}`, // Add timestamp to bypass cache
      );
      return res.data;
    },
    enabled: !!user?.email && !authLoading,
  });

  if (isLoading || authLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="text-red-500">
        Error loading dashboard: {error.message}
      </div>
    );
  }
  console.log("User Dashboard Summary:", userDashboardSummary);
  const { totalParcels, parcelStatusCounts, recentParcels, spendingHistory } =
    userDashboardSummary;
  return (
    <div className="p-4">
      <h2 className="text-5xl font-bold mb-8 text-center">User Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold text-gray-700">Total Parcels</h3>
          <p className="text-4xl font-bold text-indigo-600">{totalParcels}</p>
        </div>
        {/* You can add more summary cards here */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">
            Parcel Status Overview
          </h3>
          {parcelStatusCounts && Object.keys(parcelStatusCounts).length > 0 ? (
            <ParcelStatusChart parcelStatusCounts={parcelStatusCounts} />
          ) : (
            <p className="text-gray-600">No parcel status data available.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">
            Spending History
          </h3>
          {spendingHistory && spendingHistory.length > 0 ? (
            <SpendingHistoryChart spendingHistory={spendingHistory} />
          ) : (
            <p className="text-gray-600">No spending history data available.</p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">
          Recent Parcels
        </h3>
        {recentParcels && recentParcels.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Parcel ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Origin
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Destination
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Creation Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentParcels.map((parcel) => (
                  <tr key={parcel._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {parcel._id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {parcel.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {parcel.origin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {parcel.destination}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(parcel.creation_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No recent parcels to display.</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
