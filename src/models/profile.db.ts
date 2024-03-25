import { WithId } from 'mongodb';
import { getProfileCollection } from '../db';
import { AppError, DbError, NotFoundError } from '../util/appError';

export interface IProfile {
  profileId: string;
  userId: string;
  dateCreated: number;
  name: string;
  price: number;
  schoolsAdmitted: ISchoolAdmitted[];
  schoolCountry: string;
  purchaseCount: number;
  testScores: ITestScore[];
  published: boolean;
  currentSchool: string;
  currentMajor: string;
  currentDescription: string;
  imageUrl: string;
}

export interface IProfileWithOwned extends IProfile {
  isOwned: boolean;
}

export interface IEssayResponse {
  title: string;
  content: string;
}

export interface ITestScore {
  test: string;
  score: string;
}

export interface ISchoolAdmitted {
  name: string;
  degree: string;
  major: string;
  status: 'Accepted' | 'Rejected';
  essays: IEssayResponse[];
}

export type IProfilePreview = Pick<
  IProfile,
  'profileId' | 'name' | 'price' | 'schoolsAdmitted' | 'currentSchool' | 'imageUrl'
>;

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
            name: 1,
            price: 1,
            schoolsAdmitted: 1,
            purchaseCount: 1,
            imageUrl: 1,
            currentSchool: 1,
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
 * Get profile previews for profiles in given list of profile IDs.
 * @param {string[]} profileIds - Profile IDs of profile previews to fetch.
 * @returns {WithId<IProfile>[]} Profile previews.
 */
export const getProfilePreviews = async (profileIds: string[]): Promise<WithId<IProfilePreview>[]> => {
  try {
    const profileCollection = getProfileCollection();
    const profiles = await profileCollection
      .find(
        { profileId: { $in: profileIds } },
        {
          projection: {
            profileId: 1,
            name: 1,
            price: 1,
            schoolsAdmitted: 1,
            purchaseCount: 1,
            imageUrl: 1,
          },
        },
      )
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
