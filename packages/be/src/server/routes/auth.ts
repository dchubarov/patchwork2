import { Router } from 'express';
import bcrypt from 'bcrypt';
import { loginRequestSchema, loginResponseSchema } from '@patchwork2/shared';
import { handleCatching, RequestProcessingError } from '../../lib/error';
import { generateToken, verifyToken } from '../../lib/encrypt';
import { transformUser } from '../../lib/transform';
import { userRepository } from '../../orm';

const ACCESS_TOKEN_TTL_SECONDS = 60 * 60;
const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;
const REFRESH_TOKEN_BACKDATE_SECONDS = 30;
const REFRESH_TOKEN_COOKIE_NAME = '__Secure-RefreshToken';

const controller = Router();

/**
 * Refresh access token based on refresh token (secure cookie).
 */
controller.get(
  '/refresh',
  handleCatching(async (req, res) => {
    if (!req.cookies[REFRESH_TOKEN_COOKIE_NAME])
      throw new RequestProcessingError('No refresh token received', 401);

    let userId;
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
    const payload = verifyToken(refreshToken);
    if (payload.sub && payload.sub.startsWith('user:')) {
      userId = parseInt(payload.sub.substring(5));
    }
    if (!userId) throw new RequestProcessingError('Invalid token', 401);

    const dbUser = await userRepository.findById(userId);
    if (!dbUser || dbUser.status !== 'active') {
      throw new RequestProcessingError('User not found', 401);
    }

    const accessToken = generateToken(dbUser.id, ACCESS_TOKEN_TTL_SECONDS);
    const result = loginResponseSchema.parse({
      user: transformUser(dbUser),
      accessToken,
    });

    res.status(200).json(result);
  })
);

/**
 * Login with JSON credentials.
 */
controller.post(
  '/login',
  handleCatching(async (req, res) => {
    const { success, data: credentials } = loginRequestSchema.safeParse(
      req.body
    );

    if (!success || !credentials) {
      throw new RequestProcessingError('Invalid credentials', 400);
    }

    const dbUser = await userRepository.findByLogin(credentials.login);

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
      0,
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
        httpOnly: req.secure,
        secure: req.secure,
        sameSite: 'none',
      });
    }

    const result = loginResponseSchema.parse({
      user: transformUser(dbUser),
      accessToken,
    });

    res.status(200).json(result);
  })
);

/**
 * Logout current user.
 */
controller.get('/logout', (req, res) => {
  if (req.cookies[REFRESH_TOKEN_COOKIE_NAME]) {
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, '', {
      path: req.baseUrl,
      maxAge: 0,
      secure: req.secure,
      httpOnly: req.secure,
      sameSite: 'none',
    });
  }
  res.status(204).end();
});

export default Router().use('/auth', controller);
