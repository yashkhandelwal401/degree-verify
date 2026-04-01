import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import certificateRoutes from './routes/certificateRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Backend is running' });
});

app.use('/api', certificateRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
