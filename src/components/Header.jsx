import React, { useState } from 'react';
import { Wallet, User, Search, Bell, Check, Trash2, LogIn } from 'lucide-react';

export default function Header({
  currentView,
  wallet,
  user,
  globalSearch,
  setGlobalSearch,
  notifications,
  setNotifications,
  onConnectWalletClick,
  onNavigate,
  backendStatus
}) {
  const [showNotifications, setShowNotifications] = useState(false);

  const getPageTitle = (view) => {
    switch (view) {
      case 'landing': return 'Digital Permanence Overview';
      case 'dashboard': return 'Vault Dashboard';
      case 'my-vault': return 'My eVault Repository';
      case 'upload-document': return 'Upload & Encrypt Document';
      case 'verify': return 'Verify Cryptographic Proof';
      case 'document-detail': return 'Document Provenance Certificate';
      case 'admin-analytics': return 'Admin Analytics & Audit Log';
      case 'login': return 'User Authentication & OAuth';
      default: return 'Legal eVault';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <header className="fixed top-0 left-72 right-0 h-20 bg-white/90 backdrop-blur-md z-40 flex items-center justify-between px-8 border-b border-slate-200/80 shadow-sm">
      {/* Dynamic Title */}
      <div className="flex items-center gap-6">
        <h1 className="font-display text-xl font-bold text-slate-900 tracking-tight">
          {getPageTitle(currentView)}
        </h1>
        {backendStatus && (
          <span
            title={backendStatus === 'online' ? 'Connected to Express/MongoDB backend' : backendStatus === 'offline' ? 'Backend unreachable — showing local demo data' : 'Checking backend connection...'}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              backendStatus === 'online' ? 'bg-emerald-100 text-emerald-700' :
              backendStatus === 'offline' ? 'bg-amber-100 text-amber-700' :
              'bg-slate-100 text-slate-500'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${
              backendStatus === 'online' ? 'bg-emerald-500' :
              backendStatus === 'offline' ? 'bg-amber-500' : 'bg-slate-400 animate-pulse'
            }`} />
            {backendStatus === 'online' ? 'Backend Live' : backendStatus === 'offline' ? 'Demo Mode' : 'Connecting...'}
          </span>
        )}
      </div>

      {/* Action Buttons, Notifications, Wallet & Google User Profile */}
      <div className="flex items-center gap-4">
        {/* Dynamic Global Search Input */}
        <div className="relative hidden md:block w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Global search by hash or title..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100/70 border border-slate-200 rounded-full focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
          />
        </div>

        {/* Dynamic Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-full text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-indigo-600 text-white font-bold text-[9px] rounded-full ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-900">Notifications ({notifications.length})</h4>
                <div className="flex items-center gap-2">
                  <button onClick={markAllRead} className="text-[10px] text-indigo-600 hover:underline flex items-center gap-1">
                    <Check className="w-3 h-3" /> Read all
                  </button>
                  <button onClick={clearNotifications} className="text-[10px] text-slate-400 hover:text-red-600">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="space-y-2 mt-3 max-h-60 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No notifications</p>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className={`p-2.5 rounded-xl border text-xs ${n.read ? 'bg-slate-50 border-slate-100' : 'bg-indigo-50/50 border-indigo-100'}`}>
                      <div className="font-bold text-slate-800">{n.title}</div>
                      <div className="text-[11px] text-slate-500">{n.desc}</div>
                      <div className="text-[9px] text-slate-400 font-mono mt-1">{n.time}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Wallet Connect Button */}
        <button
          onClick={onConnectWalletClick}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-full font-sans text-xs font-bold tracking-wide shadow-sm hover:from-amber-600 hover:to-amber-700 transition-all active:scale-95"
        >
          <Wallet className="w-4 h-4" />
          <span>{wallet.address ? `${wallet.address.substring(0, 6)}...${wallet.address.substring(wallet.address.length - 4)}` : 'Connect Wallet'}</span>
        </button>

        {/* Profile Avatar / Login Button */}
        {user ? (
          <button
            onClick={() => onNavigate('login')}
            className="flex items-center gap-2 pl-2 pr-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full border border-slate-200 transition-colors"
          >
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                {user.name ? user.name[0] : 'U'}
              </div>
            )}
            <span className="text-xs font-bold text-slate-800">{user.name.split(' ')[0]}</span>
          </button>
        ) : (
          <button
            onClick={() => onNavigate('login')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <LogIn className="w-4 h-4" /> Sign In
          </button>
        )}
      </div>
    </header>
  );
}
