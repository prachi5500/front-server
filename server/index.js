import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import templateRoutes from './routes/templates.js';
import uploadRoutes from './routes/upload.js';
import contactRoutes from './routes/contact.js';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*' }));
app.use(express.json());
app.use(morgan('dev'));
app.disable('x-powered-by');
app.use(
  helmet({
    contentSecurityPolicy: process.env.CSP_DISABLE === '1' ? false : undefined,
    crossOriginEmbedderPolicy: false,
  })
);

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('Missing MONGO_URI in server/.env');
  process.exit(1);
}

await mongoose.connect(MONGO_URI);
console.log('Connected to MongoDB');

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/auth', authRoutes);
app.use('/templates', templateRoutes);
app.use('/upload', uploadRoutes);
app.use('/contact', contactRoutes);

// Serve built frontend in production only
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, '..', 'dist');
  app.use(express.static(distPath, { index: false, redirect: false, fallthrough: true }));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
