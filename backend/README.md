# Government Blockchain eVault Backend API

This is the backend architecture for a government-controlled blockchain-based eVault for legal records, used by courts, registrars, and police.

## 🏛️ Architecture Overview

- **Framework**: Node.js + Express.js
- **Blockchain**: Hyperledger Fabric (permissioned network relayer pattern)
- **Storage**: IPFS for encrypted blobs (envelope encryption)
- **Database**: MongoDB (off-chain metadata & audit logs)
- **Compliance**: BSA 2023 Section 63 Evidence Certificates

---

## 🔒 Core Feature: Court-Order-Gated Access Flow

1. **Judge Issues Order (`POST /api/court-orders`)**:
   - Presiding judge digitally signs a court order referencing a specific `targetDocumentId`.
   - Order signature is verified against the pre-registered Public Key Registry.
   - Order hash is anchored to Hyperledger Fabric on-chain.

2. **Access Request (`POST /api/access-requests`)**:
   - Police officer or registrar submits an access request referencing the `orderId`.
   - Backend verifies judge signature, validity window (`validFrom` / `validUntil`), and non-revocation status.
   - Upon verification, releases the **AES-256 envelope decryption key** (NOT file plaintext).

3. **Immutable Audit Logging (`AccessLog`)**:
   - Every single access attempt (granted or denied) writes an immutable `AccessLog` entry to the audit database.

---

## 📁 Key Backend Files Created

1. `backend/src/models/index.js`
   - Schemas for `Document`, `CourtOrder`, `AccessLog`, `User`, `PoliceRequest`, and `AnomalyLog`.
2. `backend/src/services/accessControl.service.js`
   - Judge key-registry verification, court-order evaluation, rank-tiered police approvals, and envelope encryption key release.
3. `backend/src/controllers/vaultController.js`
   - API endpoints: Upload & encrypt, Tamper-evident amendments, Public QR-verification, Court order issuance, and BSA 2023 Section 63 certificate generator.
4. `backend/src/app.js`
   - Express App entry point, Helmet security, Rate-limiting, Gasless Relayer service, and Anomaly / Analytics endpoints.
