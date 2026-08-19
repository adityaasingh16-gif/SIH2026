import React from 'react';
import { X, ShieldCheck, Wallet, Sparkles } from 'lucide-react';

export default function ConnectWalletModal({ isOpen, onClose, onSelectWallet }) {
  if (!isOpen) return null;

  const walletOptions = [
    { name: 'MetaMask', desc: 'Connect using web browser extension', icon: '🦊', color: 'border-amber-200 bg-amber-50/50' },
    { name: 'Coinbase Wallet', desc: 'Self-custody web3 wallet', icon: '🔵', color: 'border-blue-200 bg-blue-50/50' },
    { name: 'WalletConnect', desc: 'Scan QR code with mobile wallet', icon: '⚡', color: 'border-indigo-200 bg-indigo-50/50' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Connect Web3 Wallet</h3>
            <p className="text-xs text-slate-500">Access your legal document vault on-chain</p>
          </div>
        </div>

        <div className="space-y-3 my-6">
          {walletOptions.map((opt) => (
            <button
              key={opt.name}
              onClick={() => {
                onSelectWallet('0x71C7656EC7ab88b098defB751B7401B5f6d839A2');
                onClose();
              }}
              className={`w-full p-4 rounded-2xl border flex items-center gap-4 transition-all duration-200 hover:shadow-md hover:border-indigo-300 text-left ${opt.color}`}
            >
              <span className="text-2xl">{opt.icon}</span>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900">{opt.name}</h4>
                <p className="text-xs text-slate-500">{opt.desc}</p>
              </div>
              <Sparkles className="w-4 h-4 text-slate-400" />
            </button>
          ))}
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Non-custodial cryptographic verification. Zero private key exposure.</span>
        </div>
      </div>
    </div>
  );
}
