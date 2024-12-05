import { Router } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../prisma';
import { loginRequestSchema, loginResponseSchema } from './authTypes';
import { handleCatching, RequestProcessingError } from '../error';
import { generateToken } from '../encrypt';

const router = Router();

const ACCESS_TOKEN_TTL_SECONDS = 60 * 60;
const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;
const REFRESH_TOKEN_BACKDATE_SECONDS = 30;
const REFRESH_TOKEN_COOKIE_NAME = 'REFRESH_TOKEN';

/**
 * Refresh access token based on refresh token (secure cookie).
 */
router.get(
  '/refresh',
  handleCatching(async (_, res) => {
    res.send('OK');
  })
);

/**
 * Login with credentials.
 */
router.post(
  '/login',
  handleCatching(async (req, res) => {
    const { success, data: credentials } = loginRequestSchema.safeParse(
      req.body
    );

    if (!success || !credentials) {
      throw new RequestProcessingError('Invalid credentials', 400);
    }

    const dbUser = await prisma.user.findFirst({
      where: {
        OR: [{ username: credentials.login }, { email: credentials.login }],
      },
    });

    if (!dbUser) {
      throw new RequestProcessingError('User not found', 401);
    }

    if (dbUser.authType !== 'internal') {
      throw new RequestProcessingError('User can only login via SSO', 401);
    }

    if (dbUser.status !== 'active') {
      throw new RequestProcessingError('User account has been suspended', 401);
    }

    let passwordMatches = false;
    if (dbUser.password) {
      passwordMatches = await bcrypt.compare(
        credentials.password,
        dbUser.password
      );
    }

    if (!passwordMatches) {
      throw new RequestProcessingError('Invalid password', 401);
    }

    const epochSeconds = Math.floor(Date.now() / 1000);
    const accessToken = generateToken(
      dbUser.id,
      ACCESS_TOKEN_TTL_SECONDS,
      epochSeconds
    );

    if (
      typeof req.query.noCookie === 'undefined' ||
      req.query.noCookie === 'false'
    ) {
      const refreshToken = generateToken(
        dbUser.id,
        REFRESH_TOKEN_TTL_SECONDS,
        REFRESH_TOKEN_BACKDATE_SECONDS,
        epochSeconds
      );

      const cookieExpirationDate = new Date(
        (epochSeconds -
          REFRESH_TOKEN_BACKDATE_SECONDS +
          REFRESH_TOKEN_TTL_SECONDS) *
          1000
      );

      res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
        expires: cookieExpirationDate,
        maxAge:
          (REFRESH_TOKEN_TTL_SECONDS - REFRESH_TOKEN_BACKDATE_SECONDS) * 1000,
        path: req.baseUrl,
      });
    }

    const result = loginResponseSchema.parse({
      accessToken,
      user: dbUser,
    });

    res.status(200).json(result);
  })
);

/**
 * Logout current user.
 */
router.get('/logout', (_, res) => {
  res.send('OK');
});

export default Router().use('/auth', router);
