import { WithId } from 'mongodb';
import { getUserCollection } from '../db';
import { AppError, BadRequestError, DbError, NotFoundError } from '../util/appError';
import { IProfile } from './profile.db';

// Duration (in ms) to keep session alive.
export const SESSION_DURATION = 1 * 60 * 60 * 1000;

export interface ISession {
  sessionId: string;
  expiry: number;
}

export interface IUser {
  userId: string;
  username: string;
  password: string;
  sessions: ISession[];
  email: string;
  createdProfileIds: string[];
  savedProfileIds: string[];
  unlockedProfileIds: string[];
}
/**
 * Insert new user into DB.
 * @param userData - User document.
 */
export const insertUser = async (userData: IUser): Promise<void> => {
  try {
    const userCollection = getUserCollection();
    const insertResult = await userCollection.insertOne(userData);
    if (!insertResult.acknowledged) {
      throw new DbError(`Could not insert user with username ${userData.username}.`);
    }
  } catch (e: any) {
    if (e instanceof AppError) {
      throw e;
    } else {
      throw new DbError(e.message);
    }
  }
};

/**
 * Check if session is valid.
 * @param sessionId - Session ID.
 * @returns {boolean} True if session with given session ID is valid, and false otherwise.
 */
export const checkValidSession = async (sessionId: string): Promise<boolean> => {
  try {
    const userCollection = getUserCollection();
    const user = await userCollection.findOne({
      'sessions.sessionId': sessionId,
      'sessions.expiry': {
        $gt: Date.now(),
      },
    });
    if (!user) {
      return false;
    }
    return true;
  } catch (e: any) {
    if (e instanceof AppError) {
      throw e;
    } else {
      throw new DbError(e.message);
    }
  }
};

/**
 * Find user by session ID.
 * @param sessionId - Session ID.
 * @returns {WithId<IUser>} User document of user with given session Id.
 */
export const findUserBySession = async (sessionId: string): Promise<WithId<IUser>> => {
  try {
    const userCollection = getUserCollection();
    const user = await userCollection.findOne({
      'sessions.sessionId': sessionId,
      'sessions.expiry': {
        $gt: Date.now(),
      },
    });
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  } catch (e: any) {
    if (e instanceof AppError) {
      throw e;
    } else {
      throw new DbError(e.message);
    }
  }
};

/**
 * Check if a user with the given username already exists.
 * @param user - username of user.
 * @returns {boolean} - True if user already exists, and false otherwise.
 */
export const checkUsernameExists = async (username: string): Promise<boolean> => {
  try {
    const userCollection = getUserCollection();
    const user = await userCollection.findOne({
      username: username,
    });
    if (user) {
      return true;
    }
    return false;
  } catch (e: any) {
    if (e instanceof AppError) {
      throw e;
    } else {
      throw new DbError(e.message);
    }
  }
};

/**
 * Find user with given username.
 * @param username - Username of user.
 * @returns {WithId<IUser>} - User document.
 */
export const findUserByUsername = async (username: string): Promise<WithId<IUser>> => {
  try {
    const userCollection = getUserCollection();
    const user = await userCollection.findOne({
      username: username,
    });
    if (!user) {
      throw new NotFoundError('User not found.');
    }
    return user;
  } catch (e: any) {
    if (e instanceof AppError) {
      throw e;
    } else {
      throw new DbError(e.message);
    }
  }
};

/**
 * Find user with given userId.
 * @param userId - User ID of user.
 * @returns {WithId<IUser>} - User document.
 */
export const findUserById = async (userId: string): Promise<WithId<IUser>> => {
  try {
    const userCollection = getUserCollection();
    const user = await userCollection.findOne({
      userId: userId,
    });
    if (!user) {
      throw new NotFoundError('User not found.');
    }
    return user;
  } catch (e: any) {
    if (e instanceof AppError) {
      throw e;
    } else {
      throw new DbError(e.message);
    }
  }
};

/**
 * Update user session expiry to last for SESSION_DURATION more time.
 * @param sessionId - sessionId of session to be refreshed.
 */
export const refreshUserSession = async (sessionId: string): Promise<void> => {
  try {
    const userCollection = getUserCollection();
    await userCollection.findOneAndUpdate(
      {
        'sessions.sessionId': sessionId,
      },
      {
        $set: {
          'sessions.$.expiry': Date.now() + SESSION_DURATION,
        },
      },
    );
  } catch (e: any) {
    if (e instanceof AppError) {
      throw e;
    } else {
      throw new DbError(e.message);
    }
  }
};

/**
 * Delete all expired sessions for user with given userId.
 * @param userId user Id of user to delete expired sessions for.
 */
export const deleteExpiredUserSessions = async (userId: string) => {
  try {
    const userCollection = getUserCollection();
    await userCollection.findOneAndUpdate(
      {
        userId: userId,
      },
      {
        $pull: {
          sessions: {
            expiry: {
              $lt: Date.now(),
            },
          },
        },
      },
    );
  } catch (e: any) {
    if (e instanceof AppError) {
      throw e;
    } else {
      throw new DbError(e.message);
    }
  }
};

/**
 * Add given session to user with given userId.
 * @param userId - User ID of user to update.
 * @param session - session document.
 */
export const addUserSession = async (userId: string, session: ISession) => {
  try {
    const userCollection = getUserCollection();
    await userCollection.findOneAndUpdate(
      {
        userId: userId,
      },
      {
        $push: {
          sessions: session,
        },
      },
    );
  } catch (e: any) {
    if (e instanceof AppError) {
      throw e;
    } else {
      throw new DbError(e.message);
    }
  }
};

/**
 * delete given session from user with given userId.
 * @param userId - User Id of user to update.
 * @param sessionId - session ID to delete.
 */
export const deleteUserSession = async (userId: string, sessionId: string) => {
  try {
    const userCollection = getUserCollection();
    await userCollection.findOneAndUpdate(
      {
        userId: userId,
      },
      {
        $pull: {
          sessions: {
            sessionId: sessionId,
          },
        },
      },
    );
  } catch (e: any) {
    if (e instanceof AppError) {
      throw e;
    } else {
      throw new DbError(e.message);
    }
  }
};

/**
 * Add given profile ID to created profiles of user with given userId.
 * @param userId - User ID of user to update.
 * @param profileId - Profile ID.
 */
export const addCreatedProfile = async (userId: string, profileId: string) => {
  try {
    const userCollection = getUserCollection();
    await userCollection.findOneAndUpdate(
      {
        userId: userId,
      },
      {
        $push: {
          createdProfileIds: profileId,
        },
      },
    );
  } catch (e: any) {
    if (e instanceof AppError) {
      throw e;
    } else {
      throw new DbError(e.message);
    }
  }
};

/**
 * Add given profile ID to unlocked profiles of user with given userId.
 * @param userId - User ID of user to update.
 * @param profileId - Profile ID.
 */
export const addUnlockedProfile = async (userId: string, profileId: string) => {
  try {
    const userCollection = getUserCollection();
    await userCollection.findOneAndUpdate(
      {
        userId: userId,
      },
      {
        $push: {
          unlockedProfileIds: profileId,
        },
      },
    );
  } catch (e: any) {
    if (e instanceof AppError) {
      throw e;
    } else {
      throw new DbError(e.message);
    }
  }
};
