import React, { useState } from 'react';
import { FileText, Search, Grid, List, CheckCircle2, Trash2, Edit3, Plus, X } from 'lucide-react';

export default function MyVaultView({
  documents,
  categories,
  globalSearch,
  onAddCategory,
  onNavigate,
  onSelectDocument,
  onUpdateDocument,
  onDeleteDocument
}) {
  const [searchTerm, setSearchTerm] = useState(globalSearch || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('list');
  const [showNewCatInput, setShowNewCatInput] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  // Editing state
  const [editingDoc, setEditingDoc] = useState(null);

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || doc.hash.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddCategorySubmit = (e) => {
    e.preventDefault();
    if (newCatName.trim()) {
      onAddCategory(newCatName.trim());
      setNewCatName('');
      setShowNewCatInput(false);
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (editingDoc) {
      onUpdateDocument(editingDoc.id, editingDoc);
      setEditingDoc(null);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto relative">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">eVault Document Repository</h2>
          <p className="text-xs text-slate-500">Showing <strong className="text-indigo-600">{filteredDocs.length} of {documents.length}</strong> cryptographically registered legal assets</p>
        </div>

        <button
          onClick={() => onNavigate('upload-document')}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md shadow-indigo-100 transition-all self-start md:self-auto"
        >
          + Add New Document
        </button>
      </div>

      {/* Dynamic Filter & Search Bar */}
      <div className="p-4 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Tabs & Add Category */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedCategory === 'All' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>All</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${selectedCategory === 'All' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {documents.length}
            </span>
          </button>

          {categories.map((cat) => {
            const count = documents.filter(d => d.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  selectedCategory === cat ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{cat}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${selectedCategory === cat ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {count}
                </span>
              </button>
            );
          })}

          {showNewCatInput ? (
            <form onSubmit={handleAddCategorySubmit} className="flex items-center gap-1">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="New Category..."
                className="px-3 py-1.5 text-xs bg-slate-50 border border-indigo-300 rounded-xl focus:outline-none text-slate-800"
                autoFocus
              />
              <button type="submit" className="p-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold">Add</button>
              <button type="button" onClick={() => setShowNewCatInput(false)} className="p-1.5 text-slate-400"><X className="w-4 h-4" /></button>
            </form>
          ) : (
            <button
              onClick={() => setShowNewCatInput(true)}
              className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              title="Create Custom Category"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search & Layout Toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or hash..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
            />
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* List / Grid View */}
      {viewMode === 'list' ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                  <th className="py-4 px-6">Document Title</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Cryptographic SHA-256</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Jurisdiction</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div>{doc.title}</div>
                        <div className="text-[10px] text-slate-400 font-mono font-normal">ID: {doc.id}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium">{doc.category}</td>
                    <td className="py-4 px-6 font-mono text-[11px] text-slate-500">{doc.hash}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" /> {doc.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500">{doc.jurisdiction}</td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => onSelectDocument(doc.id)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold text-[11px] transition-colors"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => setEditingDoc(doc)}
                        className="p-1.5 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteDocument(doc.id)}
                        className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <div key={doc.id} className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setEditingDoc(doc)} className="p-1 text-slate-400 hover:text-indigo-600"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => onDeleteDocument(doc.id)} className="p-1 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900 mb-1">{doc.title}</h4>
                <p className="text-xs text-slate-500 mb-2">{doc.category}</p>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 font-mono text-[10px] text-slate-500 truncate">
                  Hash: {doc.hash}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">{doc.timestamp}</span>
                <button
                  onClick={() => onSelectDocument(doc.id)}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl font-bold text-xs shadow-sm hover:bg-indigo-700 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dynamic Edit Document Modal */}
      {editingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm p-4">
          <form onSubmit={handleSaveEdit} className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Edit Document ({editingDoc.id})</h3>
              <button type="button" onClick={() => setEditingDoc(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Document Title</label>
                <input
                  type="text"
                  value={editingDoc.title}
                  onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
                  className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Category</label>
                <select
                  value={editingDoc.category}
                  onChange={(e) => setEditingDoc({ ...editingDoc, category: e.target.value })}
                  className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700">Jurisdiction</label>
                <input
                  type="text"
                  value={editingDoc.jurisdiction}
                  onChange={(e) => setEditingDoc({ ...editingDoc, jurisdiction: e.target.value })}
                  className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditingDoc(null)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs shadow-md">Save Changes</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
