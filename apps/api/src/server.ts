import app from './app';
import { config } from './config/env';
import { initCloudinary } from './utils/cloudinary.utils';

// Initialize Cloudinary
initCloudinary();

const PORT = config.port || 4000;

const server = app.listen(PORT, () => {
  console.log(`🚀 API Server running on port ${PORT} in ${config.nodeEnv} mode`);
  console.log(`👉 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated.');
  });
});
