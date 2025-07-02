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
    }),
    ApiHeader({
      name: 'request-id',
      description:
        'Unique request identifier to trace requests across services',
    }),
  );

export const CommonHeadersWithToken = () =>
  applyDecorators(
    CommonHeaders(),
    ApiHeader({
      name: 'authorization',
      description: 'Bearer token',
      required: true,
    }),
  );
