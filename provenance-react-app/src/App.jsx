import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ConnectWalletModal from './components/ConnectWalletModal';

import LandingView from './views/LandingView';
import DashboardView from './views/DashboardView';
import MyVaultView from './views/MyVaultView';
import UploadDocumentView from './views/UploadDocumentView';
import VerifyDocumentView from './views/VerifyDocumentView';
import DocumentDetailView from './views/DocumentDetailView';
import AdminAnalyticsView from './views/AdminAnalyticsView';
import LoginView from './views/LoginView';
import { checkBackendHealth, fetchAllDocumentsFromBackend } from './services/api';

// Maps a backend Document record (Mongo schema) onto the shape the UI
// components already expect (id, title, hash, cid, timeline, ...).
function mapBackendDocToUiDoc(doc) {
  return {
    id: doc.documentId,
    title: `${doc.documentType?.toUpperCase() || 'RECORD'} — ${doc.caseId}`,
    category:
      doc.documentType === 'deed' ? 'Deeds & Land' :
      doc.documentType === 'contract' ? 'Commercial Contracts' :
      doc.documentType === 'evidence' ? 'Regulatory Compliance' : 'Identity & IP',
    hash: doc.currentHash,
    cid: doc.ipfsCID,
    blockNumber: doc.blockNumber || 'Pending',
    status: doc.status === 'finalized' ? 'Verified' : doc.status,
    jurisdiction: doc.jurisdiction,
    confidentiality: doc.isSensitive ? 'Secret / Restricted' : 'Confidential',
    timestamp: doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' UTC' : 'Unknown',
    fileSize: 'On IPFS',
    fileType: 'application/octet-stream',
    signer: doc.issuerId,
    timeline: [
      { id: 1, title: `Registered by ${doc.issuerRole} (${doc.issuerId})`, actor: doc.issuerId, time: doc.createdAt ? new Date(doc.createdAt).toLocaleString() : '', color: 'bg-emerald-500' },
      ...(doc.previousHash ? [{ id: 2, title: `Amended — version ${doc.version}, linked to previous hash`, actor: doc.issuerId, time: '', color: 'bg-indigo-600' }] : [])
    ],
    fromBackend: true
  };
}

export default function App() {
  // START ON LOGIN PAGE BY DEFAULT
  const [currentView, setCurrentView] = useState('login');
  const [globalSearch, setGlobalSearch] = useState('');

  // INITIALIZE USER SESSION AS NULL (REQUIRES SIGN-IN FIRST)
  const [user, setUser] = useState(null);

  // Dynamic Wallet State
  const [wallet, setWallet] = useState({
    address: '0x71C7656EC7ab88b098defB751B7401B5f6d839A2',
    network: 'Polygon POS Mainnet',
    chainId: 137,
    balance: '14.85 MATIC',
    isConnected: true
  });
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  // Dynamic Categories
  const [categories, setCategories] = useState([
    'Commercial Contracts',
    'Deeds & Land',
    'Identity & IP',
    'Regulatory Compliance'
  ]);

  // Dynamic Selected Document
  const [selectedDocId, setSelectedDocId] = useState('DOC-1001');

  // Dynamic Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Authentication Required', desc: 'Please sign in to access encrypted document repository', time: 'Just now', read: false },
    { id: 2, title: 'Network Online', desc: 'Polygon POS Mainnet node operational', time: '5m ago', read: false }
  ]);

  // Master Dynamic Documents Collection
  const [documents, setDocuments] = useState([
    {
      id: 'DOC-1001',
      title: 'Commercial Land Registry Deed #4829',
      category: 'Deeds & Land',
      hash: '0xe8a92b109f83a4182b8c9d412093847291a0c7e5',
      cid: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
      blockNumber: '19,842,019',
      status: 'Verified',
      jurisdiction: 'High Court of London',
      confidentiality: 'Secret / Restricted',
      timestamp: '14 Aug 2026, 11:24:08 UTC',
      fileSize: '4.2 MB',
      fileType: 'application/pdf',
      signer: '0x71C7656EC7ab88b098defB751B7401B5f6d839A2',
      timeline: [
        { id: 1, title: 'Document Created & Local SHA-256 Hashed', actor: 'Legal Counsel (Client)', time: '14 Aug 2026, 10:15:00 UTC', color: 'bg-emerald-500' },
        { id: 2, title: 'AES-256 Encryption & IPFS Pinning', actor: 'Pinata Cluster node-04', time: '14 Aug 2026, 10:18:22 UTC', color: 'bg-emerald-500' },
        { id: 3, title: 'Smart Contract Anchor Call (Polygon POS)', actor: '0x71C7...39A2', time: '14 Aug 2026, 11:24:08 UTC', color: 'bg-indigo-600' },
        { id: 4, title: 'Multi-Sig Verification Approval', actor: 'Court Registrar Registry', time: '14 Aug 2026, 14:02:11 UTC', color: 'bg-amber-500' }
      ]
    },
    {
      id: 'DOC-1002',
      title: 'Global Master Services Agreement (MSA)',
      category: 'Commercial Contracts',
      hash: '0x9f83a4182b8c9d412093847291a0c7e5e8a92b10',
      cid: 'QmY8ZkL82NnFwK3p9LmMx4v1q8Z7RtP6Bs2YqW4vE8Nn',
      blockNumber: '19,840,112',
      status: 'Verified',
      jurisdiction: 'Supreme Court of New York',
      confidentiality: 'Confidential',
      timestamp: '12 Aug 2026, 09:14:20 UTC',
      fileSize: '1.8 MB',
      fileType: 'application/pdf',
      signer: '0x71C7656EC7ab88b098defB751B7401B5f6d839A2',
      timeline: [
        { id: 1, title: 'Agreement Drafted & Hashed', actor: 'Corporate Legal Team', time: '12 Aug 2026, 08:30:00 UTC', color: 'bg-emerald-500' },
        { id: 2, title: 'On-Chain Smart Contract Registration', actor: '0x71C7...39A2', time: '12 Aug 2026, 09:14:20 UTC', color: 'bg-indigo-600' }
      ]
    },
    {
      id: 'DOC-1003',
      title: 'Intellectual Property Assignment Deed',
      category: 'Identity & IP',
      hash: '0x4182b8c9d412093847291a0c7e5e8a92b109f83a',
      cid: 'QmA7Xp9W3nL5vR8q2YtB6Bs4vC9N1mZ8P3vE7R2N4mL',
      blockNumber: '19,835,901',
      status: 'Verified',
      jurisdiction: 'Federal Court of Australia',
      confidentiality: 'Secret / Restricted',
      timestamp: '10 Aug 2026, 16:45:10 UTC',
      fileSize: '3.1 MB',
      fileType: 'application/pdf',
      signer: '0x82A1656EC7ab88b098defB751B7401B5f6d839D1',
      timeline: [
        { id: 1, title: 'IP Patent Hash Generated', actor: 'IP Attorney', time: '10 Aug 2026, 15:00:00 UTC', color: 'bg-emerald-500' },
        { id: 2, title: 'Anchored to Blockchain Ledger', actor: '0x82A1...94D1', time: '10 Aug 2026, 16:45:10 UTC', color: 'bg-indigo-600' }
      ]
    },
    {
      id: 'DOC-1004',
      title: 'Corporate Articles of Incorporation',
      category: 'Regulatory Compliance',
      hash: '0x847291a0c7e5e8a92b109f83a4182b8c9d412093',
      cid: 'QmZ9V1nL3mR7vC5p2Yb8Bs6vE4N9mP1vR3E8N2mL4mX',
      blockNumber: '19,820,445',
      status: 'Verified',
      jurisdiction: 'Delaware Chancery Court',
      confidentiality: 'Public / Unrestricted',
      timestamp: '08 Aug 2026, 14:10:05 UTC',
      fileSize: '6.5 MB',
      fileType: 'application/pdf',
      signer: '0x71C7656EC7ab88b098defB751B7401B5f6d839A2',
      timeline: [
        { id: 1, title: 'Filing Verified & Hashed', actor: 'State Registry Officer', time: '08 Aug 2026, 14:10:05 UTC', color: 'bg-emerald-500' }
      ]
    },
    {
      id: 'DOC-1005',
      title: 'Confidentiality & Non-Disclosure Agreement',
      category: 'Commercial Contracts',
      hash: '0xc7e5e8a92b109f83a4182b8c9d412093847291a0',
      cid: 'QmR4X7nL2mV5vC9p8Yb3Bs1vE6N4mP7vR9E2N1mL5mY',
      blockNumber: '19,812,090',
      status: 'Verified',
      jurisdiction: 'High Court of Singapore',
      confidentiality: 'Confidential',
      timestamp: '05 Aug 2026, 18:22:00 UTC',
      fileSize: '0.9 MB',
      fileType: 'application/pdf',
      signer: '0x71C7656EC7ab88b098defB751B7401B5f6d839A2',
      timeline: [
        { id: 1, title: 'NDA Signed & Registered', actor: 'Executive Officer', time: '05 Aug 2026, 18:22:00 UTC', color: 'bg-emerald-500' }
      ]
    }
  ]);

  // Master Dynamic System Audit Logs
  const [auditLogs, setAuditLogs] = useState([
    { id: 'LOG-9402', event: 'Smart Contract Ownership Re-anchored', user: 'Admin (0x71C7...39A2)', time: '10 mins ago', severity: 'Info' },
    { id: 'LOG-9401', event: 'IPFS Cluster Garbage Collection', user: 'System Worker', time: '42 mins ago', severity: 'Low' },
    { id: 'LOG-9400', event: 'Vault Document Uploaded (Deed #4829)', user: 'Counsel User', time: '1 hour ago', severity: 'Info' },
  ]);

  // Master Dynamic Infrastructure Nodes
  const [nodes, setNodes] = useState([
    { id: 'n1', name: 'Polygon POS Mainnet Gateway #1', region: 'us-east (N. Virginia)', status: 'Healthy', latency: 42, uptime: '99.99%' },
    { id: 'n2', name: 'IPFS Pinning Cluster Alpha', region: 'eu-west (Frankfurt)', status: 'Healthy', latency: 88, uptime: '99.95%' },
    { id: 'n3', name: 'Arweave Permanent Storage Bridge', region: 'ap-southeast (Singapore)', status: 'Healthy', latency: 112, uptime: '100%' },
    { id: 'n4', name: 'Multi-Sig Key Manager Service', region: 'us-west (Oregon)', status: 'Healthy', latency: 38, uptime: '99.98%' },
  ]);

  // Backend Connectivity State
  const [backendStatus, setBackendStatus] = useState('checking'); // checking | online | offline

  // On mount: check backend health, then pull real documents if available.
  // Falls back silently to the local mock dataset above if the API/DB is offline —
  // so the app remains fully demoable even without the backend running.
  useEffect(() => {
    (async () => {
      const health = await checkBackendHealth();
      if (health && health.status === 'ONLINE') {
        setBackendStatus('online');
        const result = await fetchAllDocumentsFromBackend();
        if (result && result.success && result.documents && result.documents.length > 0) {
          const liveDocs = result.documents.map(mapBackendDocToUiDoc);
          setDocuments(prev => {
            const existingIds = new Set(liveDocs.map(d => d.id));
            return [...liveDocs, ...prev.filter(d => !existingIds.has(d.id))];
          });
        }
      } else {
        setBackendStatus('offline');
      }
    })();
  }, []);

  // Dynamic Auth Callbacks
  const handleLoginSuccess = (authUser) => {
    setUser(authUser);
    setAuditLogs(prev => [
      {
        id: `LOG-${9403 + prev.length}`,
        event: `User Authenticated via ${authUser.provider} (${authUser.email})`,
        user: authUser.email,
        time: 'Just now',
        severity: 'Info'
      },
      ...prev
    ]);
    setNotifications(prev => [
      { id: Date.now(), title: 'Authentication Successful', desc: `Signed in as ${authUser.email}`, time: 'Just now', read: false },
      ...prev
    ]);
    // REDIRECT TO DASHBOARD ON LOGIN SUCCESS
    setCurrentView('dashboard');
  };

  const handleSignOut = () => {
    setUser(null);
    setNotifications(prev => [
      { id: Date.now(), title: 'Signed Out', desc: 'Session ended successfully', time: 'Just now', read: false },
      ...prev
    ]);
    // REDIRECT BACK TO LOGIN ON SIGN OUT
    setCurrentView('login');
  };

  // Add Document Callback
  const handleAddDocument = (newDoc) => {
    const docId = `DOC-${1000 + documents.length + 1}`;
    const fullDoc = {
      id: docId,
      ...newDoc,
      signer: wallet.address
    };

    setDocuments(prev => [fullDoc, ...prev]);
    setSelectedDocId(docId);

    setNotifications(prev => [
      { id: Date.now(), title: 'New Document Vaulted', desc: `${newDoc.title} registered on-chain`, time: 'Just now', read: false },
      ...prev
    ]);

    setAuditLogs(prev => [
      {
        id: `LOG-${9403 + prev.length}`,
        event: `New Vault Document Registered (${newDoc.title})`,
        user: user ? user.email : wallet.address,
        time: 'Just now',
        severity: 'Info'
      },
      ...prev
    ]);
  };

  // Update Document Callback
  const handleUpdateDocument = (id, updatedFields) => {
    setDocuments(prev => prev.map(doc => doc.id === id ? { ...doc, ...updatedFields } : doc));
  };

  // Delete Document Callback
  const handleDeleteDocument = (id) => {
    const targetDoc = documents.find(d => d.id === id);
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    if (selectedDocId === id && documents.length > 1) {
      const remaining = documents.filter(doc => doc.id !== id);
      setSelectedDocId(remaining[0].id);
    }
  };

  // Timeline Event Callback
  const handleAddTimelineEvent = (docId, eventTitle, actorName) => {
    const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' UTC';
    setDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        const newEvt = {
          id: Date.now(),
          title: eventTitle,
          actor: actorName || (user ? user.name : wallet.address),
          time: nowStr,
          color: 'bg-indigo-600'
        };
        return {
          ...doc,
          timeline: [...(doc.timeline || []), newEvt]
        };
      }
      return doc;
    }));
  };

  const handleSelectDocument = (id) => {
    setSelectedDocId(id);
    setCurrentView('document-detail');
  };

  const selectedDocument = documents.find(d => d.id === selectedDocId) || documents[0];

  const renderView = () => {
    switch (currentView) {
      case 'login':
        return (
          <LoginView
            onLoginSuccess={handleLoginSuccess}
            onNavigate={(view) => setCurrentView(view)}
            onConnectWalletClick={() => setIsWalletModalOpen(true)}
          />
        );
      case 'landing':
        return (
          <LandingView
            documentsCount={documents.length}
            wallet={wallet}
            user={user}
            onConnectWalletClick={() => setIsWalletModalOpen(true)}
            onExploreClick={() => setCurrentView(user ? 'dashboard' : 'login')}
          />
        );
      case 'dashboard':
        return (
          <DashboardView
            documents={documents}
            wallet={wallet}
            user={user}
            nodes={nodes}
            onNavigate={(view) => setCurrentView(view)}
            onSelectDocument={handleSelectDocument}
            onDeleteDocument={handleDeleteDocument}
          />
        );
      case 'my-vault':
        return (
          <MyVaultView
            documents={documents}
            categories={categories}
            globalSearch={globalSearch}
            onAddCategory={(cat) => setCategories([...categories, cat])}
            onNavigate={(view) => setCurrentView(view)}
            onSelectDocument={handleSelectDocument}
            onUpdateDocument={handleUpdateDocument}
            onDeleteDocument={handleDeleteDocument}
          />
        );
      case 'upload-document':
        return (
          <UploadDocumentView
            categories={categories}
            wallet={wallet}
            user={user}
            onAddDocument={handleAddDocument}
            onNavigate={(view) => setCurrentView(view)}
          />
        );
      case 'verify':
        return (
          <VerifyDocumentView
            documents={documents}
            onAddDocument={handleAddDocument}
            onSelectDocument={handleSelectDocument}
            onNavigate={(view) => setCurrentView(view)}
          />
        );
      case 'document-detail':
        return (
          <DocumentDetailView
            document={selectedDocument}
            documents={documents}
            wallet={wallet}
            user={user}
            onSelectDocument={handleSelectDocument}
            onUpdateDocument={handleUpdateDocument}
            onAddTimelineEvent={handleAddTimelineEvent}
            onDeleteDocument={handleDeleteDocument}
          />
        );
      case 'admin-analytics':
        return (
          <AdminAnalyticsView
            documentsCount={documents.length}
            auditLogs={auditLogs}
            nodes={nodes}
            onToggleNodeStatus={(nodeId) => {
              setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, status: n.status === 'Healthy' ? 'Degraded' : 'Healthy' } : n));
            }}
            onAddLog={(log) => setAuditLogs([log, ...auditLogs])}
            onClearLogs={() => setAuditLogs([])}
          />
        );
      default:
        return (
          <LoginView
            onLoginSuccess={handleLoginSuccess}
            onNavigate={(view) => setCurrentView(view)}
            onConnectWalletClick={() => setIsWalletModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        documentsCount={documents.length}
        user={user}
        onSignOut={handleSignOut}
      />

      {/* Main Workspace Area */}
      <div className="pl-72 flex-1 flex flex-col">
        <Header
          currentView={currentView}
          wallet={wallet}
          user={user}
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
          notifications={notifications}
          setNotifications={setNotifications}
          onConnectWalletClick={() => setIsWalletModalOpen(true)}
          onNavigate={(view) => setCurrentView(view)}
          backendStatus={backendStatus}
        />
        <main className="pt-20 flex-1">
          {renderView()}
        </main>
      </div>

      {/* Connect Wallet Modal */}
      <ConnectWalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        wallet={wallet}
        onSelectWallet={(newAddr, newNet) => {
          setWallet({ ...wallet, address: newAddr, network: newNet || wallet.network, isConnected: true });
          if (!user) {
            // Also log in via Web3 wallet if unauthenticated
            handleLoginSuccess({
              name: `Wallet User (${newAddr.substring(0,6)}...)`,
              email: `${newAddr.substring(0,8)}@web3.eth`,
              avatar: null,
              provider: 'Web3 Wallet',
              role: 'Cryptographic Signer',
              verified: true
            });
          }
        }}
      />
    </div>
  );
}
