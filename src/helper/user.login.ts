import { ISession, SESSION_DURATION, addUserSession, deleteExpiredUserSessions, findUser } from '../models/user.db';
import { v4 as uuidv4 } from 'uuid';
import { AppError, HelperError, NotFoundError } from '../util/appError';
import bcrypt from 'bcrypt';

/**
 * Log-in user with given username and password.
 * @param username - username of user.
 * @param password - password of user.
 * @param existingSessionId - Existing session ID from cookies (if any).
 * @returns {string} Session ID of user session.
 */
export const loginUser = async (username: string, password: string): Promise<string> => {
  try {
    const user = await findUser(username);
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new NotFoundError('User not found.');
    }
    await deleteExpiredUserSessions(user.userId);
    const sessionId = uuidv4();
    const session: ISession = {
      sessionId: sessionId,
      expiry: Date.now() + SESSION_DURATION,
    };
    await addUserSession(user.userId, session);
    return sessionId;
  } catch (e: any) {
    if (e instanceof AppError) {
      throw e;
    }
    throw new HelperError(e.message);
  }
};
