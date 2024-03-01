import express, { Request, Response, NextFunction } from 'express';
import { authenticateAll } from '../middleware/authenticate';
import { AppError, BadRequestError, RouteError } from '../util/appError';
import { addSavedProfile, addUnlockedProfile, deleteUserSession } from '../models/user.db';
import { createUser } from '../helper/user.create';
import { loginUser } from '../helper/user.login';
import { profile } from 'console';

const router = express.Router();

/**
 * POST /api/user/login
 * @param {string} username - Username of existing user.
 * @param {string} password - Password of existing user.
 * Route to log-in existing user.
 */
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body.username || !req.body.password) {
      throw new BadRequestError('Incomplete information to process request.');
    }
    const sessionId = await loginUser(req.body.username, req.body.password);
    return res
      .cookie('sessionId', sessionId, {
        secure: true,
        httpOnly: true,
      })
      .sendStatus(200);
  } catch (e: any) {
    if (e instanceof AppError) {
      next(e);
    } else {
      next(new RouteError(e.message));
    }
  }
});

/**
 * DELETE /api/user/logout
 * Route to log-out existing user.
 */
router.delete('/logout', authenticateAll, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.cookies['sessionId']) {
      throw new BadRequestError('Incomplete information to process request.');
    }
    await deleteUserSession(req.user!.userId, req.cookies['sessionId']);
    return res.clearCookie('sessionId').sendStatus(200);
  } catch (e: any) {
    if (e instanceof AppError) {
      next(e);
    } else {
      next(new RouteError(e.message));
    }
  }
});

router
  /**
   * POST /api/user
   * @param {string} username - Username of new user.
   * @param {string} password - Password of new user.
   * Route to create new user.
   */
  .post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body.username || !req.body.password || !req.body.email) {
        throw new BadRequestError('Incomplete information to process request.');
      }
      const sessionId = await createUser(req.body.username, req.body.password, req.body.email);
      return res
        .cookie('sessionId', sessionId, {
          secure: true,
          httpOnly: true,
        })
        .sendStatus(200);
    } catch (e: any) {
      if (e instanceof AppError) {
        next(e);
      } else {
        next(new RouteError(e.message));
      }
    }
  });

router
  /**
   * PUT /api/user/unlock/:profileId
   * Unlock profile.
   */
  .put('/unlock/:profileId', authenticateAll, async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.params.profileId) {
        throw new BadRequestError('Incomplete information to process request.');
      }
      // TODO ensure profile exists and has not already been unlocked.
      await addUnlockedProfile(req.user!.userId, req.params.profileId);
      return res.sendStatus(200);
    } catch (e: any) {
      if (e instanceof AppError) {
        next(e);
      } else {
        next(new RouteError(e.message));
      }
    }
  })
  /**
   * PUT /api/user/save/:profileId
   * Save profile.
   */
  .put('/save/:profileId', authenticateAll, async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.params.profileId) {
        throw new BadRequestError('Incomplete information to process request.');
      }
      // TODO ensure profile exists and has not already been unlocked.
      await addSavedProfile(req.user!.userId, req.params.profileId);
      return res.sendStatus(200);
    } catch (e: any) {
      if (e instanceof AppError) {
        next(e);
      } else {
        next(new RouteError(e.message));
      }
    }
  });

export default router;
