import React from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../components/Loading";
import DeliveryStatsChart from "../../../components/charts/DeliveryStatsChart";
import RiderEarningsChart from "../../../components/charts/RiderEarningsChart";

const RiderDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: riderDashboardSummary = {},
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["riderDashboardSummary", user?.email],
    queryFn: async () => {
      if (!user?.email) return {};
      const res = await axiosSecure.get(
        `/employee/dashboard-summary?email=${user?.email}`,
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
      <div className="text-red-500">Error loading dashboard: {error.message}</div>
    );
  }

  const {
    totalDeliveriesCompleted,
    totalDeliveriesPending,
    averageDeliveryTime,
    totalEarnings,
    monthlyEarnings,
    recentDeliveries,
  } = riderDashboardSummary;
  return (
    <div className="p-4">
      <h2 className="text-5xl font-bold mb-8 text-center">Rider Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold text-gray-700">
            Deliveries Completed
          </h3>
          <p className="text-4xl font-bold text-green-600">
            {totalDeliveriesCompleted}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold text-gray-700">Total Earnings</h3>
          <p className="text-4xl font-bold text-indigo-600">
            ${totalEarnings ? totalEarnings.toFixed(2) : "0.00"}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold text-gray-700">
            Deliveries Pending
          </h3>
          <p className="text-4xl font-bold text-yellow-600">
            {totalDeliveriesPending}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold text-gray-700">
            Avg. Delivery Time
          </h3>
          <p className="text-4xl font-bold text-blue-600">
            {averageDeliveryTime}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">
            Delivery Statistics
          </h3>
          {totalDeliveriesCompleted !== undefined &&
          totalDeliveriesPending !== undefined ? (
            <DeliveryStatsChart
              completed={totalDeliveriesCompleted}
              pending={totalDeliveriesPending}
            />
          ) : (
            <p className="text-gray-600">No delivery statistics available.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">
            Monthly Earnings
          </h3>
          {monthlyEarnings && monthlyEarnings.length > 0 ? (
            <RiderEarningsChart monthlyEarnings={monthlyEarnings} />
          ) : (
            <p className="text-gray-600">No monthly earnings data available.</p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">
          Recent Deliveries
        </h3>
        {recentDeliveries && recentDeliveries.length > 0 ? (
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
                {recentDeliveries.map((parcel) => (
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
          <p className="text-gray-600">No recent deliveries to display.</p>
        )}
      </div>
    </div>
  );
};

export default RiderDashboard;
