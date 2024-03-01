import express, { Express, NextFunction, Request, Response } from 'express';
import { AppError } from './util/appError';
import userRouter from './routes/user';
import profileRouter from './routes/profile';
import cookieParser from 'cookie-parser';
import cors from 'cors';

export const makeApp = () => {
  const app: Express = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      origin: ['http://localhost:3000'],
      credentials: true,
    }),
  );
  app.get('/', (req: Request, res: Response) => {
    res.send('AdmitAsia');
  });
  app.use('/api/user', userRouter);
  app.use('/api/profile', profileRouter);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    if (err instanceof AppError) {
      return res.status(err.statusCode).send(err.message);
    } else {
      return res.sendStatus(500);
    }
  });
  return app;
};
