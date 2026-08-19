import React from 'react';
import { ShieldCheck, Wallet, Lock, FileCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LandingView({ documentsCount, wallet, onConnectWalletClick, onExploreClick }) {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-indigo-50/40 via-white to-slate-50 p-8">
      {/* Background Glow Effects */}
      <div className="absolute top-12 left-1/3 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl opacity-70 animate-pulse pointer-events-none" />
      <div className="absolute bottom-12 right-1/3 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl opacity-60 animate-pulse pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        {/* Shield Hero Logo */}
        <div className="w-28 h-28 md:w-36 md:h-36 mx-auto relative flex items-center justify-center">
          <div className="absolute inset-0 bg-indigo-500/10 rounded-full animate-ping opacity-30" />
          <div className="w-full h-full rounded-3xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-700 text-white flex items-center justify-center shadow-xl shadow-indigo-200">
            <ShieldCheck className="w-16 h-16 md:w-20 md:h-20" />
          </div>
        </div>

        {/* Dynamic Hero Title & Subtitle */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold tracking-widest uppercase">
            <Lock className="w-3.5 h-3.5" /> Next-Gen Legal Infrastructure
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Digital Permanence for <span className="bg-gradient-to-r from-indigo-600 to-amber-600 bg-clip-text text-transparent">Legal Records</span>
          </h1>
          <div className="w-20 h-1 bg-amber-500 rounded-full mx-auto" />
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-sans leading-relaxed">
            Currently securing <strong className="text-indigo-900 font-bold">{documentsCount} active legal instruments</strong> with zero-knowledge SHA-256 hashes anchored to <span className="font-semibold text-slate-900">{wallet.network}</span>.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onConnectWalletClick}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-sans font-bold text-sm tracking-wider uppercase rounded-full shadow-lg shadow-amber-200 hover:from-amber-600 hover:to-amber-700 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-3"
          >
            <Wallet className="w-5 h-5" />
            {wallet.isConnected ? `Connected: ${wallet.address.substring(0, 6)}...` : 'Connect Web3 Wallet'}
          </button>
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-sans font-bold text-sm tracking-wider uppercase rounded-full border border-slate-300 shadow-sm hover:bg-slate-50 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
          >
            Explore Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Feature Highlights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 text-left">
          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">AES-256 Client Encryption</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Zero-knowledge client-side encryption ensures only authorized keyholders decrypt sensitive files.</p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">SHA-256 Hash Seals</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Cryptographic fingerprints anchored directly to smart contract registries on {wallet.network}.</p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Instant Audit Trails</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Complete provenance history tracking every signature, timestamp, and verification event.</p>
          </div>
        </div>

        <div className="pt-6 font-mono text-xs text-slate-400 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          {wallet.network} Node Status: 100% Operational
        </div>
      </div>
    </div>
  );
}
