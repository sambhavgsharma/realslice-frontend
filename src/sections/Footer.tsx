"use client";

import React from "react";
import logoImage from "@/assets/images/slice_logo.svg?url";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube, faXTwitter, faDiscord } from "@fortawesome/free-brands-svg-icons";

export const navItems = [
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "Login", href: "#login" },
];

export const socialLinks = [
  { name: "Youtube", icon: faYoutube, href: "#youtube" },
  { name: "X", icon: faXTwitter, href: "#x" },
  { name: "Discord", icon: faDiscord, href: "#discord" },
];

export const Footer = () => {
  return (
    <footer className="relative w-full bg-gray-900 text-gray-300 overflow-hidden">
      {/* Optional background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-black/50 to-gray-900 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row justify-between gap-10">
        {/* Logo + Description */}
        <div className="flex flex-col gap-4 md:w-1/3">
          <img src={logoImage.src} alt="RealSlice Logo" className="w-12 h-12" />
          <p className="text-gray-400 text-sm">
            RealSlice: Fractionalized Real Estate Marketplace. Buy or list properties share-wise
            and invest in high-demand areas with transparency.
          </p>

          <div className="flex gap-4 mt-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label={social.name}
              >
                <FontAwesomeIcon icon={social.icon} className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col md:flex-row md:gap-16 gap-6">
          {navItems.map((section) => (
            <div key={section.name} className="flex flex-col gap-2">
              <a
                href={section.href}
                className="text-gray-300 hover:text-white text-sm transition-colors"
              >
                {section.name}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Divider + Copyright */}
      <div className="border-t border-gray-700 mt-6">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} RealSlice. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
