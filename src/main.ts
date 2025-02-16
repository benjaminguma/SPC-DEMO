import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ParseJSONPipe } from './shared/pipes/json-transformer.pipe';
import { HttpExceptionFilter } from './global/config/errors/global.filter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.setGlobalPrefix('/api/v1');
  const port = '2900';
  console.log(port);
  app.enableCors();

  app.useGlobalPipes(
    new ParseJSONPipe(),
    new ValidationPipe({
      skipNullProperties: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(parseInt(port, 10));
}
bootstrap();

//
