/**
 * ============================================================================
 * PROVENANCE EVAULT - FRONTEND API CLIENT SERVICE
 * ============================================================================
 * Production uses VITE_API_BASE_URL; local development falls back to localhost.
 */

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
).replace(/\/$/, '');

async function parseResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.message || `Backend responded ${res.status}`);
  }
  return data;
}

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    return await parseResponse(res);
  } catch (err) {
    console.warn('[API] Backend offline, fallback to client state');
    return { status: 'OFFLINE', error: err.message };
  }
}

export async function fetchAllDocumentsFromBackend(filters = {}) {
  try {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_BASE_URL}/documents${query ? `?${query}` : ''}`);
    return await parseResponse(res);
  } catch (err) {
    console.warn('[API] Could not fetch documents from backend, using local state:', err.message);
    return null;
  }
}

export async function uploadDocumentToBackend(docPayload) {
  const res = await fetch(`${API_BASE_URL}/documents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(docPayload)
  });
  return parseResponse(res);
}

export async function verifyDocumentOnBackend(idOrHash) {
  const res = await fetch(
    `${API_BASE_URL}/documents/${encodeURIComponent(idOrHash)}/verify`
  );
  return parseResponse(res);
}

export async function requestCourtGatedAccess(orderId, documentId, requesterId, requesterRole) {
  const res = await fetch(`${API_BASE_URL}/access-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderId,
      targetDocumentId: documentId,
      requesterId,
      requesterRole
    })
  });
  return parseResponse(res);
}

export async function fetchSection63Certificate(documentId, custodianName) {
  const res = await fetch(`${API_BASE_URL}/documents/${documentId}/certificate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ custodianName })
  });
  return parseResponse(res);
}

export async function fetchAdminAnalytics() {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/analytics`);
    return await parseResponse(res);
  } catch (err) {
    console.error('[API ERROR] Admin Analytics failed:', err);
    return null;
  }
}
