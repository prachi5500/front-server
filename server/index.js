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
import paymentRoutes from './routes/payments.js';

const app = express();

// Allow requests from your specific Frontend URL (or all if comma-separated list fails)
app.use(cors({
  origin: [
    'http://localhost:8080',
    'http://localhost:8081',
    'http://localhost:3000',
    'http://127.0.0.1:8080',
    'http://127.0.0.1:8081'
  ],
  credentials: true
}));
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

// Connect to MongoDB
try {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');
} catch (err) {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
}

// Simple Health Check
app.get('/health', (_req, res) => res.json({ ok: true }));

// API Routes
app.use('/auth', authRoutes);
app.use('/templates', templateRoutes);
app.use('/upload', uploadRoutes);
app.use('/contact', contactRoutes);
app.use('/payments', paymentRoutes); // ⬅ new


// ✅ NEW: Root route to verify backend is working without crashing
app.get('/', (req, res) => {
  res.send("Backend is running successfully. Please use the Frontend URL to view the application.");
});

const PORT = 3003; // Force port 3003 to avoid conflicts
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});