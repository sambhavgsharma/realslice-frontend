"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Hero() {
  useEffect(() => {
    // register font (Next.js serves it directly from /public)
    const style = document.createElement("style");
    style.innerHTML = `
      @font-face {
        font-family: "SFRegular";
        src: url("/assets/fonts/sfregular.otf") format("opentype");
        font-weight: 400;
        font-style: normal;
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black text-white">
      {/* --- Background Video --- */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0 overflow-hidden"
      >
        <video
          src="/assets/video.mp4"
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
      </motion.div>

      {/* --- Text Content --- */}
      <div className="relative z-10 text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
          className="font-bold text-shadow leading-tight tracking-tight text-6xl sm:text-7xl md:text-8xl lg:text-9xl"
          style={{
            fontFamily:
              '"SFRegular", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          }}
        >
          <ShimmerText>Real Estate Reimagined</ShimmerText>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto"
        >
          Invest in premium properties with ease, transparency, and innovation.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <a href="/properties" className="rounded-full px-8 py-3 shadow-lg glass">
            <Button className="rounded-full px-8 py-3 shadow-lg glass">
              Explore Properties
            </Button>
          </a>
          <Button className="rounded-full px-8 py-3 shadow-lg glass">
            List Your Property
          </Button>
        </motion.div>

        <motion.div
          className="mt-12 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
        >
          <ScrollIndicator />
        </motion.div>
      </div>
    </section>
  );
}

/* --- ShimmerText Animation --- */
function ShimmerText({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block text-white">
      {children}
      <motion.span
        className="absolute inset-0 bg-clip-text text-transparent"
        style={{
          backgroundImage: "linear-gradient(120deg, #FF66CC, #66CCFF, #FF66CC)",
          WebkitBackgroundClip: "text",
          backgroundSize: "200% 200%",
          filter: "blur(1px)",
          mixBlendMode: "screen",
        }}
        animate={{ backgroundPositionX: ["0%", "200%"] }}
        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
      />
      <motion.span
        className="absolute inset-0 text-transparent"
        style={{
          background:
            "radial-gradient(circle, rgba(255,102,204,0.3) 0%, rgba(102,204,255,0.2) 60%, transparent 100%)",
          filter: "blur(50px)",
          mixBlendMode: "screen",
        }}
        animate={{ opacity: [0.7, 0.5, 0.7] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      />
    </span>
  );
}

/* --- Scroll Indicator --- */
function ScrollIndicator() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-8 h-12 rounded-[10px] border border-white/10 flex items-start justify-center p-1">
        <motion.span
          className="w-2 h-2 rounded-full bg-white/80"
          layout
          initial={{ y: 0 }}
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <span className="text-xs text-gray-400">Scroll</span>
    </div>
  );
}

export function MediaSpot() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <video
        src="/assets/video.mp4"
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
    </div>
  );
}
