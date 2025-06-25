/** Nest */
import { Injectable, Logger } from '@nestjs/common';

/** Sentry */
import { withScope, captureException, captureMessage } from '@sentry/node';

/** Express */
import { Request } from 'express';

interface LogMeta {
  request?: Request;
  error?: Error;
}

type LogLevel = 'log' | 'error' | 'warn';

@Injectable()
export class LoggerService {
  private readonly logger = new Logger(LoggerService.name);

  constructor(private readonly context: string) {
    this.logger = new Logger(context);
  }

  log(meta: LogMeta, message: string) {
    this.logger.log({
      message,
      context: { request: meta.request, error: meta.error },
    });
  }

  error(meta: LogMeta, message: string) {
    this.logger.error({
      message,
      context: { request: meta.request, error: meta.error },
    });

    this.captureToSentry('error', meta, message);
  }

  warn(meta: LogMeta, message: string) {
    this.logger.warn({
      message,
      context: { request: meta.request, error: meta.error },
    });

    this.captureToSentry('warn', meta, message);
  }

  private captureToSentry(level: LogLevel, meta: LogMeta, message?: string) {
    withScope((scope) => {
      scope.setTag('level', level);
      scope.setTag('context', this.context);

      if (meta?.request) {
        const { request } = meta;

        const { method, url, query, params, headers, ip } = request;

        scope.setExtras({
          method: method,
          request_id: request['requestId'],
          url: url,
          query: query,
          params: params,
          user: request['user'],
          headers: headers,
          ip: ip,
          body: request['body'],
        });
      }

      if (meta?.error) {
        const { error } = meta;

        scope.setTag('error_type', error.name);

        captureException(error);
      }

      captureMessage(`${level.toUpperCase()}: ${message}`);
    });
  }
}
