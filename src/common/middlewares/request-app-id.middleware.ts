/** Nest */
import { Injectable, NestMiddleware } from '@nestjs/common';

/** Express */
import { Request, Response, NextFunction } from 'express';

/** Logger */
import { LoggerService } from '../logger';

/** Constants */
import {
  WEB_MOBILE_APP_ID,
  WEB_DESKTOP_APP_ID,
  ANDROID_APP_ID,
  IOS_APP_ID,
  TABLET_APP_ID,
  DESKTOP_APP_ID,
  SWAGGER_APP_ID,
} from '../constants';

@Injectable()
export class RequestAppIdMiddleware implements NestMiddleware {
  logger = new LoggerService('RequestAppIdMiddleware');

  use(req: Request, res: Response, next: NextFunction) {
    try {
      const appId = req.headers['request-app-id'];

      const VALID_APP_IDS = new Set([
        WEB_MOBILE_APP_ID,
        WEB_DESKTOP_APP_ID,
        ANDROID_APP_ID,
        IOS_APP_ID,
        TABLET_APP_ID,
        DESKTOP_APP_ID,
        SWAGGER_APP_ID,
      ]);

      const validationAppId = VALID_APP_IDS.has(appId as string);

      if (!validationAppId) {
        throw new Error('Invalid or missing request app ID');
      }

      req['requestAppId'] = appId;

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
