import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface DeliveryStatsChartProps {
  completed: number;
  pending: number;
}

const DeliveryStatsChart: React.FC<DeliveryStatsChartProps> = ({
  completed,
  pending,
}) => {
  const data = {
    labels: ["Completed Deliveries", "Pending Deliveries"],
    datasets: [
      {
        label: "Number of Deliveries",
        data: [completed, pending],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 159, 64, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Delivery Statistics",
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
    <div style={{ maxWidth: "500px", margin: "auto" }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default DeliveryStatsChart;
