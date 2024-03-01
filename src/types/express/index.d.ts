import { WithId } from 'mongodb';
import { IUser } from '../../models/user.db';

export {};

declare global {
  namespace Express {
    export interface Request {
      user?: WithId<IUser>;
    }
  }
}
