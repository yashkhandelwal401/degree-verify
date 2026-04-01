const API_BASE = 'http://localhost:5000/api';

export async function getCertificates() {
  const response = await fetch(`${API_BASE}/certificates`);
  return response.json();
}

export async function uploadCertificate(formData) {
  const response = await fetch(`${API_BASE}/certificates/upload`, {
    method: 'POST',
    body: formData
  });
  return response.json();
}

export async function verifyCertificate(formData) {
  const response = await fetch(`${API_BASE}/certificates/verify`, {
    method: 'POST',
    body: formData
  });
  return response.json();
}

export async function getCertificate(id) {
  const response = await fetch(`${API_BASE}/certificates/${id}`);
  return response.json();
}

export async function requestAccess(id, payload) {
  const response = await fetch(`${API_BASE}/certificates/${id}/request-access`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return response.json();
}

export async function getStudentRequests(studentEmail) {
  const response = await fetch(`${API_BASE}/students/${studentEmail}/requests`);
  return response.json();
}

export async function approveRequest(requestId) {
  const response = await fetch(`${API_BASE}/requests/${requestId}/approve`, { method: 'PATCH' });
  return response.json();
}

export async function rejectRequest(requestId) {
  const response = await fetch(`${API_BASE}/requests/${requestId}/reject`, { method: 'PATCH' });
  return response.json();
}
