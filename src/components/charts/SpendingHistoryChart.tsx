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

export interface SpendingHistoryItem {
  month: string;
  amount: number;
}

interface SpendingHistoryChartProps {
  spendingHistory: SpendingHistoryItem[];
}

const SpendingHistoryChart: React.FC<SpendingHistoryChartProps> = ({
  spendingHistory,
}) => {
  const labels = spendingHistory.map((item) => item.month);
  const dataValues = spendingHistory.map((item) => item.amount);

  const data = {
    labels,
    datasets: [
      {
        label: "Spending Amount",
        data: dataValues,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
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
        text: "Monthly Spending History",
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
      <Bar data={data} options={options} />
    </div>
  );
};

export default SpendingHistoryChart;
