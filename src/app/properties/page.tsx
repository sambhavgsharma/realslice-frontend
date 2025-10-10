"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/sections/Header";
import PropertyModal, { PropertyDetailed } from "@/components/PropertyModal";
import { Filter, ArrowUpDown } from "lucide-react"; // icons
import Footer from "@/sections/Footer";

interface Property {
  id: number;
  name: string;
  area: string;
  type: string;
  currentPrice: string;
  projectedYield: string;
  minLotSize: string;
  image: string;
}

const propertiesData: Property[] = [
  {
    id: 1,
    name: "Sofitel Mumbai",
    area: "Bandra Kurla Complex",
    type: "Hotel",
    currentPrice: "2,344 ₹",
    projectedYield: "9.0%",
    minLotSize: "10,00,000 ₹",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Oceanfront Villa",
    area: "Goa",
    type: "Villa",
    currentPrice: "3,500 ₹",
    projectedYield: "8.5%",
    minLotSize: "15,00,000 ₹",
    image: "https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Tech Park Office",
    area: "Pune",
    type: "Commercial",
    currentPrice: "1,200 ₹",
    projectedYield: "10.2%",
    minLotSize: "5,00,000 ₹",
    image: "https://images.unsplash.com/photo-1600585153834-3b4e2a0f5b0f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "Luxury Apartment",
    area: "Andheri, Mumbai",
    type: "Apartment",
    currentPrice: "1,800 ₹",
    projectedYield: "8.0%",
    minLotSize: "7,50,000 ₹",
    image: "https://images.unsplash.com/photo-1599423300760-7b82dba8f8a8?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    name: "Hilltop Retreat",
    area: "Lonavala",
    type: "Villa",
    currentPrice: "4,200 ₹",
    projectedYield: "7.5%",
    minLotSize: "20,00,000 ₹",
    image: "https://images.unsplash.com/photo-1599423300750-6b41b6f2fa8c?auto=format&fit=crop&w=800&q=80",
  },
];

const PropertiesPage = () => {
  const [selectedProperty, setSelectedProperty] = useState<PropertyDetailed | null>(null);

  const getDetailedProperty = (p: Property): PropertyDetailed => ({
    id: p.id,
    name: p.name,
    address: p.area,
    images: [p.image],
    type: p.type,
    currentPrice: Number(p.currentPrice.replace(/[^\d]/g, "")),
    currency: "₹",
    projectedYield: Number(p.projectedYield.replace("%", "")),
    minLotSize: p.minLotSize,
    totalShares: 100,
    priceHistory: [
      { label: "Jan", value: 1800 },
      { label: "Feb", value: 2000 },
      { label: "Mar", value: 2200 },
      { label: "Apr", value: 2100 },
      { label: "May", value: 2300 },
      { label: "Jun", value: Number(p.currentPrice.replace(/[^\d]/g, "")) },
    ],
    liquidity: "High",
  });

  return (
    <>
      {/* Header */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>

      {/* Page content */}
      <section className="relative w-full min-h-screen bg-gradient-to-b from-[#050B18] via-[#0A1426] to-[#000314] text-white pt-28 pb-24">
        {/* Subtle radial glow behind heading */}
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] blur-3xl pointer-events-none"></div>

        {/* Title */}
        <div className="max-w-6xl mx-auto px-6 text-center mb-12">
          <h1 className="text-6xl font-bold tracking-tight mb-3 bg-gradient-to-r from-[#faab34] via-[#E6E6E6] to-[#ffc935] text-transparent bg-clip-text drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            Explore Real Estate Stocks
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl font-light tracking-wide max-w-2xl mx-auto">
            Discover high-yield investment properties and trade fractional ownership shares in real estate.
          </p>
        </div>

        {/* Filter & Sort */}
        <div className="max-w-6xl mx-auto px-6 flex justify-end gap-4 mb-10">
          <button className="flex items-center gap-2 py-2.5 px-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition">
            <Filter size={18} />
            <span className="text-sm font-medium text-gray-300">Filter</span>
          </button>
          <button className="flex items-center gap-2 py-2.5 px-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition">
            <ArrowUpDown size={18} />
            <span className="text-sm font-medium text-gray-300">Sort</span>
          </button>
        </div>

        {/* Cards */}
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {propertiesData.map((property) => (
            <motion.div
              key={property.id}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(255,255,255,0.05)] cursor-pointer hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(255,255,255,0.1)] transition-all duration-300"
              whileHover={{ y: -5 }}
              onClick={() => setSelectedProperty(getDetailedProperty(property))}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              </div>

              <div className="p-6 flex flex-col gap-2">
                <h2 className="text-2xl font-semibold text-white/90 tracking-tight">{property.name}</h2>
                <p className="text-gray-400 text-sm font-light">{property.area}</p>
                <p className="text-gray-400 text-sm">Type: <span className="text-white/80">{property.type}</span></p>

                <div className="flex justify-between text-gray-300 mt-3 text-sm">
                  <span className="font-medium">Price: <span className="text-white/90">{property.currentPrice}</span></span>
                  <span className="font-medium">Yield: <span className="text-green-400">{property.projectedYield}</span></span>
                </div>

                <p className="text-gray-400 text-sm mt-2">Min Lot: <span className="text-white/80">{property.minLotSize}</span></p>

                <div className="mt-5 flex gap-3">
                  <button className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#5eff00] to-[#C0C0C0] text-black font-medium hover:opacity-90 transition-all">
                    Buy
                  </button>
                  <button className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#ff3b3b] to-[#ff8080] text-white font-medium hover:opacity-90 transition-all">
                    Sell
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Property Modal */}
      {selectedProperty && (
        <PropertyModal
          open={!!selectedProperty}
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
      <Footer />
    </>
  );
};

export default PropertiesPage;
