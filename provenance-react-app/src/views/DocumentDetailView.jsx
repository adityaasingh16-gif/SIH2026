import React, { useState } from 'react';
import { Download, CheckCircle2, Share2, Award, UserCheck, Plus, Edit3, Trash2, Code, Copy, Check } from 'lucide-react';

export default function DocumentDetailView({
  document,
  documents,
  wallet,
  onSelectDocument,
  onUpdateDocument,
  onAddTimelineEvent,
  onDeleteDocument
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(document?.title || '');
  const [jurisdiction, setJurisdiction] = useState(document?.jurisdiction || '');
  const [confidentiality, setConfidentiality] = useState(document?.confidentiality || '');

  // Add Timeline Event state
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newActorName, setNewActorName] = useState(wallet?.address || '');

  const [copiedJson, setCopiedJson] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);

  if (!document) return null;

  const handleSaveDocMetadata = (e) => {
    e.preventDefault();
    onUpdateDocument(document.id, { title, jurisdiction, confidentiality });
    setIsEditing(false);
  };

  const handleCreateTimelineEvent = (e) => {
    e.preventDefault();
    if (newEventTitle.trim()) {
      onAddTimelineEvent(document.id, newEventTitle.trim(), newActorName);
      setNewEventTitle('');
      setShowAddEvent(false);
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(document, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      {/* Selector & Editing Controls */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Target Document:</span>
          <select
            value={document.id}
            onChange={(e) => {
              onSelectDocument(e.target.value);
              setIsEditing(false);
            }}
            className="w-full sm:w-64 px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-900 cursor-pointer"
          >
            {documents.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.title} ({doc.id})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setTitle(document.title);
              setJurisdiction(document.jurisdiction);
              setConfidentiality(document.confidentiality);
              setIsEditing(!isEditing);
            }}
            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" /> {isEditing ? 'Cancel Edit' : 'Edit Metadata'}
          </button>

          <button
            onClick={() => setShowRawJson(!showRawJson)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Code className="w-3.5 h-3.5" /> JSON
          </button>

          <button
            onClick={() => onDeleteDocument(document.id)}
            className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl transition-colors"
            title="Delete Document"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Raw JSON Modal/Collapse */}
      {showRawJson && (
        <div className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-2xl relative shadow-inner space-y-2">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-slate-400 text-[10px]">
            <span>DOCUMENT CERTIFICATE OBJECT (JSON)</span>
            <button onClick={handleCopyJson} className="flex items-center gap-1 text-white hover:text-emerald-400">
              {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedJson ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="overflow-x-auto p-2">{JSON.stringify(document, null, 2)}</pre>
        </div>
      )}

      {/* Dynamic Certificate Banner */}
      <div className="p-8 bg-white rounded-3xl border border-slate-200/80 shadow-md relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-100/60 to-transparent rounded-bl-full pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-200">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" /> Immutable Certificate ({document.status})
              </div>
              <h2 className="text-2xl font-display font-bold text-slate-900">{document.title}</h2>
              <p className="text-xs text-slate-500 font-mono">CID: {document.cid}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={handleCopyJson} className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors">
              <Share2 className="w-4 h-4" /> Share Hash
            </button>
            <button onClick={handleCopyJson} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-100 transition-colors">
              <Download className="w-4 h-4" /> Export Certificate
            </button>
          </div>
        </div>

        {/* Dynamic Inline Editing Form */}
        {isEditing ? (
          <form onSubmit={handleSaveDocMetadata} className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-200 space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-slate-700">Document Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full mt-1 p-2 bg-white border border-slate-300 rounded-xl font-semibold" />
              </div>
              <div>
                <label className="font-bold text-slate-700">Jurisdiction</label>
                <input type="text" value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value)} className="w-full mt-1 p-2 bg-white border border-slate-300 rounded-xl" />
              </div>
              <div>
                <label className="font-bold text-slate-700">Confidentiality Tier</label>
                <input type="text" value={confidentiality} onChange={(e) => setConfidentiality(e.target.value)} className="w-full mt-1 p-2 bg-white border border-slate-300 rounded-xl" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setIsEditing(false)} className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-xl font-bold">Cancel</button>
              <button type="submit" className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl font-bold">Save Metadata</button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Jurisdiction</span>
              <span className="font-semibold text-slate-800">{document.jurisdiction}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Confidentiality</span>
              <span className="font-semibold text-slate-800">{document.confidentiality}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Block Height</span>
              <span className="font-mono text-indigo-600 text-[11px]">{document.blockNumber}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Authorized Signer</span>
              <span className="font-mono text-slate-800 text-[11px] truncate block">{document.signer}</span>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Timeline Section */}
      <div className="p-8 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">Document Provenance & Audit Timeline</h3>
          <button
            onClick={() => setShowAddEvent(!showAddEvent)}
            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Audit Step
          </button>
        </div>

        {/* Add Event Form */}
        {showAddEvent && (
          <form onSubmit={handleCreateTimelineEvent} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder="Audit event (e.g. Approved by Legal Team)..."
                className="p-2.5 bg-white border border-slate-300 rounded-xl font-semibold"
              />
              <input
                type="text"
                value={newActorName}
                onChange={(e) => setNewActorName(e.target.value)}
                placeholder="Actor name or wallet address..."
                className="p-2.5 bg-white border border-slate-300 rounded-xl"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowAddEvent(false)} className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-xl font-bold">Cancel</button>
              <button type="submit" className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl font-bold">Record Event</button>
            </div>
          </form>
        )}

        <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {document.timeline?.map((evt, idx) => (
            <div key={evt.id || idx} className="relative flex items-start gap-4 group">
              <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full ${evt.color || 'bg-indigo-600'} ring-4 ring-white shadow-sm flex items-center justify-center`} />
              <div className="flex-1 bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">{evt.title}</h4>
                  <span className="text-[11px] font-mono text-slate-400">{evt.time}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Executed by: <strong className="text-slate-700">{evt.actor}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
