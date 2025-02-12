import { db } from "@/lib/db";

/**
 * Retrieves a password reset token by its token value.
 *
 * @param token - The token value to search for.
 * @returns The password reset token if found, or `null` if not found.
 */
export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findUnique({
      where: { token }
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};

/**
 * Retrieves a password reset token by its token value.
 *
 * @param token - The token value to search for.
 * @returns The password reset token if found, or `null` if not found.
 */
export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findFirst({
      where: { email }
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};


/**
 * Retrieves a password reset OTP by its OTP value.
 *
 * @param otp - The OTP value to search for.
 * @returns The password reset OTP if found, or `null` if not found.
 */
export const getPasswordResetOTPByOtp = async (otp: string) => {
  try {
    const passwordResetOTP = await db.oTPConfirmation.findFirst({
      where: { otp }
    });

    return passwordResetOTP;
  } catch {
    return null;
  }
};


/**
 * Retrieves a verification OTP token for the given email address.
 *
 * @param email - The email address to get the verification OTP for.
 * @returns The verification OTP token if found, null otherwise.
 */
export const getVerificationOtpByEmail = async (email: string) => {
  try {
    const verificationToken = await db.oTPConfirmation.findFirst({
      where: {
        email,
      },
    });

    return verificationToken;
  } catch {
    return null;
  }
};
