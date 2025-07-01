/** Nest */
import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

export const CommonHeaders = () =>
  applyDecorators(
    ApiHeader({
      name: 'request-app-id',
      description:
        "Unique app request identifier where are from, without this code don't request",
      required: true,
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiHeader({
      name: 'request-id',
      description:
        'Unique request identifier to trace requests across services',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
  );

export const CommonHeadersWithToken = () =>
  applyDecorators(
    CommonHeaders(),
    ApiHeader({
      name: 'authorization',
      description: 'Bearer token',
      required: true,
      example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }),
  );
