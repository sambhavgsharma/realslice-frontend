"use client";
import React, { useState } from "react";
import logoImage from '@/assets/images/slice_logo.svg?url';
import { motion, AnimatePresence } from "framer-motion";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const navItems = [
  { name: "Home", href: "/" },
  { name: "Properties", href: "/properties" },
  { name: "About Us", href: "/about" },
  { name: "List Property", href: "/list-property" },
];

// Add this props interface and update Header's parameter typing
interface HeaderProps {
	// made optional so <Header /> can be used without passing props
	account?: { address?: string; displayName?: string } | null;
	chain?: { id?: number; name?: string } | undefined;
	openAccountModal?: () => void;
	openConnectModal?: () => void;
	mounted?: boolean;
}

export const Header = ({
	account = null,
	chain = undefined,
	openAccountModal = () => {},
	openConnectModal = () => {},
	mounted = false,
}: HeaderProps) => {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-6 left-0 w-full px-4 md:px-8 py-4 z-50 pointer-events-auto"
    >
      <div className="mx-auto max-w-7xl">
        <div className="rounded-full bg-white/6 backdrop-blur-md border border-white/10 shadow-lg py-2 px-3 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src={logoImage.src}
              alt="RealSlice Logo"
              className="w-10 h-10 rounded-full object-contain"
            />
            <div className="hidden sm:block">
              <div className="text-white font-extrabold text-lg tracking-tight">
                RealSlice
              </div>
              <div className="text-xs text-gray-400 -mt-0.5">
                Real Estate. Fractionalized.
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 hidden md:flex justify-center">
            <ul className="flex gap-6 items-center">
              {navItems.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-full transition-colors duration-200 group"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Desktop Connect */}
            <div className="hidden md:block relative">
              <ConnectButton.Custom>
                {(props: {
                  account?: { address?: string; displayName?: string } | null;
                  chain?: { id?: number; name?: string } | undefined;
                  openAccountModal?: () => void;
                  openConnectModal?: () => void;
                  mounted?: boolean;
                }) => {
                  const { account, chain, openAccountModal, openConnectModal, mounted } = props;
                  const isConnected = !!(mounted && account);
                  
                   // New users: show normal connect modal
                   if (!isConnected) {
                     return (
                       <button
                         onClick={openConnectModal}
                         className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold backdrop-blur-md shadow-sm transition-all duration-200"
                       >
                         Connect Wallet
                       </button>
                     );
                   }
 
                   // Connected users: show Apple-style dropdown
                   return (
                     <div className="relative">
                       <button
                         onClick={() => setDropdownOpen(!dropdownOpen)}
                         className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 text-white font-semibold backdrop-blur-md shadow-sm hover:shadow-lg"
                       >
                        {account?.displayName ?? "Account"}
                         <motion.span
                           animate={{ rotate: dropdownOpen ? 180 : 0 }}
                           transition={{ duration: 0.2 }}
                           className="ml-1 text-xs"
                         >
                           ▼
                         </motion.span>
                       </button>
 
                       <AnimatePresence>
                         {dropdownOpen && (
                           <motion.div
                             initial={{ opacity: 0, scale: 0.95, y: -10 }}
                             animate={{ opacity: 1, scale: 1, y: 0 }}
                             exit={{ opacity: 0, scale: 0.95, y: -10 }}
                             transition={{ duration: 0.2 }}
                             className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg overflow-hidden z-50"
                           >
                             <a
                               href="/dashboard"
                               className="block px-4 py-3 text-white hover:bg-white/20 transition-colors duration-150"
                             >
                               Dashboard
                             </a>
                             <button
                               onClick={openAccountModal}
                               className="w-full text-left px-4 py-3 text-white hover:bg-white/20 transition-colors duration-150"
                             >
                               Disconnect / Manage
                             </button>
                           </motion.div>
                         )}
                       </AnimatePresence>
                     </div>
                   );
                 }}
              </ConnectButton.Custom>
            </div>

            {/* Mobile menu toggle */}
            <button
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((s) => !s)}
              className="md:hidden inline-flex items-center justify-center w-12 h-12 rounded-full bg-black/30 border border-gray-700 hover:bg-white/5 transition"
            >
              <div className="flex flex-col items-center justify-center gap-[6px] w-6">
                <motion.span
                  initial={false}
                  animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  className="block w-6 h-0.5 bg-gray-200 rounded-sm origin-center"
                />
                <motion.span
                  initial={false}
                  animate={open ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.12 }}
                  className="block w-6 h-0.5 bg-gray-200 rounded-sm"
                />
                <motion.span
                  initial={false}
                  animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  className="block w-6 h-0.5 bg-gray-200 rounded-sm origin-center"
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="mt-3 md:hidden w-full origin-top"
            >
              <div className="rounded-xl bg-[#061226]/70 border border-gray-800/40 backdrop-blur-md py-4 px-4 shadow-md w-full">
                <ul className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="block px-3 py-2 rounded-lg text-gray-200 hover:bg-white/3 transition"
                        onClick={() => setOpen(false)}
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                  <li className="pt-2">
                    <ConnectButton
                      showBalance={false}
                      chainStatus="none"
                      accountStatus="avatar"
                    />
                  </li>
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
