import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  DoughnutController,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  PlusCircle,
  PackageOpen,
  BarChart,
  FileText,
  Settings,
} from "lucide-react";

// Register required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  DoughnutController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

import data4 from "../Farmer_data_pavan/data4.js";
import data1 from "../Farmer_data_pavan/data1.js";
import data2 from "../Farmer_data_pavan/data2.js";
import data3 from "../Farmer_data_pavan/data3.js";

const AnalyticsSection = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-2 gap-8">
        {/* Revenue and Cost Analysis */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h5 className="mb-4 text-2xl font-extrabold text-green-900 text-center">
            Revenue and Cost Analysis
          </h5>
          <div className="w-full max-w-lg mx-auto">
            <Line
              data={{
                labels: data4.map((data) => data.label),
                datasets: [
                  {
                    label: "Revenue",
                    data: data4.map((data) => data.revenue),
                    backgroundColor: "rgb(63, 113, 212)",
                    borderColor: "rgb(63, 113, 212)",
                  },
                  {
                    label: "Cost",
                    data: data4.map((data) => data.cost),
                    backgroundColor: "rgb(219, 80, 53)",
                    borderColor: "rgb(219, 80, 53)",
                  },
                ],
              }}
            />
          </div>
        </div>

        {/* Total Sales of This Week */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h5 className="mb-4 text-2xl font-extrabold text-blue-900 text-center">
            Total Sales of This Week
          </h5>
          <div className="w-full max-w-lg mx-auto">
            <Bar
              data={{
                labels: data1.map((data) => data.product),
                datasets: [
                  {
                    label: "Total sales in thousands",
                    data: data1.map((data) => data.totalSales),
                    backgroundColor: "rgb(63, 200, 235)",
                    borderRadius: 5,
                  },
                ],
              }}
            />
          </div>
        </div>

        {/* Total Sales by District */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h5 className="mb-4 text-2xl font-extrabold text-indigo-900 text-center">
            Total Sales by District
          </h5>
          <div className="w-full max-w-lg mx-auto">
            <Bar
              data={{
                labels: data2.map((data) => data.district),
                datasets: [
                  {
                    label: "Total sales in thousands",
                    data: data2.map((data) => data.totalSales),
                    backgroundColor: "rgb(63, 200, 235)",
                    borderRadius: 5,
                  },
                ],
              }}
            />
          </div>
        </div>

        {/* Vegetables vs Fruits */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h5 className="mb-4 text-2xl font-extrabold text-emerald-900 text-center">
            Vegetables vs Fruits
          </h5>
          <div className="w-full max-w-xs mx-auto">
            <Doughnut
              data={{
                labels: data3.map((data) => data.type),
                datasets: [
                  {
                    label: "Vegetables vs Fruits",
                    data: data3.map((data) => data.totalSales),
                    backgroundColor: ["rgb(144, 244, 57)", "rgb(163, 248, 188)"],
                    borderRadius: 5,
                  },
                ],
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;