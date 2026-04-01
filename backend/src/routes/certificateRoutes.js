import express from 'express';
import multer from 'multer';
import {
  uploadCertificate,
  verifyCertificate,
  listCertificates,
  getCertificateById,
  requestCertificateAccess,
  listStudentRequests,
  approveRequest,
  rejectRequest,
  downloadCertificate
} from '../controllers/certificateController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/certificates/upload', upload.single('certificate'), uploadCertificate);
router.post('/certificates/verify', upload.single('certificate'), verifyCertificate);
router.get('/certificates', listCertificates);
router.get('/certificates/:id', getCertificateById);
router.post('/certificates/:id/request-access', requestCertificateAccess);
router.get('/students/:studentEmail/requests', listStudentRequests);
router.patch('/requests/:requestId/approve', approveRequest);
router.patch('/requests/:requestId/reject', rejectRequest);
router.get('/certificates/:id/download', downloadCertificate);

export default router;
