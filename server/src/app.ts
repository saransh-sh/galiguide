import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRouter from './routes/api.routes';
import { normalizeRequestId, redactSensitiveData } from './shared/utils';
import { AppError } from './shared/errors';

const app = express();

// Security and Network Middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Request ID Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const reqId = normalizeRequestId(req.headers['x-request-id'] as string | undefined);
  req.headers['x-request-id'] = reqId;
  res.setHeader('x-request-id', reqId);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount routes on both /api and /api/v1 prefixes
app.use('/api', apiRouter);
app.use('/api/v1', apiRouter);

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found',
    },
  });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  const requestId = (req.headers['x-request-id'] as string) || (res.getHeader('x-request-id') as string);
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : err.status || 500;
  const errorCode = isAppError ? err.code : err.code || 'INTERNAL_SERVER_ERROR';
  const errorMessage = err.message || 'An unexpected internal server error occurred';

  if (statusCode >= 500) {
    console.error(`[${requestId}] Unhandled Application Error:`, redactSensitiveData(err));
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: errorMessage,
    },
    requestId,
  });
});

export default app;
