import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';
import { prisma } from './config/prisma';

const startServer = async () => {
  try {
    await prisma.$connect();
    logger.info('Connected to the database successfully.');

    app.listen(env.PORT, () => {
      logger.info(`Server is running on port ${env.PORT} in ${env.NODE_ENV} mode.`);
      logger.info(`Swagger docs available at http://localhost:${env.PORT}/api-docs`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
