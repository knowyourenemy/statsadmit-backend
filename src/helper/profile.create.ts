import { WithId } from 'mongodb';
import { AppError, BadRequestError, HelperError } from '../util/appError';
import { IEssayResponse, IProfile, ITestScore, insertProfile } from '../models/profile.db';
import { IUser, addCreatedProfile } from '../models/user.db';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create a new profile.
 * @param {number} price - Price to unlock profile.
 * @param {string} schoolAdmitted - Profile school name.
 * @param {string} schoolCountry - Profile school country.
 * @param {IEssayResponse[]} essayResponses - Essay responses.
 * @param {ITestScore[]} testScores: Test scores.
 * @param {WithId<IUser>} userData - User data of user creating profile.
 * @returns {string} profile ID.
 */
export const createProfile = async (
  price: number,
  schoolAdmitted: string,
  schoolCountry: string,
  essayResponses: IEssayResponse[],
  testScores: ITestScore[],
  userData: WithId<IUser>,
): Promise<string> => {
  try {
    // TODO: Add profile validation
    const profileId = uuidv4();
    const profileData: IProfile = {
      profileId: profileId,
      userId: userData.userId,
      userName: userData.username,
      dateCreated: Date.now(),
      price: price,
      schoolAdmitted: schoolAdmitted,
      schoolCountry: schoolCountry,
      purchaseCount: 0,
      essayResponses: essayResponses,
      testScores: testScores,
      published: true,
    };
    await insertProfile(profileData);
    await addCreatedProfile(userData.userId, profileId);
    return profileId;
  } catch (e: any) {
    if (e instanceof AppError) {
      throw e;
    }
    throw new HelperError(e.profile);
  }
};
