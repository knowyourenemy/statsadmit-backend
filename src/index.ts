import { Express } from 'express';
import dotenv from 'dotenv';
import { connectToDatabase } from './db';
import { MissingEnvError } from './util/appError';
import { makeApp } from './app';

dotenv.config();

/**
 * Create and start express server
 */
const serveApp = async () => {
  if (!process.env.DB_CONN_STRING) {
    throw new MissingEnvError();
  }
  const app: Express = makeApp();
  const port = process.env.PORT || 8000;
  await connectToDatabase(process.env.DB_CONN_STRING);

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
};

serveApp();
