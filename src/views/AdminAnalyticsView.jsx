import React, { useState } from 'react';
import { BarChart3, Activity, HardDrive, ShieldAlert, Plus, Trash2, RefreshCw } from 'lucide-react';

export default function AdminAnalyticsView({
  documentsCount,
  auditLogs,
  nodes,
  onToggleNodeStatus,
  onAddLog,
  onClearLogs
}) {
  const [newEventText, setNewEventText] = useState('');

  const handleSimulateLog = (e) => {
    e.preventDefault();
    if (!newEventText) return;

    onAddLog({
      id: `LOG-${9405 + auditLogs.length}`,
      event: newEventText,
      user: 'Manual Audit Trigger',
      time: 'Just now',
      severity: 'Info'
    });
    setNewEventText('');
  };

  const healthyNodesCount = nodes.filter(n => n.status === 'Healthy').length;
  const avgLatency = Math.round(nodes.reduce((acc, n) => acc + n.latency, 0) / (nodes.length || 1));

  const metrics = [
    { title: '24h Tx Volume', value: (14890 + documentsCount * 12).toLocaleString(), change: '+18.4%', icon: BarChart3, color: 'from-blue-500 to-indigo-600' },
    { title: 'Avg Node Latency', value: `${avgLatency} ms`, change: 'Optimal', icon: Activity, color: 'from-emerald-500 to-teal-600' },
    { title: 'Cluster Storage', value: `${(42.8 + documentsCount * 8.5).toFixed(1)} MB`, change: 'Pinned to IPFS', icon: HardDrive, color: 'from-purple-500 to-indigo-600' },
    { title: 'Active Node Cluster', value: `${healthyNodesCount} / ${nodes.length}`, change: 'Healthy', icon: ShieldAlert, color: 'from-amber-500 to-orange-600' },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">System Admin & Audit Analytics</h2>
        <p className="text-xs text-slate-500">Monitor cryptographic throughput, node health, and tamper-detection telemetry</p>
      </div>

      {/* Dynamic Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{m.title}</span>
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${m.color} text-white shadow-sm`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-slate-900 mb-1">{m.value}</div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">{m.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Add Log & Audit Section */}
      <form onSubmit={handleSimulateLog} className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center">
        <input
          type="text"
          value={newEventText}
          onChange={(e) => setNewEventText(e.target.value)}
          placeholder="Trigger custom audit log event (e.g., Key rotation, Node sync)..."
          className="flex-1 w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
        />
        <button
          type="submit"
          className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Trigger Audit Event
        </button>
      </form>

      {/* Dynamic Node Status & Live Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Nodes Health Manager */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Infrastructure Nodes</h3>
            <span className="text-[10px] text-slate-400 font-mono">Click node to toggle status</span>
          </div>

          <div className="space-y-3">
            {nodes.map((n) => (
              <div
                key={n.id}
                onClick={() => onToggleNodeStatus(n.id)}
                className="p-4 bg-slate-50 hover:bg-slate-100/80 cursor-pointer rounded-2xl border border-slate-100 flex items-center justify-between text-xs transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900">{n.name}</div>
                  <div className="text-slate-400 text-[11px]">{n.region}</div>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <div className="font-mono text-slate-700">{n.latency}ms</div>
                    <div className="text-[10px] text-slate-400">Uptime: {n.uptime}</div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                    n.status === 'Healthy' ? 'bg-emerald-100 text-emerald-800' :
                    n.status === 'Degraded' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {n.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic System Audit Log */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">System Audit Trail</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                {auditLogs.length} Events
              </span>
              <button onClick={onClearLogs} className="p-1 text-slate-400 hover:text-red-600" title="Clear Logs">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {auditLogs.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No audit log entries recorded</p>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{log.event}</div>
                    <div className="text-slate-400 text-[11px] font-mono">{log.id} • {log.user}</div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{log.time}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
