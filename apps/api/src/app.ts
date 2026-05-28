import './config/env'; // Load environment variables first
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRouter from './modules/auth/auth.router';
import mediaRouter from './modules/media/media.router';
import sitesRouter from './modules/sites/sites.router';
import { notFoundHandler, globalErrorHandler } from './middleware/error.middleware';

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routers mounted under /api/v1
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/media', mediaRouter);
app.use('/api/v1/sites', sitesRouter);

// Error Handling (applied last)
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
