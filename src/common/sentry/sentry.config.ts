/** Sentry */
import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

export const SentryInit = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction && !process.env.SENTRY_DSN) {
    return console.warn(
      'Sentry DSN is not set. Sentry will not be initialized in non-production environments.',
    );
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: 0.1,
    profileSessionSampleRate: 0.05,
    profileLifecycle: 'trace',
    sendDefaultPii: true,
    release: process.env.PACKAGE_VERSION,
    environment: process.env.NODE_ENV,
    beforeSend(event) {
      if (event.request?.headers?.authorization) {
        event.request.headers.authorization = '[REDACTED]';
      }

      return event;
    },
  });
};
