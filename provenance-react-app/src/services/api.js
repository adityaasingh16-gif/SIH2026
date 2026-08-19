/**
 * ============================================================================
 * PROVENANCE EVAULT - FRONTEND API CLIENT SERVICE
 * ============================================================================
 * Connects the React SPA UI components directly to the Node.js / Express backend.
 */

const API_BASE_URL = 'https://sih2026-2.onrender.com/api';

/**
 * 1. Health Check Endpoint
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    return await res.json();
  } catch (err) {
    console.warn('[API] Backend offline, fallback to client state');
    return { status: 'OFFLINE', error: err.message };
  }
}

/**
 * 2. List / Search Documents (GET /api/documents)
 */
export async function fetchAllDocumentsFromBackend(filters = {}) {
  try {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_BASE_URL}/documents${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error(`Backend responded ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API] Could not fetch documents from backend, using local state:', err.message);
    return null;
  }
}

/**
 * 3. Upload & Encrypt Document (POST /api/documents)
 */
export async function uploadDocumentToBackend(docPayload) {
  try {
    const res = await fetch(`${API_BASE_URL}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(docPayload)
    });
    return await res.json();
  } catch (err) {
    console.error('[API ERROR] Upload Document failed:', err);
    throw err;
  }
}

/**
 * 3. Public Verification Lookup (GET /api/documents/:id/verify)
 */
export async function verifyDocumentOnBackend(idOrHash) {
  try {
    const res = await fetch(`${API_BASE_URL}/documents/${encodeURIComponent(idOrHash)}/verify`);
    return await res.json();
  } catch (err) {
    console.error('[API ERROR] Verification failed:', err);
    throw err;
  }
}

/**
 * 4. Request Court-Order-Gated Access (POST /api/access-requests)
 */
export async function requestCourtGatedAccess(orderId, documentId, requesterId, requesterRole) {
  try {
    const res = await fetch(`${API_BASE_URL}/access-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, targetDocumentId: documentId, requesterId, requesterRole })
    });
    return await res.json();
  } catch (err) {
    console.error('[API ERROR] Gated Access Request failed:', err);
    throw err;
  }
}

/**
 * 5. Generate BSA 2023 Section 63 Certificate (POST /api/documents/:id/certificate)
 */
export async function fetchSection63Certificate(documentId, custodianName) {
  try {
    const res = await fetch(`${API_BASE_URL}/documents/${documentId}/certificate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ custodianName })
    });
    return await res.json();
  } catch (err) {
    console.error('[API ERROR] BSA Section 63 Certificate failed:', err);
    throw err;
  }
}

/**
 * 6. Fetch Admin Analytics & Telemetry (GET /api/admin/analytics)
 */
export async function fetchAdminAnalytics() {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/analytics`);
    return await res.json();
  } catch (err) {
    console.error('[API ERROR] Admin Analytics failed:', err);
    return null;
  }
}
