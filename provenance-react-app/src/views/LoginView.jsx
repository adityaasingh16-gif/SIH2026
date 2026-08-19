import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, CheckCircle2, ShieldCheck, Wallet, Sparkles, Key } from 'lucide-react';

export default function LoginView({ onLoginSuccess, onNavigate, onConnectWalletClick }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Simulated Google Authentication Handler
  const handleGoogleAuth = () => {
    setGoogleLoading(true);
    setTimeout(() => {
      setGoogleLoading(false);
      const googleUser = {
        name: 'Aditya Singh',
        email: 'aditya.singh.dev@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        provider: 'Google OAuth 2.0',
        role: 'Senior Legal Officer',
        verified: true
      };
      onLoginSuccess(googleUser);
    }, 800);
  };

  // Standard Email/Password Handler
  const handleEmailAuth = (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoggingIn(true);
    setTimeout(() => {
      setIsLoggingIn(false);
      const emailUser = {
        name: fullName || email.split('@')[0],
        email: email,
        avatar: null,
        provider: 'Email & Pass',
        role: 'Vault Administrator',
        verified: true
      };
      onLoginSuccess(emailUser);
    }, 600);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center items-center p-6 bg-gradient-to-b from-indigo-50/40 via-white to-slate-50 relative overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl opacity-60 animate-pulse pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl opacity-60 animate-pulse pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Card Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-200">
            <Shield className="w-9 h-9" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-slate-900">
              {isSignUp ? 'Create Legal eVault Account' : 'Welcome to Legal eVault'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {isSignUp ? 'Register to manage encrypted documents on-chain' : 'Sign in to access your secure document repository'}
            </p>
          </div>
        </div>

        {/* Main Auth Card */}
        <div className="p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xl space-y-6">
          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleAuth}
            disabled={googleLoading}
            className="w-full py-3.5 px-4 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-2xl text-xs font-bold text-slate-700 shadow-sm transition-all flex items-center justify-center gap-3 group active:scale-[0.99] disabled:opacity-50"
          >
            {googleLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
                Authenticating with Google...
              </span>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-slate-100" />
            <span className="absolute bg-white px-3 text-[10px] uppercase font-bold tracking-widest text-slate-400">
              Or Sign In with Email
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isSignUp && (
              <div className="space-y-1 text-xs">
                <label className="font-bold text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aditya Singh"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                />
              </div>
            )}

            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-700">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <label className="font-bold text-slate-700">Password</label>
                {!isSignUp && (
                  <button type="button" className="text-[11px] text-indigo-600 font-bold hover:underline">
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md shadow-indigo-100 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
            >
              {isLoggingIn ? 'Verifying Credentials...' : isSignUp ? 'Create Account' : 'Sign In to Vault'}
              {!isLoggingIn && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Web3 Wallet Quick Access */}
          <div className="pt-2 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={onConnectWalletClick}
              className="text-xs text-amber-700 font-bold hover:text-amber-800 flex items-center justify-center gap-1.5 mx-auto"
            >
              <Wallet className="w-4 h-4 text-amber-500" /> Sign In with Web3 Wallet Instead
            </button>
          </div>
        </div>

        {/* Card Footer Toggle */}
        <div className="text-center text-xs text-slate-500">
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <button onClick={() => setIsSignUp(false)} className="text-indigo-600 font-bold hover:underline">
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account yet?{' '}
              <button onClick={() => setIsSignUp(true)} className="text-indigo-600 font-bold hover:underline">
                Register Now
              </button>
            </p>
          )}
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>OAuth 2.0 & Zero-Knowledge Cryptographic Auth Enabled</span>
        </div>
      </div>
    </div>
  );
}
