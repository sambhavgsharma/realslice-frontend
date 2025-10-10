"use client";

import React from "react";
import { motion } from "framer-motion";
import AcmeCorpLogo from "../assets/images/acme-corp-logo.svg";
import EchoValleyLogo from "../assets/images/echo-valley-logo.svg";
import QuantumLogo from "../assets/images/quantum-logo.svg";
import PulseLogo from "../assets/images/pulse-logo.svg";
import OutsideLogo from "../assets/images/outside-logo.svg";
import CelestialLogo from "../assets/images/celestial-logo.svg";

export const companies = [
  { name: "Acme Corp", logo: AcmeCorpLogo },
  { name: "Echo Valley", logo: EchoValleyLogo },
  { name: "Quantum", logo: QuantumLogo },
  { name: "Pulse", logo: PulseLogo },
  { name: "Outside", logo: OutsideLogo },
  { name: "Celestial", logo: CelestialLogo },
];

export const Companies = () => {
  return (
    <section className="relative w-full py-16 overflow-hidden bg-black/90 backdrop-blur-md">
      {/* subtle gradient overlay for smooth transition */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-12 text-center">
          Our Partners
        </h2>

        {/* marquee container */}
        <div className="overflow-hidden relative">
          <motion.div
            className="flex gap-12"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: "linear",
            }}
          >
            {companies.concat(companies).map((company, index) => (
              <div
                key={index}
                className="flex items-center justify-center min-w-[120px] sm:min-w-[160px]"
              >
                <company.logo className="w-24 sm:w-32 object-contain filter brightness-125 opacity-90 hover:opacity-100 transition duration-300" alt={company.name} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Companies;
