import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import { pino } from 'pino';

import { healthCheckRouter } from '@/api/healthCheck/healthCheckRouter';
import { productsRouter } from '@/api/router/productsRouter';
import { userRouter } from '@/api/router/userRouter';
import errorHandler from '@/common/middleware/errorHandler';
// import rateLimiter from '@/common/middleware/rateLimiter';
// import requestLogger from '@/common/middleware/requestLogger';
import { env } from '@/common/utils/envConfig';

const logger = pino({ name: 'server start' });
const app: Express = express();
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
// Set the application to trust the reverse proxy
app.set('trust proxy', true);

// Middlewares
app.use(cors({ origin: env.CORS_ORIGIN, credentials: false }));
app.use(helmet());
//app.use(rateLimiter);

// Request logging
//app.use(requestLogger);
const basePath = '/api/v1';

// Routes
app.use(`${basePath}/health-check`, healthCheckRouter);
app.use(`${basePath}/users`, userRouter);
app.use(`${basePath}/products`, productsRouter);

// Swagger UI
//app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
