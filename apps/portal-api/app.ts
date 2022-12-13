import express, {Application, NextFunction, Request, Response} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import morgan from 'morgan';

import appsRoutes from './app/controllers/apps.controller';
import authRoutes from './app/controllers/auth.controller';
import bundleRoutes from './app/controllers/bundle.controller';
import commitsRoutes from './app/controllers/commits.controller';
import localesRoutes from './app/controllers/locales.controller';
import manifestRoutes from './app/controllers/manifests.controller';
import meRoutes from './app/controllers/me.controller';
import notificationRoutes from './app/controllers/notifications.controller';
import organizationRoutes from './app/controllers/organizations.controller';
import organizationUsersRoutes from './app/controllers/organizationUsers.controller';
import projectsRoutes from './app/controllers/project.controller';
import projectUsersRoutes from './app/controllers/projectUser.controller';
import usersRoutes from './app/controllers/users.controller';
import {sendError} from './app/logic/helpers/sendError.helper';
import {authenticate} from './app/logic/middlewares/auth.middleware';
import {validateUserAccessToOrg} from './app/logic/middlewares/validateUserAccessToOrg.middleware';
import {validateUserAccessToProject} from './app/logic/middlewares/validateUserAccessToProject.middleware';
import { environment } from './environments/environment';
import { ErrorCode } from '@locale-hub/data/enums/error-code.enum';
import { ApiException } from '@locale-hub/data/exceptions/api.exception';
import path from 'path';

const fallbackSlowDown = slowDown({
  windowMs: 604800000, // 7 days
  delayAfter: 1, // slow after 1st request
  delayMs: 1000, // Add 1sec delay for each additional request
});

const expressApp: Application = express();

const apiRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 9000000, // max requests per IP
});

if (environment.features.sentry) {
  Sentry.init({
    dsn: environment.sentry.uri,
    environment: environment.environment,
    release: environment.version,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({tracing: true}),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({app: expressApp}),
    ],
    tracesSampleRate: 1.0,
  });

  // RequestHandler creates a separate execution context using domains, so that every
  // transaction/span/breadcrumb is attached to its own Hub instance
  expressApp.use(Sentry.Handlers.requestHandler());
  // TracingHandler creates a trace for every incoming request
  expressApp.use(Sentry.Handlers.tracingHandler());

  // API is behind a proxy on PRD
  expressApp.enable('trust proxy');
}

expressApp.use(express.json());
expressApp.use(cors({
  origin: [
    'http://localhost:4201',
    environment.security.cors.origin,
  ],
}));
expressApp.use(helmet());

// Global Rate limiter on Portal API
expressApp.use(apiRateLimiter);
expressApp.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

expressApp.use('/assets', express.static(path.join(__dirname, 'assets')));

/**
 * HealthCheck route. Returns the status and version of the API
 */
expressApp.get('/', (req: express.Request, res: express.Response) => res.json());
expressApp.get('/v1', (req: express.Request, res: express.Response) => res.json({
  status: 'ok',
  api: 'portal',
  version: environment.version,
}));

/**
 * Authentication related routes
 */
expressApp.use(
  '/v1/auth',
  authRoutes,
);

/**
 * Locales related routes
 */
expressApp.use(
  '/v1/locales',
  authenticate,
  localesRoutes,
);

/**
 * Current user related routes
 */
expressApp.use(
  '/v1/me',
  authenticate,
  meRoutes,
);

/**
 * Notifications related routes
 */
expressApp.use(
  '/v1/notifications',
  authenticate,
  notificationRoutes,
);

/**
 * Organization users related routes
 */
expressApp.use(
  '/v1/organizations/:organizationId/users',
  authenticate, validateUserAccessToOrg,
  organizationUsersRoutes,
);

/**
 * Organization related routes
 */
expressApp.use(
  '/v1/organizations',
  authenticate,
  organizationRoutes,
);

/**
 * Project's Apps related routes
 */
expressApp.use(
  '/v1/projects/:projectId/apps',
  authenticate, validateUserAccessToProject,
  appsRoutes,
);

/**
 * Project's Bundle related routes
 */
expressApp.use(
  '/v1/projects/:projectId/bundles',
  authenticate, validateUserAccessToProject,
  bundleRoutes,
);

/**
 * Project's Commits related routes
 */
expressApp.use(
  '/v1/projects/:projectId/commits',
  authenticate, validateUserAccessToProject,
  commitsRoutes,
);

/**
 * Project's Manifest related routes
 */
expressApp.use(
  '/v1/projects/:projectId/manifests',
  authenticate, validateUserAccessToProject,
  manifestRoutes,
);

/**
 * Project's Users related routes
 */
expressApp.use(
  '/v1/projects/:projectId/users',
  authenticate, validateUserAccessToProject,
  projectUsersRoutes,
);

/**
 * Projects related routes
 */
expressApp.use(
  '/v1/projects',
  authenticate,
  projectsRoutes,
);

/**
 * Users related routes
 */
expressApp.use(
  '/v1/users',
  authenticate,
  usersRoutes,
);

/**
 * 404 route
 */
expressApp.use(fallbackSlowDown, function(req: Request, res: Response) {
  console.error('unknown route', req.url);
  return sendError(res, new ApiException({
    statusCode: 404,
    code: ErrorCode.routeNotFound,
    message: 'Route not found',
  }));
});

if (environment.features.sentry) {
  expressApp.use(Sentry.Handlers.errorHandler());
}

/**
 * Error Fallback route. Hide the error under a generic message for user and keeps the log.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
expressApp.use(function(err: Error, req: Request, res: Response, _next: NextFunction) {
  return sendError(res, err);
});

export const app = expressApp;
