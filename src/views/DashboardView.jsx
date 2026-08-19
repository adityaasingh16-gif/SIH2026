import React from 'react';
import { 
  FileText, 
  ShieldCheck, 
  HardDrive, 
  Users, 
  Upload, 
  ArrowUpRight, 
  CheckCircle2, 
  Sparkles,
  Trash2
} from 'lucide-react';

export default function DashboardView({ onNavigate, documents, wallet, nodes, onSelectDocument, onDeleteDocument }) {
  const verifiedCount = documents.filter(d => d.status === 'Verified').length;
  const storageEstimate = (documents.length * 8.5).toFixed(1);
  const healthyNodesCount = nodes.filter(n => n.status === 'Healthy').length;

  const stats = [
    { title: 'Total Vaulted Documents', value: documents.length.toLocaleString(), change: `+${documents.length} registered`, icon: FileText, color: 'from-blue-500 to-indigo-600', badgeBg: 'bg-indigo-50 text-indigo-700' },
    { title: 'Cryptographically Verified', value: verifiedCount.toLocaleString(), change: `${((verifiedCount / (documents.length || 1)) * 100).toFixed(1)}% Integrity Rate`, icon: ShieldCheck, color: 'from-emerald-500 to-teal-600', badgeBg: 'bg-emerald-50 text-emerald-700' },
    { title: 'IPFS Pinning Storage', value: `${storageEstimate} MB`, change: 'Distributed Cluster', icon: HardDrive, color: 'from-purple-500 to-indigo-600', badgeBg: 'bg-purple-50 text-purple-700' },
    { title: 'Infrastructure Nodes', value: `${healthyNodesCount} / ${nodes.length}`, change: 'Healthy Cluster', icon: Users, color: 'from-amber-500 to-orange-600', badgeBg: 'bg-amber-50 text-amber-700' },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white shadow-lg shadow-indigo-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" /> High Integrity Workspace
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold">Welcome back, Legal Administrator</h2>
          <p className="text-indigo-100 text-xs md:text-sm max-w-xl">
            Connected to <strong className="text-white font-bold">{wallet.network}</strong> using account <span className="font-mono text-white">{wallet.address.substring(0, 6)}...{wallet.address.substring(wallet.address.length - 4)}</span>.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => onNavigate('upload-document')}
            className="flex-1 md:flex-none px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" /> Upload Document
          </button>
          <button
            onClick={() => onNavigate('verify')}
            className="flex-1 md:flex-none px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" /> Verify Hash
          </button>
        </div>
      </div>

      {/* Dynamic Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.title}</span>
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-sm`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight mb-2">{stat.value}</div>
                <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${stat.badgeBg}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Documents Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recent Vault Activity</h3>
            <p className="text-xs text-slate-500">Real-time status of cryptographic proofs registered in your vault</p>
          </div>
          <button
            onClick={() => onNavigate('my-vault')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 self-start sm:self-auto"
          >
            View All ({documents.length}) <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                <th className="py-3 px-4">Document Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Cryptographic Hash</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {documents.slice(0, 5).map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-4 font-semibold text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      <FileText className="w-4 h-4" />
                    </div>
                    {doc.title}
                  </td>
                  <td className="py-4 px-4 text-slate-600">{doc.category}</td>
                  <td className="py-4 px-4 font-mono text-[11px] text-slate-500">{doc.hash.substring(0, 14)}...</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3" /> {doc.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-500 font-mono text-[11px]">{doc.timestamp}</td>
                  <td className="py-4 px-4 text-right space-x-2">
                    <button
                      onClick={() => onSelectDocument(doc.id)}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold text-[11px] transition-colors"
                    >
                      Inspect
                    </button>
                    <button
                      onClick={() => onDeleteDocument(doc.id)}
                      className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                      title="Delete Document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
