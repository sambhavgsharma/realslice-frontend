"use client";

import React from "react";
import { motion } from "framer-motion";
import Header from "@/sections/Header";
import Footer from "@/sections/Footer";
import { FaEthereum, FaGavel } from "react-icons/fa";
import { GiToken } from "react-icons/gi";
import { MdOutlineRealEstateAgent } from "react-icons/md";

const AboutPage = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.7, ease: "easeOut" },
    }),
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>

      {/* Main Section */}
      <main className="relative text-white min-h-screen overflow-hidden bg-[#000314]">
        {/* Dynamic gradient orbs background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            animate={{
              x: ["0%", "100%", "0%"],
              y: ["0%", "50%", "0%"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#003cff] via-[#00f6ff] to-transparent blur-[200px] opacity-30"
          />
          <motion.div
            animate={{
              x: ["100%", "0%", "100%"],
              y: ["50%", "0%", "50%"],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-0 right-0 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-[#ffd700] via-[#ff6600] to-transparent blur-[250px] opacity-25"
          />
        </div>

        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 text-center py-32 relative">
          <motion.h1
            initial="hidden"
            whileInView="show"
            variants={fadeUp}
            className="text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#ffffff] to-[#f7d36e] mb-8 drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]"
          >
            What is RealSlice?
          </motion.h1>

          <motion.p
            custom={1}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            className="text-xl sm:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-light tracking-wide"
          >
            RealSlice reimagines property ownership — by merging blockchain and real estate into one seamless investment ecosystem.
            <br />
            Fractional ownership. Instant liquidity. True transparency.
          </motion.p>
        </section>

        {/* How It Works */}
        <section className="max-w-6xl mx-auto px-6 py-24">
          <motion.h2
            initial="hidden"
            whileInView="show"
            variants={fadeUp}
            className="text-5xl font-semibold mb-20 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#f7d36e] to-[#ffffff]"
          >
            How It Works
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <MdOutlineRealEstateAgent className="text-6xl text-[#f7d36e]" />,
                title: "Tokenizing Properties",
                desc: "We fractionalize real estate assets into digital tokens representing ownership, powered by blockchain.",
              },
              {
                icon: <GiToken className="text-6xl text-[#8b5cf6]" />,
                title: "Smart Contract Governance",
                desc: "Automated payouts, ownership transfers, and security are handled by transparent, audited smart contracts.",
              },
              {
                icon: <FaEthereum className="text-6xl text-[#60a5fa]" />,
                title: "Trade & Grow",
                desc: "Investors can trade their shares globally in seconds — like stocks, but backed by real-world value.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                whileHover={{ y: -10, scale: 1.04 }}
                className="relative bg-white/10 border border-white/20 backdrop-blur-xl rounded-3xl p-10 text-center shadow-[0_0_40px_rgba(255,255,255,0.05)] hover:shadow-[0_0_60px_rgba(255,215,0,0.15)] transition-all"
              >
                <div className="flex justify-center mb-6">{item.icon}</div>
                <h3 className="text-2xl font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-gray-300 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Meet the Team - Awwwards Style */}
        <section className="max-w-7xl mx-auto px-6 py-32 relative">
          <motion.h2
            initial="hidden"
            whileInView="show"
            variants={fadeUp}
            className="text-5xl font-bold mb-20 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#ffffff] to-[#f7d36e]"
          >
            Meet the Visionaries
          </motion.h2>

          <div className="flex flex-wrap justify-center gap-12">
            {[
              {
                name: "Sambhav Sharma",
                role: "Frontend & AIML Lead",
                gradient: "from-[#00f6ff] to-[#003cff]",
              },
              {
                name: "Devang Vaishnav",
                role: "Backend & Operations Lead",
                gradient: "from-[#ff7e5f] to-[#feb47b]",
              },
              {
                name: "Kuber Khandare",
                role: "Web3 & Crypto Lead",
                gradient: "from-[#f7d36e] to-[#ffd700]",
              },
            ].map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: i * 0.2 }}
                whileHover={{ scale: 1.1, rotateY: 5 }}
                className={`relative group w-80 h-96 rounded-3xl overflow-hidden bg-gradient-to-br ${member.gradient} p-[2px] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]`}
              >
                <div className="absolute inset-0 bg-black/80 backdrop-blur-xl rounded-3xl flex flex-col items-center justify-center transition-all duration-500 group-hover:bg-black/60">
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="w-28 h-28 bg-white/10 border border-white/20 rounded-full mb-6 flex items-center justify-center text-4xl font-bold text-white/70"
                  >
                    {member.name.charAt(0)}
                  </motion.div>
                  <h3 className="text-2xl font-semibold text-white">{member.name}</h3>
                  <p className="text-gray-300 mt-2 text-sm uppercase tracking-widest">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Legality & Compliance */}
        <section className="max-w-6xl mx-auto px-6 py-24">
          <motion.h2
            initial="hidden"
            whileInView="show"
            variants={fadeUp}
            className="text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#f7d36e] to-[#ffffff]"
          >
            Legality & Compliance
          </motion.h2>

          <motion.div
            initial="hidden"
            whileInView="show"
            variants={fadeUp}
            className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.1)] p-12 max-w-5xl mx-auto text-center relative overflow-hidden"
          >
            <motion.div
              animate={{ opacity: [0.1, 0.25, 0.1] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.1),transparent_70%)] blur-3xl"
            ></motion.div>

            <div className="flex justify-center mb-8 relative z-10">
              <FaGavel className="text-6xl text-[#f7d36e]" />
            </div>

            <div className="space-y-6 text-gray-300 text-lg leading-relaxed relative z-10">
              <p>
                RealSlice is fully aligned with the evolving frameworks of{" "}
                <span className="text-white font-medium">fractional real estate ownership</span> and{" "}
                <span className="text-white font-medium">tokenized asset trading</span> under Indian financial and property law.
                The idea is simple yet transformative — just like company shares represent ownership in a firm, our tokens represent verified ownership fractions of real, tangible properties.
              </p>

              <p>
                The <span className="text-white font-medium">RERA (Real Estate Regulation and Development Act)</span> and{" "}
                <span className="text-white font-medium">SEBI</span> guidelines currently recognize <i>fractional ownership</i> structures via Special Purpose Vehicles (SPVs).
                Each property listed on RealSlice is legally registered to an SPV entity, ensuring that every token directly correlates with an auditable share in that property.
              </p>

              <p>
                Our blockchain layer simply digitizes this process — transforming each SPV share into an{" "}
                <span className="text-white font-medium">NFT-backed token</span>.
                Ownership transfers, liquidity, and yield distributions occur transparently through{" "}
                <span className="text-white font-medium">smart contracts</span>, maintaining full compliance with asset traceability and{" "}
                <span className="text-white font-medium">KYC/AML norms</span>.
              </p>

              <p>
                NFT trading on RealSlice doesn’t involve speculative crypto-assets; instead, it represents a legally valid{" "}
                <span className="text-white font-medium">fractional right</span> in real estate.
                Our operations are designed to comply with upcoming{" "}
                <span className="text-white font-medium">tokenized security</span> frameworks and government mandates encouraging{" "}
                <i>digital asset representation</i> for physical properties.
              </p>

              <p className="text-gray-400 italic mt-6">
                In essence — RealSlice bridges the gap between traditional real estate and modern finance.
                It’s a <span className="text-white font-semibold">share market for real estate</span> — where every property can be invested in, traded, and owned collectively — legally, transparently, and globally.
              </p>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default AboutPage;
