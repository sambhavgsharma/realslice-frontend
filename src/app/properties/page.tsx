"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Header from "@/sections/Header";
import Footer from "@/sections/Footer";
import { useProperties } from "@/hooks/useApi";

const PropertiesPage = () => {
  const router = useRouter();
  const { properties, loading, fetchAll } = useProperties();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (!token) {
      router.push('/login');
      return;
    }
    fetchAll();
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-[#050B18] via-[#071127] to-[#000314] text-white px-6 py-24 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="mb-6">
            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[#f7d36e] via-[#06b6d4] to-[#4f46e5] bg-clip-text text-transparent mb-3">Real Estate Market</h1>
            <div className="h-1 w-32 bg-gradient-to-r from-[#f7d36e] to-[#06b6d4] rounded-full"></div>
          </div>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl">Browse and invest in fractionalized real estate properties. Own a piece of premium real estate with just a few clicks.</p>

          <button
            onClick={() => router.push('/list-property')}
            className="px-8 py-3 rounded-xl font-bold text-lg bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white shadow-lg hover:shadow-xl hover:opacity-90 transition transform hover:scale-105"
          >
            ➕ List New Property
          </button>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24"
          >
            <div className="w-16 h-16 border-4 border-[#f7d36e]/30 border-t-[#f7d36e] rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400">Loading properties...</p>
          </motion.div>
        ) : properties.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 text-center"
          >
            <div className="text-6xl mb-4">🏠</div>
            <p className="text-gray-300 mb-6 text-lg font-semibold">No properties available yet</p>
            <p className="text-gray-400 mb-8">Be the first to list a premium property on RealSlice!</p>
            <button
              onClick={() => router.push('/list-property')}
              className="px-8 py-3 bg-gradient-to-r from-[#4f46e5] to-[#06b6d4] rounded-xl font-semibold hover:opacity-90 transition transform hover:scale-105"
            >
              Create First Property
            </button>
          </motion.div>
        ) : (
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="show"
            variants={{
              show: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
          >
            {properties.map((property: any) => (
              <motion.div
                key={property._id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden hover:bg-white/20 hover:border-white/40 transition duration-300 cursor-pointer shadow-lg hover:shadow-2xl transform hover:scale-105"
                onClick={() => router.push(`/properties/${property.propertyId}`)}
              >
                {/* Property Hero Image */}
                <div className="relative h-48 bg-gradient-to-br from-[#4f46e5] to-[#06b6d4] overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition duration-300">
                    <div className="text-center">
                      <p className="text-white/70 text-sm font-medium">Property ID</p>
                      <p className="text-white text-2xl font-bold">{property.propertyId}</p>
                    </div>
                  </div>
                </div>

                {/* Property Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1 group-hover:text-[#f7d36e] transition">{property.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 flex items-center gap-1">
                    📍 {property.location}
                  </p>

                  {property.description && (
                    <p className="text-gray-300 text-sm mb-5 line-clamp-2 group-hover:text-gray-200 transition">
                      {property.description}
                    </p>
                  )}

                  {/* Property Details */}
                  <div className="space-y-3 mb-6 text-sm border-t border-white/10 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Current Price</span>
                      <span className="font-bold text-[#f7d36e]">₹ {property.currentPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Shares</span>
                      <span className="font-bold text-[#06b6d4]">{property.totalShares}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Available</span>
                      <span className="font-bold text-green-400">{property.availableShares}</span>
                    </div>
                  </div>

                  {property.blockchainId && (
                    <div className="text-xs text-gray-500 mb-4 p-3 bg-white/5 rounded-lg border border-white/10 flex items-center gap-2">
                      <span>⛓️</span>
                      <span>On-chain: {property.blockchainId}</span>
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/properties/${property.propertyId}`);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-[#4f46e5] to-[#06b6d4] rounded-xl font-bold hover:opacity-90 transition transform hover:scale-105"
                  >
                    View Details →
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default PropertiesPage;
