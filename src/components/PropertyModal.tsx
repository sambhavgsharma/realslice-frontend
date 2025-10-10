"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import { IconX, IconMapPin, IconCurrencyRupee, IconChartLine } from "@tabler/icons-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale
);

/**
 * Props: provide a property object with fields described below
 */
export interface PropertyDetailed {
  id: number | string;
  name: string;
  address: string;
  mapLink?: string; // google maps link
  images: string[]; // gallery images (first will be hero)
  type?: string;
  currentPrice: number; // numeric price (in INR or chosen unit)
  currency?: string; // e.g. "₹" or "INR" or "$"
  projectedYield?: number; // percent, e.g. 9.0
  minLotSize?: string; // display string, e.g. "10,00,000 ₹"
  totalShares?: number;
  // price history: array of { label: string (date), value: number }
  priceHistory?: { label: string; value: number }[];
  // additional metrics optionally
  liquidity?: string;
  volatility?: number; // e.g. std dev %
}

type Props = {
  open: boolean;
  property: PropertyDetailed;
  onClose: () => void;
};

export default function PropertyModal({ open, property, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    // prevent body scroll while modal open
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = original;
    };
  }, [open, onClose]);

  if (!open) return null;

  const history = property.priceHistory ?? [
    // fallback sample data (monthly)
    { label: "Jan", value: property.currentPrice * 0.86 },
    { label: "Feb", value: property.currentPrice * 0.9 },
    { label: "Mar", value: property.currentPrice * 0.95 },
    { label: "Apr", value: property.currentPrice * 1.02 },
    { label: "May", value: property.currentPrice * 1.05 },
    { label: "Jun", value: property.currentPrice },
  ];

  // chart data and options (dark, sleek)
  const data: ChartData<"line"> = {
    labels: history.map((h) => h.label),
    datasets: [
      {
        label: "Price",
        data: history.map((h) => h.value),
        tension: 0.35,
        borderWidth: 2.5,
        pointRadius: 3,
        pointHoverRadius: 6,
        fill: false,
        borderColor: (ctx: any) => {
          // fallback to static color for SSR safety
          return "#7C3AED"; // violet-ish
        },
        backgroundColor: "rgba(124,58,237,0.1)",
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        titleColor: "#fff",
        bodyColor: "#fff",
        backgroundColor: "#0b1220",
        borderColor: "rgba(255,255,255,0.06)",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#9CA3AF" },
      },
      y: {
        grid: { color: "rgba(255,255,255,0.04)" },
        ticks: { color: "#9CA3AF" },
      },
    },
    animation: { duration: 700, easing: "easeOutQuart" },
  };

  // compute some derived metrics (simple examples)
  const computeVolatility = () => {
    // simple std dev percent of priceHistory values
    const vals = history.map((h) => h.value);
    if (vals.length < 2) return property.volatility ?? 0;
    const mean = vals.reduce((s, v) => s + v, 0) / vals.length;
    const variance = vals.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / vals.length;
    const sd = Math.sqrt(variance);
    return +( (sd / mean) * 100 ).toFixed(2); // percent
  };

  const volatility = property.volatility ?? computeVolatility();
  const liquidity = property.liquidity ?? "Moderate";

  // click outside to close
  const onOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <motion.div
      ref={overlayRef}
      onClick={onOverlayClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* dim + blur backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* modal card */}
      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.32, ease: "easeOut" }}
        className="relative z-20 w-[95%] md:w-[90%] lg:w-[80%] xl:w-[70%] max-h-[90vh] overflow-hidden rounded-3xl"
        role="dialog"
        aria-modal="true"
      >
        {/* glass panel */}
        <div className="flex flex-col lg:flex-row bg-gradient-to-br from-white/4 to-white/2 bg-opacity-5 backdrop-blur-[12px] border border-white/6 rounded-3xl overflow-hidden h-full">
          {/* Left: gallery (top) + basic info */}
          <div className="w-full lg:w-1/2 p-6 flex flex-col gap-4 overflow-auto">
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={property.images?.[0] ?? ""}
                alt={property.name}
                className="w-full h-64 object-cover rounded-xl"
              />
              {/* small gallery thumbnails */}
              <div className="absolute bottom-4 left-4 right-4 flex gap-3">
                {property.images?.slice(0, 4).map((src, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      // swap hero image with clicked thumbnail (simple DOM approach)
                      const parent = (e.target as HTMLButtonElement).closest(".property-modal-hero");
                      // we won't implement full state here — a full gallery will use state.
                    }}
                    className="w-16 h-10 rounded-md overflow-hidden border border-white/8"
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img src={src} className="w-full h-full object-cover" alt={`thumb-${idx}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-2">
              <h3 className="text-2xl font-semibold text-white">{property.name}</h3>
              <div className="flex items-center gap-3 mt-2">
                <IconMapPin className="h-5 w-5 text-gray-300" />
                <a
                  href={property.mapLink ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-300 hover:text-white transition"
                >
                  {property.address}
                </a>
              </div>
            </div>

            {/* small description / meta */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-black/40 border border-white/6">
                <div className="text-xs text-gray-400">Type</div>
                <div className="text-white font-semibold">{property.type ?? "—"}</div>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-white/6">
                <div className="text-xs text-gray-400">Min Lot</div>
                <div className="text-white font-semibold">{property.minLotSize ?? "—"}</div>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-white/6">
                <div className="text-xs text-gray-400">Projected Yield</div>
                <div className="text-white font-semibold">{property.projectedYield ?? "—"}%</div>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-white/6">
                <div className="text-xs text-gray-400">Total Shares</div>
                <div className="text-white font-semibold">{property.totalShares ?? "—"}</div>
              </div>
            </div>
          </div>

          {/* Right: market/stock info + chart */}
          <div className="w-full lg:w-1/2 p-6 flex flex-col gap-4 overflow-auto">
            {/* Close button top-right */}
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="p-2 rounded-md text-gray-300 hover:text-white bg-black/20 hover:bg-black/30 transition"
                aria-label="Close modal"
              >
                <IconX className="w-5 h-5" />
              </button>
            </div>

            {/* Price block */}
            <div className="rounded-xl bg-black/30 border border-white/6 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-gray-400">Current Price</div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-2xl font-bold text-white">
                      {property.currency ?? "₹"}
                      {Number(property.currentPrice).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400"> / lot</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-400">Projected Yield</div>
                  <div className="text-lg font-semibold text-white">{property.projectedYield ?? "—"}%</div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-black/40 border border-white/6 text-center">
                  <div className="text-xs text-gray-400">Volatility</div>
                  <div className="text-white font-semibold">{volatility}%</div>
                </div>
                <div className="p-3 rounded-lg bg-black/40 border border-white/6 text-center">
                  <div className="text-xs text-gray-400">Liquidity</div>
                  <div className="text-white font-semibold">{liquidity}</div>
                </div>
                <div className="p-3 rounded-lg bg-black/40 border border-white/6 text-center">
                  <div className="text-xs text-gray-400">Min Lot</div>
                  <div className="text-white font-semibold">{property.minLotSize ?? "—"}</div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="flex-1 rounded-xl bg-black/20 border border-white/6 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <IconChartLine className="w-5 h-5 text-gray-300" />
                  <div className="text-sm text-gray-400">Price history</div>
                </div>
                <div className="text-xs text-gray-400">Last 6 points</div>
              </div>

              <div className="w-full h-56">
                <Line data={data} options={options} />
              </div>
            </div>

            {/* Action row: Buy/Sell */}
            <div className="mt-3 flex gap-3">
              <button className="flex-1 py-3 rounded-2xl border border-white/8 text-white bg-gradient-to-r from-white/3 to-white/5 hover:scale-[1.02] transition">
                Buy
              </button>
              <button className="flex-1 py-3 rounded-2xl border border-red-600 text-white bg-transparent hover:scale-[1.02] transition">
                Sell
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
