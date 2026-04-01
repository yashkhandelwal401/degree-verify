import { useEffect, useState } from 'react';
import { getCertificates, uploadCertificate } from '../services/api';

export default function UniversityDashboard() {
  const [form, setForm] = useState({
    studentName: '',
    studentEmail: '',
    universityName: '',
    degree: '',
    graduationYear: ''
  });
  const [file, setFile] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [message, setMessage] = useState('');

  async function loadCertificates() {
    const data = await getCertificates();
    setCertificates(data.certificates || []);
  }

  useEffect(() => {
    loadCertificates();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (file) formData.append('certificate', file);

    const result = await uploadCertificate(formData);
    if (result.success) {
      setMessage('Certificate uploaded successfully.');
      setForm({ studentName: '', studentEmail: '', universityName: '', degree: '', graduationYear: '' });
      setFile(null);
      await loadCertificates();
    } else {
      setMessage(result.message || 'Upload failed.');
    }
  }

  return (
    <div className="grid two-col">
      <section className="card">
        <h2>University Dashboard</h2>
        <form onSubmit={handleSubmit} className="form">
          <input placeholder="Student name" value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} required />
          <input placeholder="Student email" type="email" value={form.studentEmail} onChange={(e) => setForm({ ...form, studentEmail: e.target.value })} required />
          <input placeholder="University name" value={form.universityName} onChange={(e) => setForm({ ...form, universityName: e.target.value })} required />
          <input placeholder="Degree" value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} required />
          <input placeholder="Graduation year" value={form.graduationYear} onChange={(e) => setForm({ ...form, graduationYear: e.target.value })} required />
          <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} required />
          <button type="submit">Upload Certificate</button>
        </form>
        {message && <p className="info">{message}</p>}
      </section>

      <section className="card">
        <h3>Issued Certificates</h3>
        <div className="list">
          {certificates.map((cert) => (
            <div className="list-item" key={cert.id}>
              <strong>{cert.studentName}</strong>
              <span>{cert.degree}</span>
              <small>{cert.universityName}</small>
              <small>Hash: {cert.hash.slice(0, 16)}...</small>
              <a href={cert.verificationLink} target="_blank" rel="noreferrer">Verification Link</a>
            </div>
          ))}
          {certificates.length === 0 && <p>No certificates uploaded yet.</p>}
        </div>
      </section>
    </div>
  );
}
