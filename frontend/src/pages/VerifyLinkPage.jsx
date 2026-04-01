import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCertificate } from '../services/api';

export default function VerifyLinkPage() {
  const { id } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCertificate() {
      const data = await getCertificate(id);
      if (data.success) {
        setCertificate(data.certificate);
      } else {
        setError(data.message || 'Certificate not found.');
      }
    }
    loadCertificate();
  }, [id]);

  if (error) {
    return <section className="card"><h2>Verification Link</h2><p>{error}</p></section>;
  }

  if (!certificate) {
    return <section className="card"><p>Loading...</p></section>;
  }

  return (
    <section className="card">
      <h2>Official Verification Record</h2>
      <p><strong>Status:</strong> Genuine record found</p>
      <p><strong>Student:</strong> {certificate.studentName}</p>
      <p><strong>University:</strong> {certificate.universityName}</p>
      <p><strong>Degree:</strong> {certificate.degree}</p>
      <p><strong>Graduation Year:</strong> {certificate.graduationYear}</p>
      <p><strong>Document Hash:</strong> {certificate.hash}</p>
      <p><strong>IPFS CID:</strong> {certificate.ipfsCid}</p>
      <p><strong>Blockchain Tx:</strong> {certificate.txHash}</p>
    </section>
  );
}
