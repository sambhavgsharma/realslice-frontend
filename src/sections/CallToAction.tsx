"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FaBuilding, FaChartLine } from "react-icons/fa";

export const CallToAction = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setEmail("");
    }
  };

  return (
    <section className="relative w-full py-24 overflow-hidden bg-gray-900 text-white">
      {/* Parallax floating gradient blobs */}
      <motion.div
        className="absolute top-[-80px] left-[-60px] w-96 h-96 bg-gradient-to-tr from-purple-500/40 via-pink-500/30 to-blue-500/20 rounded-full filter blur-3xl pointer-events-none"
        animate={{ x: [0, 60, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-80px] right-[-60px] w-80 h-80 bg-gradient-to-tr from-yellow-400/20 via-red-400/20 to-purple-500/10 rounded-full filter blur-3xl pointer-events-none"
        animate={{ x: [0, -40, 0], y: [0, -25, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating decorative icons */}
      <motion.div
        className="absolute top-10 right-20 text-white/10 text-7xl pointer-events-none"
        animate={{ y: [0, 15, 0], rotate: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
      >
        <FaBuilding />
      </motion.div>
      <motion.div
        className="absolute bottom-32 left-10 text-white/10 text-6xl pointer-events-none"
        animate={{ y: [0, -15, 0], rotate: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
      >
        <FaChartLine />
      </motion.div>

      <div className="relative max-w-3xl mx-auto px-6 z-10 text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-silver to-gold">
            Let’s Talk Real Estate
          </span>
        </h2>
        <p className="text-gray-300 mb-12 text-lg sm:text-xl">
          Have a question or want to list your property? Drop your email below and we’ll get back to you.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
        >
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full sm:w-2/3 px-6 py-4 rounded-2xl bg-gray-800 border border-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-gradient-to-r focus:ring-gold/70 transition"
          />
        <Button
          type="submit"
          className="relative rounded-2xl px-10 py-4 font-bold text-white bg-transparent border-2 border-gradient-to-r from-gold via-silver to-gold hover:scale-[1.03] transition-transform overflow-hidden"
        >
          <span className="relative z-10">{submitted ? "Sent!" : "Send"}</span>
          {/* subtle hover shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-gold/20 via-white/10 to-gold/20 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
        </Button>

        </form>

        <motion.div
          className="mt-12 text-gray-400 text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          We respect your privacy. No spam, promise.
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
