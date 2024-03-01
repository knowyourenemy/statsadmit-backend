import { MongoClient, Db, Collection } from 'mongodb';
import { AppError, DbError, MissingEnvError } from './util/appError';
import dotenv from 'dotenv';
import { IUser } from './models/user.db';

let dbConnection: Db;
let client: MongoClient;
let userCollection: Collection<IUser>;

dotenv.config();

/**
 * Establish connection to DB.
 */
export const connectToDatabase = async (uri: string) => {
  try {
    client = new MongoClient(uri);
    await client.connect();

    dbConnection = client.db(process.env.DB_NAME || 'admit-asia-prod');
    userCollection = dbConnection.collection(process.env.USER_COLLECTION_NAME || 'users');
    console.log(`Successfully connected to database: ${dbConnection.databaseName}.`);
  } catch (e: any) {
    if (e instanceof AppError) {
      throw e;
    } else {
      throw new DbError('Could not connect to DB.');
    }
  }
};

export const getUserCollection = (): Collection<IUser> => {
  return userCollection;
};

/**
 * Disconnect from DB.
 */
export const disconnect = async () => {
  await client.close();
};
