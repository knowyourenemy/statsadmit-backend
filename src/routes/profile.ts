import express, { Request, Response, NextFunction } from 'express';
import { AppError, BadRequestError, RouteError } from '../util/appError';
import { authenticateAll } from '../middleware/authenticate';
import { createProfile } from '../helper/profile.create';
import { getProfile, getSavedProfilePreviews, getUnlockedProfilePreviews } from '../helper/profile.get';
import { getAllProfilePreviews } from '../models/profile.db';

const router = express.Router();

router
  /**
   * POST /api/profile
   * @param {string} title - Message title.
   * @param {string} description - Message description.
   * @returns {{messageId: string}} Message ID.
   * Create new message.
   */
  .post('/', authenticateAll, async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (
        !req.body.price ||
        !req.body.schoolAdmitted ||
        !req.body.schoolCountry ||
        !req.body.essayResponses ||
        !req.body.testScores
      ) {
        throw new BadRequestError('Incomplete information to process request.');
      }
      const profileId = await createProfile(
        req.body.price,
        req.body.schoolAdmitted,
        req.body.schoolCountry,
        req.body.essayResponses,
        req.body.testScores,
        req.user!,
      );
      return res.status(200).send({ profileId: profileId });
    } catch (e: any) {
      if (e instanceof AppError) {
        next(e);
      } else {
        next(new RouteError(e.message));
      }
    }
  })

  /**
   * GET /api/profile/unlocked
   * @returns {IProfilePreview[]} Profile previews.
   * Get unlocked profile previews.
   */
  .get('/unlocked', authenticateAll, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profilePreviews = await getUnlockedProfilePreviews(req.user!.userId);
      return res.status(200).send(profilePreviews);
    } catch (e: any) {
      if (e instanceof AppError) {
        next(e);
      } else {
        next(new RouteError(e.message));
      }
    }
  })
  /**
   * GET /api/profile/saved
   * @returns {IProfilePreview[]} Profile previews.
   * Get saved profile previews.
   */
  .get('/saved', authenticateAll, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profilePreviews = await getSavedProfilePreviews(req.user!.userId);
      return res.status(200).send(profilePreviews);
    } catch (e: any) {
      if (e instanceof AppError) {
        next(e);
      } else {
        next(new RouteError(e.message));
      }
    }
  })
  /**
   * GET /api/profile/:profileId
   * @param {string} profileId - Profile ID.
   * @returns {IProfile} Profile data.
   * Get profile data.
   */
  .get('/:profileId', authenticateAll, async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.params.profileId) {
        throw new BadRequestError('Incomplete information to process request.');
      }
      const profileData = await getProfile(req.params.profileId, req.user!.userId);
      return res.status(200).send(profileData);
    } catch (e: any) {
      if (e instanceof AppError) {
        next(e);
      } else {
        next(new RouteError(e.message));
      }
    }
  })
  /**
   * GET /api/profile/
   * @returns {IProfilePreview[]} Profile previews.
   * Get all profile previews.
   */
  .get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profilePreviews = await getAllProfilePreviews();
      return res.status(200).send(profilePreviews);
    } catch (e: any) {
      if (e instanceof AppError) {
        next(e);
      } else {
        next(new RouteError(e.message));
      }
    }
  });

export default router;
