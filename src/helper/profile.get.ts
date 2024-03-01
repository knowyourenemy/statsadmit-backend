import { IProfile, findProfileById } from '../models/profile.db';
import { findUserById } from '../models/user.db';

/**
 * Get profile details. Returns full profile if profile is unlocked, and modified profile (with essays and test scores hidden) otherwise.
 * @param profileId - Profile ID.
 * @param userId - User ID.
 * @returns {IProfile} Profile Data.
 */
export const getProfile = async (profileId: string, userId: string): Promise<IProfile> => {
  const userData = await findUserById(userId);
  const profileData = await findProfileById(profileId);
  if (userData.unlockedProfileIds.includes(profileId) || userData.createdProfileIds.includes(profileId)) {
    return profileData;
  } else {
    return {
      ...profileData,
      essayResponses: profileData.essayResponses.map((essay) => {
        return {
          question: essay.question,
          response: essay.response.slice(0, 10),
        };
      }),
      testScores: profileData.testScores.map((test) => {
        return {
          test: test.test,
          score: '',
        };
      }),
    };
  }
};
