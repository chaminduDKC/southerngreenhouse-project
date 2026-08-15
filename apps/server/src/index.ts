import app from './app.js';
import { setupBlacklistCleanup } from './cron/blacklistCleanup.js';
import prisma from './lib/prisma.js';

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT as number, '127.0.0.1', () => {
  console.log(`Server listening on http://127.0.0.1:${PORT}`);
  if (process.send) {
    process.send('ready');
  }
});

setupBlacklistCleanup();

// Graceful shutdown
const shutdown = async () => {
  console.log('Shutting down...');
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
