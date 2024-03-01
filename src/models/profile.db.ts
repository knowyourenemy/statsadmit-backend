import { WithId } from 'mongodb';
import { getProfileCollection } from '../db';
import { AppError, DbError, NotFoundError } from '../util/appError';

export interface IProfile {
  profileId: string;
  userId: string;
  dateCreated: number;
  userName: string;
  price: number;
  schoolAdmitted: string;
  schoolCountry: string;
  purchaseCount: number;
  essayResponses: IEssayResponse[];
  testScores: ITestScore[];
  published: boolean;
}

export interface IEssayResponse {
  question: string;
  response: string;
}

export interface ITestScore {
  test: string;
  score: string;
}

export type IProfilePreview = Pick<IProfile, 'profileId' | 'userName' | 'price' | 'schoolAdmitted' | 'purchaseCount'>;

/**
 * Insert new profile into DB
 * @param {IProfile} profileData - Profile document.
 */
export const insertProfile = async (profileData: IProfile): Promise<void> => {
  try {
    const profileCollection = getProfileCollection();
    const insertResult = await profileCollection.insertOne(profileData);
    if (!insertResult.acknowledged) {
      throw new DbError(`Could not insert profile ${profileData.profileId} for user ${profileData.userId}.`);
    }
  } catch (e: any) {
    if (e instanceof AppError) {
      throw e;
    } else {
      throw new DbError(e.profile);
    }
  }
};

/**
 * Get all profile previews.
 * @returns {WithId<IProfile>[]} All profile previews.
 */
export const getAllProfilePreviews = async (): Promise<WithId<IProfilePreview>[]> => {
  try {
    const profileCollection = getProfileCollection();
    const profiles = await profileCollection
      .find(
        {},
        {
          projection: {
            profileId: 1,
            userName: 1,
            price: 1,
            schoolAdmitted: 1,
            purchaseCount: 1,
          },
        },
      )
      .sort({ purchaseCount: -1 })
      .toArray();
    return profiles;
  } catch (e: any) {
    if (e instanceof AppError) {
      throw e;
    } else {
      throw new DbError(e.message);
    }
  }
};

/**
 * Find profile by ID.
 * @param {string} profileId - profile ID
 * @returns {WithId<IProfile>} profile with matching profile ID.
 */
export const findProfileById = async (profileId: string): Promise<WithId<IProfile>> => {
  try {
    const profileCollection = getProfileCollection();
    const profile = await profileCollection.findOne({ profileId: profileId });
    if (!profile) {
      throw new NotFoundError(`Profile with profile ID ${profileId} not found.`);
    }
    return profile;
  } catch (e: any) {
    if (e instanceof AppError) {
      throw e;
    } else {
      throw new DbError(e.message);
    }
  }
};
