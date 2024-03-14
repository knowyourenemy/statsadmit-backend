import { IUser, SESSION_DURATION, addCreatedProfile, checkUsernameExists, insertUser } from '../models/user.db';
import { AppError, BadRequestError, HelperError } from '../util/appError';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

const DUMMY_IMG_URL = 'https://i.pravatar.cc/150?img=';

/**
 * Create a new user
 * @param userData - User document.
 * @returns {string} Session ID of newly created user.
 */
export const createUser = async (username: string, password: string, email: string): Promise<string> => {
  try {
    if (username.length < 4 || username.length > 128) {
      throw new BadRequestError('Username must be between 4 - 128 characters long.');
    }

    if (password.length < 6 || password.length > 128) {
      throw new BadRequestError('Password must be between 6 - 128 characters long.');
    }
    // TODO: Check if email exists.
    const userExists = await checkUsernameExists(username);
    if (userExists) {
      throw new BadRequestError('User already exists.');
    }
    const sessionId = uuidv4();
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser: IUser = {
      userId: userId,
      username: username,
      password: hashedPassword,
      sessions: [
        {
          sessionId: sessionId,
          expiry: Date.now() + SESSION_DURATION,
        },
      ],
      email: email,
      createdProfileIds: [],
      savedProfileIds: [],
      unlockedProfileIds: [],
      imageUrl: DUMMY_IMG_URL + (Math.floor(Math.random() * 50) + 1),
    };
    await insertUser(newUser);
    return sessionId;
  } catch (e: any) {
    if (e instanceof AppError) {
      throw e;
    }
    throw new HelperError(e.message);
  }
};
