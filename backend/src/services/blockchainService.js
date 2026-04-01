const blockchainRecords = new Map();

export async function writeCertificateProof({ certificateId, hash, issuer, studentName, ipfsCid }) {
  const txHash = `0x${Math.random().toString(16).slice(2).padEnd(64, '0').slice(0, 64)}`;
  blockchainRecords.set(hash, {
    certificateId,
    hash,
    issuer,
    studentName,
    ipfsCid,
    txHash,
    issuedAt: new Date().toISOString()
  });
  return { txHash };
}

export async function findCertificateByHash(hash) {
  return blockchainRecords.get(hash) || null;
}
