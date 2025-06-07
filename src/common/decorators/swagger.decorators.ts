/** Nest */
import { applyDecorators } from '@nestjs/common';

/** Swagger */
import { ApiResponse } from '@nestjs/swagger';

export const ApiCommonError = (resourceName: string = 'Resource') => {
  return applyDecorators(
    ApiResponse({
      status: 400,
      description: `Invalid ${resourceName} ID`,
      schema: {
        example: {
          statusCode: 400,
          message: `Invalid ${resourceName} ID`,
          error: 'Bad Request',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: `${resourceName} not found`,
      schema: {
        example: {
          statusCode: 404,
          message: `${resourceName} not found`,
          error: 'Not Found',
        },
      },
    }),
  );
};
