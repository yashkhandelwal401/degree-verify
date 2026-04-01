export function createVerificationLink(certificateId) {
  return `http://localhost:5173/verify/${certificateId}`;
}

export function createTemporaryDownloadLink(certificateId) {
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  return {
    url: `http://localhost:5000/api/certificates/${certificateId}/download?token=demo-token`,
    expiresAt
  };
}
