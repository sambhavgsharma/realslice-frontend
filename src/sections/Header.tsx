"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logoImage from '@/assets/images/slice_logo.svg?url';
import { motion, AnimatePresence } from "framer-motion";
import { WalletConnectButton, WalletConnectButtonMobile } from "@/components/WalletConnectButton";
import { useAuth } from "@/hooks/useApi";

export const navItems = [
  { name: "Home", href: "/" },
  { name: "Properties", href: "/properties" },
  { name: "About", href: "/about" },
];

export const Header = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push('/');
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-6 left-0 w-full px-4 md:px-8 py-4 z-50 pointer-events-auto"
    >
      <div className="mx-auto max-w-7xl">
        <div className="rounded-full bg-white/6 backdrop-blur-md border border-white/10 shadow-lg py-2 px-3 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <img src={logoImage.src} alt="RealSlice" className="w-10 h-10 rounded-full object-contain" />
            <div className="hidden sm:block">
              <div className="text-white font-extrabold text-lg">RealSlice</div>
              <div className="text-xs text-gray-400">Real Estate. Fractionalized.</div>
            </div>
          </Link>

          <nav className="flex-1 hidden md:flex justify-center">
            <ul className="flex gap-6">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-300 hover:text-white px-3 py-2 rounded-full transition">
                    {item.name}
                  </Link>
                </li>
              ))}
              {user && (
                <li>
                  <Link href="/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-full transition">
                    Dashboard
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
              {!user ? (
                <>
                  <Link href="/login" className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold transition">
                    Login
                  </Link>
                  <Link href="/register" className="px-5 py-2 rounded-full bg-gradient-to-r from-[#4f46e5] to-[#06b6d4] text-white font-semibold transition">
                    Sign Up
                  </Link>
                </>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold transition"
                  >
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    {user.name}
                  </button>
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg overflow-hidden z-50"
                      >
                        <Link href="/dashboard" className="block px-4 py-3 text-white hover:bg-white/20 transition" onClick={() => setDropdownOpen(false)}>
                          Dashboard
                        </Link>
                        <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-white hover:bg-white/20 transition">
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
              <WalletConnectButton />
            </div>

            <button onClick={() => setOpen(!open)} className="md:hidden inline-flex items-center w-12 h-12 rounded-full bg-black/30 border border-gray-700 hover:bg-white/5">
              <div className="flex flex-col gap-1.5 w-6 m-auto">
                <div className={`h-0.5 bg-gray-200 transition ${open ? 'rotate-45 translate-y-2' : ''}`}></div>
                <div className={`h-0.5 bg-gray-200 transition ${open ? 'opacity-0' : ''}`}></div>
                <div className={`h-0.5 bg-gray-200 transition ${open ? '-rotate-45 -translate-y-2' : ''}`}></div>
              </div>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-3 md:hidden">
              <div className="rounded-xl bg-[#061226]/70 border border-gray-800/40 backdrop-blur-md py-4 px-4">
                <ul className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="block px-3 py-2 rounded-lg text-gray-200 hover:bg-white/3 transition" onClick={() => setOpen(false)}>
                        {item.name}
                      </Link>
                    </li>
                  ))}
                  {user && (
                    <>
                      <li><Link href="/dashboard" className="block px-3 py-2 rounded-lg text-gray-200 hover:bg-white/3 transition" onClick={() => setOpen(false)}>Dashboard</Link></li>
                      <li><button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-lg text-gray-200 hover:bg-white/3 transition">Logout</button></li>
                    </>
                  )}
                  {!user && (
                    <>
                      <li><Link href="/login" className="block px-3 py-2 rounded-lg text-gray-200 hover:bg-white/3 transition" onClick={() => setOpen(false)}>Login</Link></li>
                      <li><Link href="/register" className="block px-3 py-2 rounded-lg text-gray-200 hover:bg-white/3 transition" onClick={() => setOpen(false)}>Sign Up</Link></li>
                    </>
                  )}
                  <li className="pt-2"><WalletConnectButtonMobile /></li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
