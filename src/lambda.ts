import { APIGatewayProxyHandler } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Server } from 'http';
import { ExpressAdapter } from '@nestjs/platform-express';
import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';
import * as express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

let cachedServer: Server;

const bootstrapServer = async (): Promise<Server> => {
  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);

  const app = await NestFactory.create(AppModule, adapter, {
    logger: false,
  });
  // app.useLogger(new AppLogger());
  // app.use(RequestIdMiddleware);

  app.use(eventContext());
  app.enableCors();
  app.setGlobalPrefix('api/v1');

  const options = new DocumentBuilder()
    .setTitle('Nest example')
    .setDescription('Some api examples')
    .setVersion('1.0')
    .addBearerAuth()
    .setBasePath('/dev')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.init();
  return createServer(expressApp);
};

export const handler: APIGatewayProxyHandler = async (event, context) => {
  if (!cachedServer) {
    const server = await bootstrapServer();
    cachedServer = server;
    return proxy(server, event, context, 'PROMISE').promise;
  } else {
    return proxy(cachedServer, event, context, 'PROMISE').promise;
  }
};
