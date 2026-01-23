import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ParcelStatusChart = ({ parcelStatusCounts }) => {
  const data = {
    labels: Object.keys(parcelStatusCounts),
    datasets: [
      {
        data: Object.values(parcelStatusCounts),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4CAF50",
          "#FF9800",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4CAF50",
          "#FF9800",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Parcel Status Distribution",
      },
    },
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <Pie data={data} options={options} />
    </div>
  );
};

export default ParcelStatusChart;
