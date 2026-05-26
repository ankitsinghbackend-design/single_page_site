import { db } from '../../config/db';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, comparePassword } from '../../utils/hash.utils';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt.utils';

// In-memory blacklist for refresh tokens
// Note: A Redis solution is preferred for production
const refreshBlacklist = new Set<string>();

export const authService = {
  async register(email: string, password: string) {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const passwordHash = await hashPassword(password);
    
    const [newUser] = await db.insert(users).values({
      email,
      passwordHash,
    }).returning();

    const payload = { id: newUser.id, email: newUser.email, role: newUser.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    return { user: payload, accessToken, refreshToken };
  },

  async login(email: string, password: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    return { user: payload, accessToken, refreshToken };
  },

  async refresh(refreshToken: string) {
    if (refreshBlacklist.has(refreshToken)) {
      throw new Error('Refresh token revoked');
    }

    const decoded = verifyRefreshToken(refreshToken) as any;
    const user = await db.query.users.findFirst({
      where: eq(users.id, decoded.id),
    });

    if (!user) {
      throw new Error('User not found');
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const newAccessToken = signAccessToken(payload);

    return { accessToken: newAccessToken };
  },

  async logout(refreshToken: string) {
    refreshBlacklist.add(refreshToken);
    return true;
  },
};
