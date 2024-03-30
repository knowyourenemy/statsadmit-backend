import {
  IProfile,
  IProfilePreview,
  IProfileAuthenticated,
  findProfileById,
  getAllProfilePreviews,
  getProfilePreviews,
} from '../models/profile.db';
import { findUserById } from '../models/user.db';

const removeEssays = (profilePreview: IProfilePreview) => {
  return {
    ...profilePreview,
    schoolsAdmitted: profilePreview.schoolsAdmitted.map((school) => {
      return {
        ...school,
        essays: [],
      };
    }),
  };
};

/**
 * Get profile details. Returns full profile if profile is unlocked, and modified profile (with essays and test scores hidden) otherwise.
 * @param profileId - Profile ID.
 * @param userId - User ID.
 * @returns {IProfileAuthenticated} Profile Data.
 */
export const getProfile = async (profileId: string, userId: string): Promise<IProfileAuthenticated> => {
  const userData = await findUserById(userId);
  const profileData = await findProfileById(profileId);
  if (userData.createdProfileIds.includes(profileId)) {
    return {
      ...profileData,
      isOwned: true,
      isUnlocked: userData.unlockedProfileIds.includes(profileId),
      isSaved: userData.savedProfileIds.includes(profileId),
    };
  } else if (userData.unlockedProfileIds.includes(profileId)) {
    return {
      ...profileData,
      isOwned: false,
      isUnlocked: true,
      isSaved: userData.savedProfileIds.includes(profileId),
    };
  } else {
    return {
      ...profileData,
      // essayResponses: profileData.essayResponses.map((essay) => {
      //   return {
      //     question: essay.question,
      //     response: essay.response.slice(0, 10),
      //   };
      // }),
      schoolsAdmitted: profileData.schoolsAdmitted.map((schoolAdmitted) => {
        return {
          ...schoolAdmitted,
          essays: schoolAdmitted.essays.map((essay) => {
            return {
              title: essay.title,
              content: essay.content.slice(0, 10),
            };
          }),
        };
      }),
      testScores: profileData.testScores.map((test) => {
        return {
          test: test.test,
          score: '',
        };
      }),
      isOwned: false,
      isUnlocked: false,
      isSaved: userData.savedProfileIds.includes(profileId),
    };
  }
};

/**
 * Get all profile previews
 * @returns {IProfilePreview} Profile preview data.
 */
export const getAllPreviews = async (): Promise<IProfilePreview[]> => {
  const profilePreviews = await getAllProfilePreviews();
  return profilePreviews.map((preview) => {
    return removeEssays(preview);
  });
};

/**
 * Get profile previews of unlocked profiles.
 * @param userId - User ID.
 * @returns {IProfilePreview} Profile preview data.
 */
export const getUnlockedProfilePreviews = async (userId: string): Promise<IProfilePreview[]> => {
  const userData = await findUserById(userId);
  const profilePreviews = await getProfilePreviews(userData.unlockedProfileIds);
  return profilePreviews.map((preview) => {
    return removeEssays(preview);
  });
};

/**
 * Get profile previews of saved profiles.
 * @param userId - User ID.
 * @returns {IProfilePreview} Profile preview data.
 */
export const getSavedProfilePreviews = async (userId: string): Promise<IProfilePreview[]> => {
  const userData = await findUserById(userId);
  const profilePreviews = await getProfilePreviews(userData.savedProfileIds);
  return profilePreviews.map((preview) => {
    return removeEssays(preview);
  });
};
