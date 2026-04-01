import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { hashFile } from '../utils/hashFile.js';
import { uploadToIpfs } from '../services/ipfsService.js';
import { writeCertificateProof, findCertificateByHash } from '../services/blockchainService.js';
import { createTemporaryDownloadLink, createVerificationLink } from '../services/linkService.js';
import { store } from '../data/store.js';
import { verifySource } from '../services/aiService.js'; // Import your new AI Service

export async function uploadCertificate(req, res) {
  try {
    const file = req.file;
    const { studentName, studentEmail, universityName, degree, graduationYear } = req.body;

    if (!file) {
      return res.status(400).json({ success: false, message: 'Certificate PDF is required.' });
    }

    // --- AI SOURCE VERIFICATION STEP ---
    // This implements the "India Times" style check by reading the PDF content
    const aiResult = await verifySource(file.path, universityName);
    
    if (!aiResult.isVerified) {
      // Delete the temporary file if AI determines it is not from the claimed source
      fs.unlink(file.path, () => {}); 
      return res.status(400).json({ 
        success: false, 
        message: `AI Verification Failed: The uploaded document does not appear to be an official record from ${universityName}.` 
      });
    }
    // -----------------------------------

    const hash = hashFile(file.path);
    const ipfs = await uploadToIpfs(file);
    const certificateId = uuidv4();
    const verificationLink = createVerificationLink(certificateId);
    const blockchain = await writeCertificateProof({
      certificateId,
      hash,
      issuer: universityName,
      studentName,
      ipfsCid: ipfs.cid
    });

    const certificate = {
      id: certificateId,
      studentName,
      studentEmail,
      universityName,
      degree,
      graduationYear,
      filename: file.originalname,
      localPath: file.path,
      hash,
      ipfsCid: ipfs.cid,
      txHash: blockchain.txHash,
      verificationLink,
      aiTrustScore: aiResult.confidence || 100, // Store AI confidence score
      createdAt: new Date().toISOString()
    };

    store.certificates.push(certificate);
    res.status(201).json({ success: true, certificate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Upload failed' });
  }
}

export async function verifyCertificate(req, res) {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: 'Please upload a certificate file.' });
    }

    const hash = hashFile(file.path);
    const blockchainRecord = await findCertificateByHash(hash);

    fs.unlink(file.path, () => {});

    if (!blockchainRecord) {
      return res.json({
        success: true,
        valid: false,
        message: 'Certificate is invalid or has been modified.'
      });
    }

    const certificate = store.certificates.find((item) => item.hash === hash);

    return res.json({
      success: true,
      valid: true,
      message: 'Certificate is genuine.',
      certificate,
      blockchainRecord
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Verification failed' });
  }
}

export function listCertificates(_req, res) {
  res.json({ success: true, certificates: store.certificates });
}

export function getCertificateById(req, res) {
  const certificate = store.certificates.find((item) => item.id === req.params.id);
  if (!certificate) {
    return res.status(404).json({ success: false, message: 'Certificate not found.' });
  }
  res.json({ success: true, certificate });
}

export function requestCertificateAccess(req, res) {
  const { employerName, employerEmail, reason } = req.body;
  const certificateId = req.params.id;

  const certificate = store.certificates.find((item) => item.id === certificateId);
  if (!certificate) {
    return res.status(404).json({ success: false, message: 'Certificate not found.' });
  }

  const request = {
    id: uuidv4(),
    certificateId,
    employerName,
    employerEmail,
    reason,
    status: 'PENDING',
    createdAt: new Date().toISOString()
  };

  store.requests.push(request);
  res.status(201).json({ success: true, request });
}

export function listStudentRequests(req, res) {
  const studentEmail = req.params.studentEmail;
  const certificates = store.certificates.filter((item) => item.studentEmail === studentEmail);
  const certificateIds = new Set(certificates.map((item) => item.id));
  const requests = store.requests.filter((item) => certificateIds.has(item.certificateId));
  res.json({ success: true, requests });
}

export function approveRequest(req, res) {
  const request = store.requests.find((item) => item.id === req.params.requestId);
  if (!request) {
    return res.status(404).json({ success: false, message: 'Request not found.' });
  }

  request.status = 'APPROVED';
  request.download = createTemporaryDownloadLink(request.certificateId);
  res.json({ success: true, request });
}

export function rejectRequest(req, res) {
  const request = store.requests.find((item) => item.id === req.params.requestId);
  if (!request) {
    return res.status(404).json({ success: false, message: 'Request not found.' });
  }

  request.status = 'REJECTED';
  res.json({ success: true, request });
}

export function downloadCertificate(req, res) {
  const certificate = store.certificates.find((item) => item.id === req.params.id);
  if (!certificate) {
    return res.status(404).json({ success: false, message: 'Certificate not found.' });
  }

  res.download(certificate.localPath, certificate.filename);
}