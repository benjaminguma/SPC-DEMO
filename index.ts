import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as functions from 'firebase-functions';
import { AppModule } from './src/app.module';
// import { ParseJSONPipe } from 'src/shared/pipes/json-transformer.pipe';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/global/config/errors/global.filter';

const expressServer = express();
const createFunction = async (expressInstance): Promise<void> => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  app.setGlobalPrefix('/v1');

  app.useGlobalPipes(
    // new ParseJSONPipe(),
    new ValidationPipe({
      skipNullProperties: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  //
  await app.init();
};
export const api = functions.https.onRequest(async (request, response) => {
  await createFunction(expressServer);
  expressServer(request, response);
});
