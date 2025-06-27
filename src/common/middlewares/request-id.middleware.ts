import { Injectable, NestMiddleware } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

import { LoggerService } from '../logger';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  logger = new LoggerService('RequestIdMiddleware');

  use(req: Request, res: Response, next: NextFunction) {
    try {
      const requestId = req.headers['request-id'];

      if (!requestId || typeof requestId !== 'string') {
        throw new Error('Invalid or missing request ID');
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
