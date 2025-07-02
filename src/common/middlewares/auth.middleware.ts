/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/** Nest */
import { Injectable, NestMiddleware } from '@nestjs/common';

/** Express */
import { Request, Response, NextFunction } from 'express';

/** Resources jsonwebtoken */
import { verify } from 'jsonwebtoken';

/** Logger */
import { LoggerService } from '../logger';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  logger = new LoggerService('AuthMiddleware');

  use(req: Request, res: Response, next: NextFunction) {
    try {
      const secret = process.env.JWT_SECRET;
      const authHeader = req.headers['authorization'];

      const token = authHeader?.replace('Bearer ', '').trim();

      if (!token) {
        throw new Error('Authorization token missing');
      }

      const payload = verify(token, secret);

      req['user'] = payload;

      next();
    } catch (error) {
      this.logger.error(
        { request: req, error: error as Error },
        'Authentication failed',
      );

      return res.status(401).json({
        statusCode: 401,
        message: 'Unauthorized. Please login again.',
      });
    }
  }
}
