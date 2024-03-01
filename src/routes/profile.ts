import express, { Request, Response, NextFunction } from 'express';
import { AppError, BadRequestError, RouteError } from '../util/appError';
import { authenticateAll } from '../middleware/authenticate';
import { createProfile } from '../helper/profile.create';

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
  });

export default router;
