import { NestFactory } from '@nestjs/core';
import { SentryInit } from './common/sentry';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /** Global validation pipe */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  /** Enable CORS */
  app.enableCors({
    origin: process.env.CORS_ORIGIN,
  });

  /** Swagger setup */
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('Auto-generated Swagger UI for the project')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  /** Serve Swagger UI at /docs */
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT || 3000);

  /** Initialize Sentry */
  SentryInit();
}

bootstrap();
