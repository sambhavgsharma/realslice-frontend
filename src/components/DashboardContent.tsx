"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import Header from "@/sections/Header";
import Footer from "@/sections/Footer";
import { useAccount } from "wagmi";
import { useAuth } from "@/hooks/useApi";
import dynamic from "next/dynamic";

const ConnectButton = dynamic(
  () => import("@rainbow-me/rainbowkit").then((mod) => ({ default: mod.ConnectButton })),
  { ssr: false }
);

// Type definitions
type Holding = {
  propertyDetails: {
    propertyId: string;
    name: string;
    location: string;
    currentPrice: number;
  };
  sharesOwned: number;
  totalValue: number;
};

type User = {
  id: string;
  name: string;
  email: string;
  wallet: number;
  walletAddress?: string;
  holdings: Holding[];
};

// Animation variant for framer-motion
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

export default function DashboardContent() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // Use wagmi hooks only after mounting
  const wagmiAccount = useAccount();
  const { user, loading, error, getProfile, linkWallet } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [linking, setLinking] = useState(false);

  // Fetch user profile on mount
  useEffect(() => {
    setIsMounted(true);
    
    // Update local state from wagmi after mount
    if (wagmiAccount.address) {
      setAddress(wagmiAccount.address);
      setIsConnected(wagmiAccount.isConnected);
    }
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (!token) {
      router.push('/login');
      return;
    }
    fetchUserData();
  }, [wagmiAccount.address, wagmiAccount.isConnected]);

  const fetchUserData = async () => {
    const profile = await getProfile();
    if (profile && (profile as any).user) {
      setUserData((profile as any).user);
    }
  };

  const handleLinkWallet = async () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet first');
      return;
    }

    setLinking(true);
    const result = await linkWallet(address);
    setLinking(false);

    if (result) {
      alert('Wallet linked successfully!');
      await fetchUserData();
    }
  };

  if (!isMounted || (loading && !userData)) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#000314] text-white flex items-center justify-center">
          <p>Loading...</p>
        </main>
      </>
    );
  }

  if (!userData) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#000314] text-white flex items-center justify-center">
          <p>Failed to load user data</p>
        </main>
      </>
    );
  }

  // Prepare data for charts
  const totalValue = userData.holdings.reduce(
    (sum: number, h: Holding) => sum + h.totalValue,
    0
  );
  const totalWalletValue = userData.wallet + totalValue;
  
  const labels = userData.holdings.length > 0 
    ? userData.holdings.map((h: Holding) => h.propertyDetails.name.substring(0, 20))
    : ['No Holdings'];
  const values = userData.holdings.length > 0
    ? userData.holdings.map((h: Holding) => h.totalValue)
    : [0];

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
        label: "Holdings (₹)",
        data: values,
        fill: false,
        borderColor: "#60a5fa",
        tension: 0.3,
      },
    ],
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-[#050B18] via-[#071127] to-[#000314] text-white px-6 py-24 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="mb-12">
          <div className="mb-6">
            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[#f7d36e] via-[#06b6d4] to-[#4f46e5] bg-clip-text text-transparent mb-2">Dashboard</h1>
            <div className="h-1 w-32 bg-gradient-to-r from-[#f7d36e] to-[#06b6d4] rounded-full mb-6"></div>
            <p className="text-xl text-gray-300">
              Welcome back, <span className="text-[#f7d36e] font-bold">{userData.name}</span>! 👋
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <ConnectButton />
            {isConnected && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLinkWallet}
                disabled={linking || userData.walletAddress === address}
                className="px-6 py-2 bg-gradient-to-r from-[#4f46e5] via-[#7c3aed] to-[#06b6d4] rounded-xl font-bold text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition transform"
              >
                {linking ? '⏳ Linking...' : userData.walletAddress ? '✅ Wallet Linked' : '🔗 Link Wallet'}
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Portfolio Summary */}
        <motion.div
          className="grid md:grid-cols-4 gap-6 mb-16"
          initial="hidden"
          animate="show"
          variants={fadeUp}
        >
          {[
            { icon: '💰', label: 'Wallet Balance', value: userData.wallet.toLocaleString(), color: 'from-blue-500/20 to-blue-600/20' },
            { icon: '📈', label: 'Holdings Value', value: totalValue.toLocaleString(), color: 'from-emerald-500/20 to-emerald-600/20' },
            { icon: '🏆', label: 'Total Assets', value: totalWalletValue.toLocaleString(), color: 'from-purple-500/20 to-purple-600/20' },
            { icon: '🏠', label: 'Active Properties', value: userData.holdings.length.toString(), color: 'from-orange-500/20 to-orange-600/20' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { delay: idx * 0.1 } },
              }}
              className={`bg-gradient-to-br ${item.color} backdrop-blur-xl border border-white/20 p-7 rounded-2xl shadow-lg hover:shadow-xl transition`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-2">{item.label}</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">₹ {item.value}</p>
                </div>
                <span className="text-4xl opacity-60">{item.icon}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Section */}
        {userData.holdings.length > 0 && (
          <motion.div
            className="grid md:grid-cols-2 gap-8 mb-16"
            initial="hidden"
            animate="show"
            variants={fadeUp}
          >
            <motion.div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span>📊</span> Holdings Value
              </h2>
              <Bar data={barData} options={{ responsive: true, plugins: { legend: { labels: { color: "#fff" } } }, scales: { x: { ticks: { color: "#fff" } }, y: { ticks: { color: "#fff" } } } }} />
            </motion.div>
            <motion.div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span>📉</span> Holdings Distribution
              </h2>
              <Line data={lineData} options={{ responsive: true, plugins: { legend: { labels: { color: "#fff" } } }, scales: { x: { ticks: { color: "#fff" } }, y: { ticks: { color: "#fff" } } } }} />
            </motion.div>
          </motion.div>
        )}

        {/* Holdings Table */}
        {userData.holdings.length > 0 && (
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="p-8 border-b border-white/20">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span>💼</span> Your Holdings
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-gray-300">
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 font-semibold text-sm">Property</th>
                    <th className="px-6 py-4 font-semibold text-sm">Location</th>
                    <th className="px-6 py-4 font-semibold text-sm">Shares</th>
                    <th className="px-6 py-4 font-semibold text-sm">Price / Share</th>
                    <th className="px-6 py-4 font-semibold text-sm">Total Value</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.holdings.map((h: Holding, i: number) => (
                    <tr key={i} className="border-b border-white/10 hover:bg-white/10 transition">
                      <td className="px-6 py-4 font-semibold text-white">{h.propertyDetails.name}</td>
                      <td className="px-6 py-4 text-gray-300">{h.propertyDetails.location}</td>
                      <td className="px-6 py-4 text-gray-300"><span className="bg-blue-500/20 px-3 py-1 rounded-full">{h.sharesOwned}</span></td>
                      <td className="px-6 py-4 text-gray-300">₹ {h.propertyDetails.currentPrice.toLocaleString()}</td>
                      <td className="px-6 py-4 font-bold text-[#f7d36e]">₹ {h.totalValue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {userData.holdings.length === 0 && (
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg p-16 text-center"
          >
            <div className="text-6xl mb-4">🏘️</div>
            <h3 className="text-2xl font-bold mb-3">No Holdings Yet</h3>
            <p className="text-gray-400 mb-8 text-lg">Start building your real estate portfolio today. Explore our properties and own a piece of premium real estate.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/properties')}
              className="px-8 py-3 bg-gradient-to-r from-[#4f46e5] to-[#06b6d4] rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition transform"
            >
              🔍 Explore Properties
            </motion.button>
          </motion.div>
        )}
      </main>
      <Footer />
    </>
  );
}
