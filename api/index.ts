import 'dotenv/config';
import 'reflect-metadata';
import 'pg';
import 'pg-hstore';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Request, Response } from 'express';
import { AppModule } from '../src/app.module';

const server = express();
let ready: Promise<void> | null = null;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://lendingfinance.site',
      'https://www.lendingfinance.site',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  server.disable('etag');
  server.use((_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });
  await app.init();
}

export default async function handler(req: Request, res: Response) {
  if (!ready) {
    ready = bootstrap().catch((err) => {
      ready = null;
      throw err;
    });
  }
  await ready;
  server(req, res);
}
