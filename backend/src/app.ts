import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { userRoutes } from './modules/users/user.routes';
import { errorHandler } from './middleware/error.middleware';
import { setupSwagger } from './config/swagger';
import { logger } from './utils/logger';

const app: Express = express();

// Security Middlewares
app.use(helmet());
app.use(cors());

// Rate limiting: 100 requests every 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Swagger Setup
setupSwagger(app);

// Routes
app.use('/api/v1/users', userRoutes);

// Error Handling Middleware
app.use(errorHandler);

export default app;
