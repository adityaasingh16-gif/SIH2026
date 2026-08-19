/**
 * ============================================================================
 * GOVERNMENT LEGAL EVAULT - CORE DATA MODELS
 * ============================================================================
 * Mongoose Schemas for Government eVault (Courts, Registrars, Police)
 * Models: Document, CourtOrder, AccessLog, User, PoliceRequest, AnomalyLog
 * Standards Compliance: BSA 2023 Section 63 Evidence Certificate & Tamper Chain
 */

const mongoose = require('mongoose');

// ----------------------------------------------------------------------------
// 1. USER MODEL (Government Personnel with Role & Rank)
// ----------------------------------------------------------------------------
const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, trim: true },
  role: { 
    type: String, 
    required: true, 
    enum: ['judge', 'registrar', 'police', 'admin'] 
  },
  rank: { 
    type: String, 
    enum: ['Inspector/SHO', 'DSP/ACP', 'SP/DCP', 'Presiding Judge', 'Registrar General', 'System Admin'],
    default: 'Inspector/SHO'
  },
  department: { type: String, required: true },
  publicKey: { type: String, required: true }, // Pre-registered Key Registry
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// ----------------------------------------------------------------------------
// 2. DOCUMENT MODEL (Tamper-Evident Version Chain)
// ----------------------------------------------------------------------------
const DocumentSchema = new mongoose.Schema({
  documentId: { type: String, required: true, unique: true, index: true },
  caseId: { type: String, required: true, index: true },
  documentType: { 
    type: String, 
    required: true, 
    enum: ['deed', 'order', 'evidence', 'contract'] 
  },
  currentHash: { type: String, required: true, index: true },
  previousHash: { type: String, default: null }, // Linked version chain for amendments
  version: { type: Number, default: 1 },
  ipfsCID: { type: String, required: true }, // Encrypted blob CID
  encryptedAESKey: { type: String, required: true }, // Envelope encryption key blob
  issuerId: { type: String, required: true },
  issuerRole: { type: String, required: true },
  jurisdiction: { type: String, required: true },
  isSensitive: { type: Boolean, default: false }, // Minors, sexual offences, national security
  status: { 
    type: String, 
    enum: ['draft', 'pending_approval', 'finalized', 'amended', 'archived'], 
    default: 'draft' 
  },
  multiSigRequirements: {
    requiredSignatures: { type: Number, default: 1 },
    collectedSignatures: [{
      signerId: String,
      signerRole: String,
      signature: String,
      signedAt: { type: Date, default: Date.now }
    }]
  }
}, { timestamps: true });

// ----------------------------------------------------------------------------
// 3. COURT ORDER MODEL (Gated Access Authorization)
// ----------------------------------------------------------------------------
const CourtOrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true, index: true },
  judgeId: { type: String, required: true, index: true },
  judgeSignature: { type: String, required: true }, // Cryptographic digital signature
  targetDocumentId: { type: String, required: true, index: true },
  caseId: { type: String, required: true },
  requesterId: { type: String, required: true },
  requesterRole: { type: String, required: true },
  validFrom: { type: Date, default: Date.now },
  validUntil: { type: Date, required: true }, // Hard expiration limit
  purpose: { type: String, required: true },
  onChainHash: { type: String, required: true }, // Hash anchored on Hyperledger Fabric
  isRevoked: { type: Boolean, default: false }
}, { timestamps: true });

// ----------------------------------------------------------------------------
// 4. ACCESS LOG MODEL (Immutable Audit Trail)
// ----------------------------------------------------------------------------
const AccessLogSchema = new mongoose.Schema({
  logId: { type: String, required: true, unique: true, index: true },
  documentId: { type: String, required: true, index: true },
  accessedBy: { type: String, required: true },
  role: { type: String, required: true },
  orderId: { type: String, default: null }, // Mandatory reference for court-gated access
  ipAddress: { type: String, required: true },
  result: { type: String, enum: ['granted', 'denied'], required: true },
  denialReason: { type: String, default: null },
  timestamp: { type: Date, default: Date.now }
});

// ----------------------------------------------------------------------------
// 5. POLICE REQUEST MODEL (Rank-Tiered Multi-Signature Approval)
// ----------------------------------------------------------------------------
const PoliceRequestSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true },
  caseId: { type: String, required: true },
  targetDocumentId: { type: String, required: true },
  initiatorId: { type: String, required: true }, // Inspector / SHO
  category: { type: String, enum: ['standard', 'sensitive'], default: 'standard' },
  signatures: {
    inspector: { signerId: String, signature: String, timestamp: Date },
    dspAcp: { signerId: String, signature: String, timestamp: Date }, // DSP/ACP co-sign
    spDcp: { signerId: String, signature: String, timestamp: Date }   // SP/DCP co-sign for sensitive
  },
  status: { type: String, enum: ['pending_dsp', 'pending_sp', 'approved', 'rejected'], default: 'pending_dsp' }
}, { timestamps: true });

// ----------------------------------------------------------------------------
// 6. ANOMALY LOG MODEL (Rule-based Fraud Detection)
// ----------------------------------------------------------------------------
const AnomalyLogSchema = new mongoose.Schema({
  anomalyId: { type: String, required: true, unique: true },
  ruleTriggered: { 
    type: String, 
    enum: ['DUPLICATE_HASH_UPLOADER', 'HIGH_ACCESS_VELOCITY', 'TEMPLATE_MISMATCH'], 
    required: true 
  },
  severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'HIGH' },
  details: { type: mongoose.Schema.Types.Mixed, required: true },
  resolved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = {
  User: mongoose.model('User', UserSchema),
  Document: mongoose.model('Document', DocumentSchema),
  CourtOrder: mongoose.model('CourtOrder', CourtOrderSchema),
  AccessLog: mongoose.model('AccessLog', AccessLogSchema),
  PoliceRequest: mongoose.model('PoliceRequest', PoliceRequestSchema),
  AnomalyLog: mongoose.model('AnomalyLog', AnomalyLogSchema)
};
