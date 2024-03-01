import { MongoClient, Db, Collection } from 'mongodb';
import { AppError, DbError, MissingEnvError } from './util/appError';
import dotenv from 'dotenv';
import { IUser } from './models/user.db';
import { IProfile } from './models/profile.db';

let dbConnection: Db;
let client: MongoClient;
let userCollection: Collection<IUser>;
let profileCollection: Collection<IProfile>;

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
    profileCollection = dbConnection.collection(process.env.PROFILE_COLLECTION_NAME || 'profiles');

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

export const getProfileCollection = (): Collection<IProfile> => {
  return profileCollection;
};

/**
 * Disconnect from DB.
 */
export const disconnect = async () => {
  await client.close();
};
