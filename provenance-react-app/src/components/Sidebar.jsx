import React from 'react';
import { 
  LayoutDashboard, 
  Upload, 
  Archive, 
  ShieldCheck, 
  FileText, 
  BarChart3, 
  Sparkles,
  Shield,
  LogIn,
  LogOut
} from 'lucide-react';

export default function Sidebar({ currentView, setCurrentView, documentsCount, user, onSignOut }) {
  const navItems = [
    { id: 'landing', label: 'Overview', icon: Sparkles },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-vault', label: 'My Vault', icon: Archive, badge: documentsCount },
    { id: 'upload-document', label: 'Upload Document', icon: Upload },
    { id: 'verify', label: 'Verify Integrity', icon: ShieldCheck },
    { id: 'document-detail', label: 'Document Detail', icon: FileText },
    { id: 'admin-analytics', label: 'Admin Analytics', icon: BarChart3 },
    { id: 'login', label: user ? 'Account Details' : 'Sign In / Register', icon: LogIn },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-white text-slate-700 z-50 flex flex-col border-r border-slate-200 shadow-sm">
      {/* Brand Logo Header */}
      <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-100 bg-gradient-to-r from-indigo-50/50 via-white to-white">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-200">
          <Shield className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <span className="font-display font-bold text-lg tracking-wider text-slate-900 leading-tight">PROVENANCE</span>
          <span className="text-[10px] font-mono font-medium uppercase tracking-widest text-indigo-600">Legal eVault</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 py-6 px-4 flex flex-col gap-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Platform Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left text-sm font-medium ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-200 font-semibold translate-x-0.5'
                  : 'text-slate-600 hover:bg-indigo-50/80 hover:text-indigo-700'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`} />
              <span className="flex-1">{item.label}</span>
              {item.badge !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-800'
                }`}>
                  {item.badge}
                </span>
              )}
              {isActive && item.badge === undefined && (
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User Info & Sign Out Footer */}
      {user && (
        <div className="p-3 mx-4 mb-2 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-200" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                {user.name ? user.name[0] : 'U'}
              </div>
            )}
            <div className="truncate">
              <div className="text-xs font-bold text-slate-900 truncate">{user.name}</div>
              <div className="text-[10px] text-slate-500 truncate">{user.email}</div>
            </div>
          </div>
          <button
            onClick={onSignOut}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Dynamic Network Footer Status Badge */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/60">
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping opacity-75" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-emerald-900">Polygon POS Network</span>
            <span className="text-[10px] font-mono text-emerald-700">100% Operational • Live</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
