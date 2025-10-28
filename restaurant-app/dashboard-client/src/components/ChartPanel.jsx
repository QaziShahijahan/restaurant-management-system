// dashboard-client/src/components/ChartPanel.jsx
import React from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

/**
 * ChartPanel
 * Props:
 *  - type: "line" | "pie"
 *  - data: chart.js data object
 *  - options: chart.js options (optional)
 *
 * This component simply renders a card-styled container around the chart to match dashboard visuals.
 */
export default function ChartPanel({ type = "line", data, options = {} }) {
  const defaultLineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        cornerRadius: 6,
        backgroundColor: "#111827",
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#475569" }
      },
      y: {
        grid: { color: "rgba(15,23,42,0.04)" },
        ticks: { color: "#475569", stepSize: 100 }
      }
    },
    ...options
  };

  const defaultPieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right"
      },
      tooltip: {
        cornerRadius: 6
      }
    },
    ...options
  };

  return (
    <div className="chart-panel" style={{ height: 260 }}>
      {type === "line" && <Line data={data} options={defaultLineOptions} />}
      {type === "pie" && <Pie data={data} options={defaultPieOptions} />}
    </div>
  );
}
