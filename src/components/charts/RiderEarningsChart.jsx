import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const RiderEarningsChart = ({ monthlyEarnings }) => {
  const labels = monthlyEarnings.map((item) => item.month);
  const dataValues = monthlyEarnings.map((item) => item.amount);

  const data = {
    labels,
    datasets: [
      {
        label: "Monthly Earnings",
        data: dataValues,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
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
        text: "Rider Monthly Earnings",
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default RiderEarningsChart;
