"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/sections/Header";
import Footer from "@/sections/Footer";
import { useProperties } from "@/hooks/useApi";
import { web3PropertyService, connectWallet } from "@/lib/web3Service";
import { motion } from "framer-motion";

type FormState = {
  name: string;
  description: string;
  location: string;
  areaSqFt: string;
  propertyType: string;
  price: string;
  totalShares: string;
  sharePrice: string;
};

export default function ListPropertyPage() {
  const router = useRouter();
  const { create: createProperty } = useProperties();
  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
    location: "",
    areaSqFt: "",
    propertyType: "",
    price: "",
    totalShares: "100",
    sharePrice: "",
  });

  const [gallery, setGallery] = useState<FileList | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [blockchainStep, setBlockchainStep] = useState(false);
  const [web3Error, setWeb3Error] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const validate = (): boolean => {
    const errs: string[] = [];
    if (!form.name.trim()) errs.push("Property name is required");
    if (!form.location.trim()) errs.push("Location is required");
    if (!form.price.trim() || Number.isNaN(Number(form.price))) errs.push("Valid price is required");
    if (!form.totalShares.trim() || Number.isNaN(Number(form.totalShares))) errs.push("Valid total shares is required");
    if (!gallery || gallery.length === 0) errs.push("Please upload at least one gallery image");

    setErrors(errs);
    return errs.length === 0;
  };

  const handleConnectWallet = async () => {
    const wallet = await connectWallet();
    if (wallet) {
      setWalletConnected(true);
      alert(`Wallet connected: ${wallet}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setWeb3Error("");

    try {
      // Step 1: Create property on backend first
      const propertyData = {
        name: form.name,
        location: form.location,
        description: form.description,
        currentPrice: Number(form.price) || 0,
        totalShares: Number(form.totalShares) || 100,
      };

      const backendResult = await createProperty(propertyData);
      if (!backendResult) {
        setErrors(["Failed to create property on backend"]);
        setSubmitting(false);
        return;
      }

      // Move to blockchain step
      setBlockchainStep(true);
      alert(
        "Property created on backend! Now create it on-chain to complete the process.\n\n" +
        `Backend Property ID: ${(backendResult as any).property?.propertyId}`
      );
    } catch (err) {
      console.error("Error:", err);
      setErrors(["Submission failed. Check console for details."]);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateOnChain = async () => {
    if (!walletConnected) {
      setWeb3Error("Please connect wallet first");
      return;
    }

    setSubmitting(true);
    setWeb3Error("");

    try {
      if (!window || !(window as any).ethereum) {
        setWeb3Error("No Ethereum provider found. Install MetaMask.");
        setSubmitting(false);
        return;
      }

      const ethers = (await import("ethers")) as any;
      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      // Get contract ABI and address
      const { ABI, ADDRESS } = (await import("../../../contract/contract_data")) as any;
      const contract = new ethers.Contract(ADDRESS, ABI, signer);

      // Call createProperty on smart contract
      const totalShares = Number(form.totalShares);
      const tx = await contract.createProperty(totalShares);
      alert(`Transaction sent: ${tx.hash}`);

      const receipt = await tx.wait();
      alert("Transaction confirmed!");

      // Parse logs to find PropertyCreated event
      const iface = new ethers.utils.Interface(ABI);
      let tokenId: string | number | null = null;
      for (const log of receipt.logs) {
        try {
          const parsed = iface.parseLog(log);
          if (parsed && parsed.name === "PropertyCreated") {
            tokenId = parsed.args[0].toString();
            break;
          }
        } catch (e) {
          // Ignore
        }
      }

      if (tokenId === null) {
        setWeb3Error("Could not parse token ID from transaction");
        setSubmitting(false);
        return;
      }

      // Now sync with backend
      const web3Result = await web3PropertyService.createPropertyWithBlockchain(
        {
          tokenId,
          txHash: receipt.transactionHash,
        },
        {
          name: form.name,
          location: form.location,
          description: form.description,
          currentPrice: Number(form.price),
          totalShares: Number(form.totalShares),
        }
      );

      if (web3Result.success) {
        alert(
          `Property successfully created!\n\nBackend ID: ${web3Result.backendId}\nBlockchain ID: ${web3Result.blockchainId}\nTx: ${web3Result.transactionHash}`
        );
        router.push("/properties");
      } else {
        setWeb3Error(web3Result.error || "Failed to sync with backend");
      }
    } catch (err: any) {
      console.error("Error:", err);
      setWeb3Error(err.message || "Error creating property on-chain");
    } finally {
      setSubmitting(false);
    }
  };

  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  if (!token) {
    router.push('/login');
    return null;
  }

  return (
    <>
      <Header />

      <main className="min-h-screen pt-28 pb-24 bg-gradient-to-b from-[#050B18] via-[#071127] to-[#000314] text-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="mb-6">
              <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[#f7d36e] via-[#06b6d4] to-[#4f46e5] bg-clip-text text-transparent mb-3">List a Property</h1>
              <div className="h-1 w-32 bg-gradient-to-r from-[#f7d36e] to-[#06b6d4] rounded-full"></div>
            </div>
            <p className="text-lg text-gray-300 leading-relaxed max-w-2xl">
              Fill this form to list your property and create it on the blockchain for fractional ownership. Start your real estate journey with RealSlice today.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            {/* Basic Info */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#f7d36e] to-[#06b6d4] bg-clip-text text-transparent">Basic Property Information</h2>
                <div className="h-1 w-16 bg-gradient-to-r from-[#4f46e5] to-[#06b6d4] rounded-full mt-2"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Property Name *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#f7d36e] focus:bg-white/10 transition backdrop-blur-sm"
                    placeholder="e.g., Luxury Villa in Mumbai"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Property Type *</label>
                  <select
                    name="propertyType"
                    value={form.propertyType}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:border-[#f7d36e] focus:bg-white/10 transition backdrop-blur-sm"
                  >
                    <option value="">Select type</option>
                    <option>Residential</option>
                    <option>Commercial</option>
                    <option>Land</option>
                    <option>Industrial</option>
                  </select>
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Area (Sq Ft) *</label>
                  <input
                    name="areaSqFt"
                    value={form.areaSqFt}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#f7d36e] focus:bg-white/10 transition backdrop-blur-sm"
                    placeholder="e.g., 5000"
                    type="number"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Market Price (₹) *</label>
                  <input
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#f7d36e] focus:bg-white/10 transition backdrop-blur-sm"
                    placeholder="e.g., 5000000"
                    type="number"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Share Price (₹) <span className="text-gray-500 text-xs">(Optional)</span></label>
                  <input
                    name="sharePrice"
                    value={form.sharePrice}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#f7d36e] focus:bg-white/10 transition backdrop-blur-sm"
                    placeholder="Auto-calculated if left empty"
                    type="number"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Total Shares</label>
                  <input
                    name="totalShares"
                    value={form.totalShares}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#f7d36e] focus:bg-white/10 transition backdrop-blur-sm"
                    placeholder="Default: 100"
                    type="number"
                  />
                </div>
                <div className="sm:col-span-2 group">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Address / Location *</label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#f7d36e] focus:bg-white/10 transition backdrop-blur-sm"
                    placeholder="e.g., 123 Main St, Mumbai, Maharashtra 400001"
                  />
                </div>
                <div className="sm:col-span-2 group">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description / Highlights</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#f7d36e] focus:bg-white/10 transition backdrop-blur-sm resize-none"
                    placeholder="Describe the property features, amenities, recent renovations, etc."
                    rows={4}
                  />
                </div>
              </div>
            </motion.section>

            {/* Gallery Upload */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#f7d36e] to-[#06b6d4] bg-clip-text text-transparent">Gallery & Media</h2>
                <div className="h-1 w-16 bg-gradient-to-r from-[#4f46e5] to-[#06b6d4] rounded-full mt-2"></div>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/20 backdrop-blur-sm hover:bg-white/15 transition">
                <p className="text-gray-300 text-sm font-medium mb-4">Upload property photos (Max 10 images)</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setGallery(e.target.files)}
                  className="w-full p-4 rounded-xl bg-white/5 border border-dashed border-white/30 text-gray-400 focus:outline-none focus:border-[#f7d36e] transition cursor-pointer hover:border-white/50"
                />
                <p className="text-xs text-gray-500 mt-2">Supported: JPG, PNG, WebP (up to 5MB each)</p>
              </div>
            </motion.section>

            {/* Errors */}
            {errors.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-500/20 border border-red-500/40 backdrop-blur-sm p-5 rounded-xl"
              >
                <p className="text-red-300 font-semibold mb-3">Please fix the following errors:</p>
                <ul className="list-disc pl-6 space-y-1">
                  {errors.map((err, i) => (
                    <li key={i} className="text-red-200 text-sm">{err}</li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Form Footer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10"
            >
              <div className="text-sm text-gray-400">
                <p>💡 Fill the form and create on backend first,</p>
                <p>then create on-chain to enable fractional ownership.</p>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#4f46e5] via-[#7c3aed] to-[#06b6d4] text-white shadow-lg hover:shadow-xl hover:opacity-90 disabled:opacity-50 transition transform hover:scale-105"
              >
                {submitting ? "Creating..." : "Create on Backend"}
              </button>
            </motion.div>
          </form>

          {/* Blockchain Step */}
          {blockchainStep && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
            >
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4f46e5] to-[#06b6d4] flex items-center justify-center font-bold text-white">2</div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-[#f7d36e] to-[#06b6d4] bg-clip-text text-transparent">Complete On-Chain Creation</h2>
                </div>
                <div className="h-1 w-24 bg-gradient-to-r from-[#4f46e5] to-[#06b6d4] rounded-full"></div>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-6 mb-8 backdrop-blur-sm">
                <p className="text-gray-300 leading-relaxed">
                  ✨ Your property has been created in our database. Now connect your wallet and create it on-chain to enable fractional ownership trading.
                </p>
              </div>

              {web3Error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-500/20 border border-red-500/40 backdrop-blur-sm p-5 rounded-xl mb-6"
                >
                  <p className="text-red-300 font-semibold flex items-center gap-2">
                    <span className="text-lg">⚠️</span> {web3Error}
                  </p>
                </motion.div>
              )}

              <div className="space-y-4">
                {!walletConnected ? (
                  <motion.button
                    type="button"
                    onClick={handleConnectWallet}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 px-8 rounded-2xl font-bold text-lg bg-gradient-to-r from-[#5eff00] via-[#00ff88] to-[#C0C0C0] text-black shadow-lg hover:shadow-xl transition transform"
                  >
                    🔐 Connect MetaMask Wallet
                  </motion.button>
                ) : (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 p-4 bg-green-500/20 border border-green-500/40 rounded-xl backdrop-blur-sm"
                    >
                      <span className="text-2xl">✅</span>
                      <span className="text-green-300 font-semibold">Wallet connected successfully</span>
                    </motion.div>
                    <motion.button
                      type="button"
                      onClick={handleCreateOnChain}
                      disabled={submitting}
                      whileHover={!submitting ? { scale: 1.02 } : {}}
                      whileTap={!submitting ? { scale: 0.98 } : {}}
                      className="w-full py-4 px-8 rounded-2xl font-bold text-lg bg-gradient-to-r from-[#5eff00] via-[#00ff88] to-[#C0C0C0] text-black shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition transform"
                    >
                      {submitting ? "⏳ Creating on-chain..." : "🚀 Create on-Chain & Pay Gas"}
                    </motion.button>
                  </>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-sm text-gray-400 text-center">
                  💡 <span className="text-gray-300">You'll be prompted to approve the transaction in your wallet.</span> <br/>
                  <span className="text-xs text-gray-500 mt-1 block">This will create your property on the blockchain and enable fractional share trading.</span>
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
