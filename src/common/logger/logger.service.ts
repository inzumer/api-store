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

  /**
   * Constructor for the logging service.
   *
   * @param context - Name of the module/class/controller where the logger is instantiated.
   */
  constructor(private readonly context: string) {
    this.logger = new Logger(context);
  }

  /**
   * Records a log of type "log".
   *
   * @param meta - Object with optional metadata: `request`, `error`.
   * @param message - Descriptive message about the event to log.
   */
  log(meta: LogMeta, message: string) {
    this.logger.log({
      message,
      context: { request: meta.request, error: meta.error },
    });
  }

  /**
   * Records an "error" log and reports it to Sentry.
   *
   * @param meta - An object with metadata, such as `request` and `error` thrown.
   * @param message - A message explaining the error that occurred.
   */
  error(meta: LogMeta, message: string) {
    this.logger.error({
      message,
      context: { request: meta.request, error: meta.error },
    });

    this.captureToSentry('error', meta, message);
  }

  /**
   * Records a "warn" log and reports it to Sentry.
   *
   * @param meta - An object with metadata, such as `request` and `error`.
   * @param message - A message indicating a warning or unintended behavior.
   */
  warn(meta: LogMeta, message: string) {
    this.logger.warn({
      message,
      context: { request: meta.request, error: meta.error },
    });

    this.captureToSentry('warn', meta, message);
  }

  /**
   * @private
   * Captures and reports detailed information to Sentry.
   *
   * Used internally by `error()` and `warn()` to send rich logs
   * with contextual and error information.
   *
   * @param level - Log level (`error`, `warn`, etc.).
   * @param meta - Contextual information such as `request` and `error`.
   * @param message - Message associated with the captured event.
   */
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
