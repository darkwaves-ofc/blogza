import { db } from "@/lib/db";

/**
 * Retrieves a two-factor authentication token by the provided token string.
 *
 * @param token - The token string to search for.
 * @returns The two-factor authentication token if found, otherwise `null`.
 */
export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findUnique({
      where: { token }
    });

    return twoFactorToken;
  } catch {
    return null;
  }
};

/**
 * Retrieves a two-factor authentication token by the associated email address.
 *
 * @param email - The email address associated with the two-factor authentication token.
 * @returns The two-factor authentication token, or `null` if not found.
 */
export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findFirst({
      where: { email }
    });

    return twoFactorToken;
  } catch {
    return null;
  }
};
