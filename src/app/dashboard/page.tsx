"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Header from "@/sections/Header";
import { useAccount } from "wagmi";

// Type definitions
type Holding = {
  property: string;
  shares: number;
  pricePerShare: number;
};

type PortfolioData = {
  holdings: Holding[];
};

// Animation variant for framer-motion
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const DashboardPage = () => {
  const [portfolio] = useState<PortfolioData>({
    holdings: [
      { property: "Oceanview Apartments", shares: 10, pricePerShare: 50000 },
      { property: "Downtown Loft", shares: 5, pricePerShare: 75000 },
      { property: "Greenfield Villas", shares: 2, pricePerShare: 150000 },
    ],
  });

  const { address, isConnected } = useAccount();

  // Prepare data for charts
  const totalValue = portfolio.holdings.reduce(
    (sum: number, h: Holding) => sum + h.shares * h.pricePerShare,
    0
  );
  const labels = portfolio.holdings.map((h: Holding) => h.property);
  const values = portfolio.holdings.map((h: Holding) => h.shares * h.pricePerShare);

  const barData = {
    labels,
    datasets: [
      {
        label: "Property Value",
        data: values,
        backgroundColor: "rgba(247, 211, 110, 0.8)",
        borderRadius: 6,
      },
    ],
  };

  const lineData = {
    labels,
    datasets: [
      {
        label: "P&L (₹)",
        data: values.map((v: number) => v * (0.05 + Math.random() * 0.1)),
        fill: false,
        borderColor: "#60a5fa",
        tension: 0.3,
      },
    ],
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#000314] text-white px-6 py-24 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial="hidden" animate="show" variants={fadeUp}>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2">Dashboard</h1>
          {isConnected ? (
            <p className="text-gray-400 mb-8">
              Welcome, <span className="text-[#f7d36e]">{address}</span>
            </p>
          ) : (
            <ConnectButton />
          )}
        </motion.div>

        {/* Portfolio Summary */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-16"
          initial="hidden"
          animate="show"
          variants={fadeUp}
        >
          <motion.div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl flex flex-col items-center justify-center shadow-lg">
            <p className="text-gray-400">Total Holdings</p>
            <p className="text-2xl md:text-3xl font-bold mt-2">{portfolio.holdings.length}</p>
          </motion.div>
          <motion.div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl flex flex-col items-center justify-center shadow-lg">
            <p className="text-gray-400">Total Value</p>
            <p className="text-2xl md:text-3xl font-bold mt-2">₹ {totalValue.toLocaleString()}</p>
          </motion.div>
          <motion.div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl flex flex-col items-center justify-center shadow-lg">
            <p className="text-gray-400">Estimated P&L</p>
            <p className="text-2xl md:text-3xl font-bold mt-2">₹ {Math.round(totalValue * 0.12).toLocaleString()}</p>
          </motion.div>
        </motion.div>

        {/* Charts */}
        <motion.div
          className="grid md:grid-cols-2 gap-8 mb-16"
          initial="hidden"
          animate="show"
          variants={fadeUp}
        >
          <motion.div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Holdings Value</h2>
            <Bar data={barData} options={{ responsive: true, plugins: { legend: { labels: { color: "#fff" } } }, scales: { x: { ticks: { color: "#fff" } }, y: { ticks: { color: "#fff" } } } }} />
          </motion.div>
          <motion.div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">P&L Growth</h2>
            <Line data={lineData} options={{ responsive: true, plugins: { legend: { labels: { color: "#fff" } } }, scales: { x: { ticks: { color: "#fff" } }, y: { ticks: { color: "#fff" } } } }} />
          </motion.div>
        </motion.div>

        {/* Holdings Table */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg overflow-x-auto"
        >
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-white/5 text-gray-300">
              <tr>
                <th className="px-6 py-3">Property</th>
                <th className="px-6 py-3">Shares</th>
                <th className="px-6 py-3">Price / Share</th>
                <th className="px-6 py-3">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.holdings.map((h: Holding, i: number) => (
                <tr key={i} className="border-t border-white/10 hover:bg-white/5 transition">
                  <td className="px-6 py-4">{h.property}</td>
                  <td className="px-6 py-4">{h.shares}</td>
                  <td className="px-6 py-4">₹ {h.pricePerShare.toLocaleString()}</td>
                  <td className="px-6 py-4">₹ {(h.shares * h.pricePerShare).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </main>
    </>
  );
};

export default DashboardPage;
