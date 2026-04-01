import { useState } from 'react';
import { approveRequest, getStudentRequests, rejectRequest } from '../services/api';

export default function StudentDashboard() {
  const [studentEmail, setStudentEmail] = useState('student@example.com');
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');

  async function loadRequests() {
    const data = await getStudentRequests(studentEmail);
    setRequests(data.requests || []);
  }

  async function handleApprove(id) {
    const result = await approveRequest(id);
    setMessage(result.success ? 'Request approved.' : 'Approval failed.');
    await loadRequests();
  }

  async function handleReject(id) {
    const result = await rejectRequest(id);
    setMessage(result.success ? 'Request rejected.' : 'Reject failed.');
    await loadRequests();
  }

  return (
    <section className="card">
      <h2>Student Dashboard</h2>
      <div className="inline-form">
        <input value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} placeholder="Student email" />
        <button onClick={loadRequests}>Load Requests</button>
      </div>
      {message && <p className="info">{message}</p>}
      <div className="list">
        {requests.map((request) => (
          <div className="list-item" key={request.id}>
            <strong>{request.employerName}</strong>
            <span>{request.employerEmail}</span>
            <small>Reason: {request.reason}</small>
            <small>Status: {request.status}</small>
            {request.status === 'PENDING' && (
              <div className="actions">
                <button onClick={() => handleApprove(request.id)}>Approve</button>
                <button className="secondary" onClick={() => handleReject(request.id)}>Reject</button>
              </div>
            )}
            {request.download?.url && <a href={request.download.url}>Temporary Download Link</a>}
          </div>
        ))}
        {requests.length === 0 && <p>No requests found.</p>}
      </div>
    </section>
  );
}
