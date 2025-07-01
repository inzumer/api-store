/** Nest */
import { Injectable, NestMiddleware } from '@nestjs/common';

/** Express */
import { Request, Response, NextFunction } from 'express';

/** Logger */
import { LoggerService } from '../logger';

/** Constants */
import { APP_IDS } from '../constants';

@Injectable()
export class RequestAppIdMiddleware implements NestMiddleware {
  logger = new LoggerService('RequestAppIdMiddleware');

  use(req: Request, res: Response, next: NextFunction) {
    try {
      const appId = req.headers['request-app-id'] as string;

      const validationAppId = Object.values(APP_IDS).includes(appId);

      if (!validationAppId) {
        throw new Error('Invalid or missing request app ID');
      }

      req['requestAppId'] = appId;

      next();
    } catch (error) {
      this.logger.error(
        { request: req, error: error as Error },
        'Failed to process request app ID',
      );

      return res.status(400).json({
        statusCode: 400,
        message: 'Missing or invalid request-app-id header',
      });
    }
  }
}
