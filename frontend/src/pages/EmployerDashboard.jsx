import { useState } from 'react';
import { requestAccess, verifyCertificate } from '../services/api';

export default function EmployerDashboard() {
  const [file, setFile] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [requestForm, setRequestForm] = useState({ employerName: '', employerEmail: '', reason: '' });
  const [requestMessage, setRequestMessage] = useState('');

  async function handleVerify(event) {
    event.preventDefault();
    const formData = new FormData();
    if (file) formData.append('certificate', file);
    const result = await verifyCertificate(formData);
    setVerificationResult(result);
    setRequestMessage('');
  }

  async function handleRequestAccess(event) {
    event.preventDefault();
    if (!verificationResult?.certificate?.id) return;
    const result = await requestAccess(verificationResult.certificate.id, requestForm);
    setRequestMessage(result.success ? 'Access request sent to student.' : 'Request failed.');
  }

  return (
    <div className="grid two-col">
      <section className="card">
        <h2>Employer Verification</h2>
        <form onSubmit={handleVerify} className="form">
          <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} required />
          <button type="submit">Verify Certificate</button>
        </form>

        {verificationResult && (
          <div className={verificationResult.valid ? 'result valid' : 'result invalid'}>
            <h3>{verificationResult.valid ? 'Verified' : 'Invalid'}</h3>
            <p>{verificationResult.message}</p>
            {verificationResult.certificate && (
              <>
                <p><strong>Student:</strong> {verificationResult.certificate.studentName}</p>
                <p><strong>University:</strong> {verificationResult.certificate.universityName}</p>
                <p><strong>Degree:</strong> {verificationResult.certificate.degree}</p>
                <p><strong>IPFS CID:</strong> {verificationResult.certificate.ipfsCid}</p>
              </>
            )}
          </div>
        )}
      </section>

      <section className="card">
        <h3>Request Original Certificate</h3>
        <form onSubmit={handleRequestAccess} className="form">
          <input placeholder="Employer name" value={requestForm.employerName} onChange={(e) => setRequestForm({ ...requestForm, employerName: e.target.value })} required />
          <input type="email" placeholder="Employer email" value={requestForm.employerEmail} onChange={(e) => setRequestForm({ ...requestForm, employerEmail: e.target.value })} required />
          <textarea placeholder="Reason for request" value={requestForm.reason} onChange={(e) => setRequestForm({ ...requestForm, reason: e.target.value })} required />
          <button type="submit" disabled={!verificationResult?.valid}>Send Access Request</button>
        </form>
        {requestMessage && <p className="info">{requestMessage}</p>}
      </section>
    </div>
  );
}
