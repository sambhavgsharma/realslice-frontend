"use client";

import React from "react";
import AshwinSantiago from "@/assets/images/ashwin-santiago.jpg";
import AlecWhitten from "@/assets/images/alec-whitten.jpg";
import ReneWells from "@/assets/images/rene-wells.jpg";
import MollieHall from "@/assets/images/mollie-hall.jpg";

export const testimonialsData = [
  {
    quote:
      "RealSlice has completely transformed how we invest in real estate. Owning fractions of premium properties makes investing transparent and accessible. It's like the stock market, but for real estate!",
    name: "Sambhav Sharma",
    title: "Investor",
    image: AshwinSantiago,
  },
  {
    quote:
      "Listing my property on RealSlice was effortless. Multiple investors can buy shares in my property, and its value grows based on area demand. Truly innovative!",
    name: "Vedant Kulkarni",
    title: "Property Owner",
    image: AlecWhitten,
  },
  {
    quote:
      "The fractional marketplace of RealSlice allows small investors like me to own a slice of high-value properties. The platform is simple, fast, and secure.",
    name: "Mrunal Kulkarni",
    title: "First-Time Investor",
    image: ReneWells,
  },
  {
    quote:
      "RealSlice makes real estate investing feel like trading stocks, but safer and more intuitive. I can diversify across multiple properties and watch my portfolio grow.",
    name: "Devang Vaishnav",
    title: "Real Estate Enthusiast",
    image: MollieHall,
  },
];

export const Testimonials = () => {
  return (
    <section className="relative w-full py-20 bg-gray-900 overflow-hidden">
      {/* Background gradient for depth */}
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-black/60 via-black/30 to-black/60 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <h2 className="mx-auto max-w-3xl text-3xl sm:text-4xl md:text-5xl font-extrabold text-white text-center mb-12 px-4 md:px-0">
          What People Say About{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-silver to-gold">
            RealSlice
          </span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
          {testimonialsData.map((t, i) => (
            <div
              key={i}
              className="w-full max-w-sm bg-[#0F172A]/70 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center shadow-xl hover:scale-[1.02] transition-transform duration-300"
            >
              <img
                src={t.image.src}
                alt={t.name}
                className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-white/20"
              />
              <p className="text-gray-200 mb-4 text-sm">{t.quote}</p>
              <h4 className="text-white font-semibold">{t.name}</h4>
              <span className="text-gray-400 text-xs">{t.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
