import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';

// Route imports
import authRoutes from './modules/auth/auth.routes';
import brandsRoutes from './modules/brands/brands.routes';
import modelsRoutes from './modules/models/models.routes';
import categoriesRoutes from './modules/categories/categories.routes';
import partsRoutes from './modules/parts/parts.routes';
import searchRoutes from './modules/search/search.routes';
import enquiriesRoutes from './modules/enquiries/enquiries.routes';
import contactRoutes from './modules/contact/contact.routes';
import pagesRoutes from './modules/pages/pages.routes';
import bannersRoutes from './modules/banners/banners.routes';
import settingsRoutes from './modules/settings/settings.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Security & Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:4000',
  process.env.FRONTEND_URL || 'https://www.hastinamotorparts.com'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl) or allowed origins
    if (!origin || allowedOrigins.includes(origin) || origin.includes('localhost')) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive in development
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(cookieParser());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Health Check
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Hastina Motor Parts REST API',
    company: 'ALISONS GENERAL TRADING LLP'
  });
});

// API Routes
app.use('/api/v1/admin/auth', authRoutes);
app.use('/api/v1/brands', brandsRoutes);
app.use('/api/v1/models', modelsRoutes);
app.use('/api/v1/categories', categoriesRoutes);
app.use('/api/v1/parts', partsRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/enquiries', enquiriesRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/pages', pagesRoutes);
app.use('/api/v1/banners', bannersRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/admin/analytics', analyticsRoutes);

// Error handling middleware
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Hastina Motor Parts API running on port ${PORT}`);
    console.log(`🌐 Endpoint: http://localhost:${PORT}/api/v1`);
    console.log(`🏢 ALISONS GENERAL TRADING LLP - New Delhi, India`);
    console.log(`=======================================================`);
  });
}

export default app;
