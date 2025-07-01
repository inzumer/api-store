/** Nest */
import { Injectable, NestMiddleware } from '@nestjs/common';

/** Express */
import { Request, Response, NextFunction } from 'express';

/** Resources crypto */
import { randomUUID } from 'crypto';

/** Logger */
import { LoggerService } from '../logger';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  logger = new LoggerService('RequestIdMiddleware');

  use(req: Request, res: Response, next: NextFunction) {
    try {
      let requestId = req.headers['request-id'];

      if (!requestId || typeof requestId !== 'string') {
        requestId = randomUUID();
      }

      req['requestId'] = requestId;

      next();
    } catch (error) {
      this.logger.error(
        { request: req, error: error as Error },
        'Failed to process request ID',
      );

      return res.status(400).json({
        statusCode: 400,
        message: 'Missing or invalid request-id header',
      });
    }
  }
}
