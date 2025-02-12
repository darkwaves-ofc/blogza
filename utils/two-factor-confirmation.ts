import { db } from "@/lib/db";

/**
 * Retrieves the two-factor confirmation record for the specified user ID.
 *
 * @param userId - The ID of the user to retrieve the two-factor confirmation record for.
 * @returns The two-factor confirmation record for the specified user, or `null` if not found.
 */
export const getTwoFactorConfirmationByUserId = async (
  userId: string
) => {
  try {
    const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
      where: { userId }
    });

    return twoFactorConfirmation;
  } catch {
    return null;
  }
};
