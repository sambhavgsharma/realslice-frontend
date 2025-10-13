"use client";

import React, { useState } from "react";
import Header from "@/sections/Header";
import Footer from "@/sections/Footer";
// contract data is at project root
import { ABI, ADDRESS } from '../../../contract/contract_data';

type FormState = {
  name: string; // maps to backend `name`
  description: string;
  location: string; // maps to backend `location`
  areaSqFt: string;
  propertyType: string;
  price: string; // will be sent as currentPrice (Number)
  totalShares: string;
  sharePrice: string;
  aadharNumber: string;
};

export default function ListPropertyPage() {
  type TxState = {
    status: 'idle' | 'ready' | 'pending' | 'confirmed';
    backendId?: string;
    shares?: number;
    tokenId?: string | number | null;
    txHash?: string;
  };

  const [txState, setTxState] = useState<TxState>({ status: 'idle' });

  // Component: creates a property on-chain by calling the contract directly via window.ethereum.
  function CreatePropertyButton({ shares, backendId, onDone, onError }: { shares: number; backendId?: string; onDone?: (tokenId: string | number | null) => void; onError?: (msg: string) => void; }) {
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
      if (!window || !(window as any).ethereum) {
        onError?.('No Ethereum provider found. Install MetaMask.');
        return;
      }
      try {
        setLoading(true);
        // dynamic import to avoid top-level type errors if ethers isn't installed in the environment for type checking
        const ethers = (await import('ethers')) as any;
        const provider = new ethers.providers.Web3Provider((window as any).ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(ADDRESS, ABI, signer);

        // call createProperty(totalShares)
        const tx = await contract.createProperty(shares);
        setTxState((s) => ({ ...s, status: 'pending', txHash: tx.hash }));
        const receipt = await tx.wait();

        // parse logs to find PropertyCreated event (propertyId)
        const iface = new ethers.utils.Interface(ABI);
        let tokenId: string | number | null = null;
        for (const log of receipt.logs) {
          try {
            const parsed = iface.parseLog(log);
            if (parsed && parsed.name === 'PropertyCreated') {
              tokenId = parsed.args[0].toString();
              break;
            }
          } catch (e) {
            // ignore parse errors for unrelated logs
          }
        }

        setTxState((s) => ({ ...s, status: 'confirmed', tokenId, txHash: receipt.transactionHash }));
        onDone?.(tokenId);
      } catch (err: any) {
        console.error('Create property failed', err);
        onError?.(String(err?.message || err));
        setTxState({ status: 'idle' });
      } finally {
        setLoading(false);
      }
    };

    return (
      <button onClick={handleCreate} disabled={loading} className="py-2 px-4 rounded-md bg-gradient-to-r from-[#4f46e5] to-[#06b6d4]">{loading ? 'Sending tx...' : 'Create on-chain'}</button>
    );
  }
  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
    location: "",
    areaSqFt: "",
    propertyType: "",
    price: "",
    totalShares: "100",
    sharePrice: "",
    aadharNumber: "",
  });

  const [documents, setDocuments] = useState<FileList | null>(null);
  const [gallery, setGallery] = useState<FileList | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const validate = (): boolean => {
    const errs: string[] = [];
    if (!form.name.trim()) errs.push("Property name is required");
    if (!form.location.trim()) errs.push("Location is required");
    if (!form.price.trim() || Number.isNaN(Number(form.price))) errs.push("Valid price is required");
    if (!documents || documents.length === 0) errs.push("At least one official document must be uploaded");
    if (!gallery || gallery.length === 0) errs.push("Please upload at least one gallery image");
    // simple aadhar-like check (12 digits)
    if (!/^[0-9]{12}$/.test(form.aadharNumber)) errs.push("Aadhar number must be 12 digits (placeholder validation)");

    setErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      // Upload documents & gallery to storage first.
      // NOTE: replace this mock with real upload logic (IPFS / S3 / backend multipart upload)
      const uploadFiles = async (files: FileList | null): Promise<string[]> => {
        if (!files) return [];
        // Mock: return object URLs for preview. In production you'd upload and return remote URLs.
        const urls: string[] = [];
        for (let i = 0; i < files.length; i++) {
          const f = files[i];
          // Create temporary object URL (not suitable for backend storage)
          urls.push(URL.createObjectURL(f));
        }
        return urls;
      };

      const docUrls = await uploadFiles(documents);
      const galleryUrls = await uploadFiles(gallery);

      // Assemble payload that matches backend Property.js schema
      const payload = {
        // propertyId is generated by backend on save
        name: form.name,
        location: form.location,
        currentPrice: Number(form.price) || 0,
        totalShares: Number(form.totalShares) || 0,
        availableShares: Number(form.totalShares) || 0, // initially all available
        // additional metadata for your backend to store or forward to on-chain process
        metadata: {
          description: form.description,
          areaSqFt: form.areaSqFt,
          propertyType: form.propertyType,
          sharePrice: form.sharePrice,
          documents: docUrls,
          gallery: galleryUrls,
        },
      };

      // TODO: Ensure authentication (owner), and replace endpoint URL if needed.
      const res = await fetch("/list-properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server responded with ${res.status}: ${text}`);
      }

      const result = await res.json();
      console.log("Listing result:", result);
      // After backend returns success, trigger wallet flow to pay gas / mint fractional tokens.
      alert("Property successfully submitted to backend. Next: trigger wallet flow to complete on-chain listing (not implemented here).\nResponse id: " + result._id);
    } catch (err) {
      console.error(err);
      setErrors(["Submission failed. See console for details."]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>

      <main className="min-h-screen pt-28 pb-24 bg-gradient-to-b from-[#050B18] via-[#071127] to-[#000314] text-white">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-2">List a Property</h1>
          <p className="text-gray-400 mb-6">Fill this form to list your property. You will be asked to pay gas fees to finalize the on-chain listing.</p>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 border border-white/10 rounded-2xl p-6">
            {/* Basic Info */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Basic Info About Property</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input name="name" value={form.name} onChange={handleChange} className="p-3 rounded-lg bg-white/5 border border-white/10" placeholder="Property name" />
                <select name="propertyType" value={form.propertyType} onChange={handleChange} className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <option value="">Select type</option>
                  <option>Residential</option>
                  <option>Commercial</option>
                  <option>Land</option>
                  <option>Industrial</option>
                </select>
                <input name="areaSqFt" value={form.areaSqFt} onChange={handleChange} className="p-3 rounded-lg bg-white/5 border border-white/10" placeholder="Area (sq ft)" />
                <input name="price" value={form.price} onChange={handleChange} className="p-3 rounded-lg bg-white/5 border border-white/10" placeholder="Estimated market price (in INR)" />
                <input name="sharePrice" value={form.sharePrice} onChange={handleChange} className="p-3 rounded-lg bg-white/5 border border-white/10" placeholder="Suggested price per share (optional)" />
                <input name="totalShares" value={form.totalShares} onChange={handleChange} className="p-3 rounded-lg bg-white/5 border border-white/10" placeholder="Total shares (default 100)" />
                <input name="location" value={form.location} onChange={handleChange} className="sm:col-span-2 p-3 rounded-lg bg-white/5 border border-white/10" placeholder="Full address / location" />
                <textarea name="description" value={form.description} onChange={handleChange} className="sm:col-span-2 p-3 rounded-lg bg-white/5 border border-white/10" placeholder="Short description / highlights" />
              </div>
            </section>

            {/* Official User Validation */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Official User Validation</h2>
              <p className="text-gray-400 text-sm mb-2">We use government ID verification (Aadhar or equivalent). This is a frontend placeholder — integrate real KYC provider on backend.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input name="aadharNumber" value={form.aadharNumber} onChange={handleChange} className="p-3 rounded-lg bg-white/5 border border-white/10" placeholder="Aadhar number (12 digits)" />
                <button type="button" className="p-3 rounded-lg bg-white/5 border border-white/10" onClick={() => alert('Trigger KYC flow (backend integration needed)')}>Start KYC Flow</button>
              </div>
            </section>

            {/* User Documents Upload */}
            <section>
              <h2 className="text-xl font-semibold mb-3">User Documents Upload</h2>
              <p className="text-gray-400 text-sm mb-2">Upload ownership proof, tax receipts, and other official documents (PDF preferred).</p>
              <input type="file" accept="application/pdf,image/*" multiple onChange={(e) => setDocuments(e.target.files)} className="w-full" />
            </section>

            {/* Gallery Upload */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Gallery Upload</h2>
              <p className="text-gray-400 text-sm mb-2">Upload photos of the property. These will appear in the listing.</p>
              <input type="file" accept="image/*" multiple onChange={(e) => setGallery(e.target.files)} className="w-full" />
            </section>

            {/* Fractionalization */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Fractionalization</h2>
              <p className="text-gray-400 text-sm mb-2">Configure fractional ownership: how many shares, price per share, and minimum lot size. Fractionalization happens on-chain; wallet integration required.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input name="totalShares" value={form.totalShares} onChange={handleChange} className="p-3 rounded-lg bg-white/5 border border-white/10" placeholder="Total shares" />
                <input name="sharePrice" value={form.sharePrice} onChange={handleChange} className="p-3 rounded-lg bg-white/5 border border-white/10" placeholder="Price per share (INR)" />
                <input name="price" value={form.price} onChange={handleChange} className="p-3 rounded-lg bg-white/5 border border-white/10" placeholder="Reserve price / valuation" />
              </div>
            </section>

            {/* Errors */}
            {errors.length > 0 && (
              <div className="bg-red-900/30 border border-red-700/30 p-3 rounded-md">
                <ul className="list-disc pl-5 text-sm text-red-200">
                  {errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">By submitting you agree to pay gas fees for on-chain listing and fractionalization (wallet popup).</div>
              <div className="flex items-center gap-3">
                <button type="button" className="py-2.5 px-4 rounded-xl bg-white/5 border border-white/10" onClick={() => { setForm({ name: "", description: "", location: "", areaSqFt: "", propertyType: "", price: "", totalShares: "100", sharePrice: "", aadharNumber: ""}); setDocuments(null); setGallery(null); setErrors([]); }}>Reset</button>
                <button type="submit" disabled={submitting} className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#5eff00] to-[#C0C0C0] text-black font-medium">{submitting ? 'Submitting...' : 'List Property & Pay Gas'}</button>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}
