export default function HomePage() {
  return (
    <div className="grid two-col">
      <section className="card hero">
        <h2>Tamper-proof degree verification</h2>
        <p>
          Universities upload certificates, the system generates a SHA-256 fingerprint,
          stores the file in mock IPFS, and stores the proof in mock blockchain storage.
        </p>
        <div className="pill-row">
          <span className="pill">IPFS = file storage</span>
          <span className="pill">Blockchain = authenticity proof</span>
          <span className="pill">Website = instant verification</span>
        </div>
      </section>
      <section className="card">
        <h3>Flow</h3>
        <ol>
          <li>University uploads certificate PDF.</li>
          <li>Backend hashes file and stores proof.</li>
          <li>Student shares verification link.</li>
          <li>Employer uploads received PDF to verify.</li>
          <li>Student approves original file access request.</li>
        </ol>
      </section>
    </div>
  );
}
