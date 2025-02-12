import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";
import { getVerificationTokenByEmail } from "@/utils/verification-token";
import { getPasswordResetTokenByEmail, getVerificationOtpByEmail } from "@/utils/password-reset-token";
import { getTwoFactorTokenByEmail } from "@/utils/two-factor-token";

/**
 * Generates a new two-factor authentication token for the given email address.
 *
 * If an existing token is found for the email, it is first deleted before creating a new one.
 *
 * @param email - The email address to generate the token for.
 * @returns The newly created two-factor authentication token.
 */
export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

  const existingToken = await getTwoFactorTokenByEmail(email);

  if (existingToken) {
    await db.twoFactorToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return twoFactorToken;
};
/**
 * Generates a new token with a unique identifier and a specified expiration time.
 *
 * @param modelName - The name of the model to associate the token with.
 * @param fieldName - The name of the field in the model to store the token.
 * @param maxRetries - The maximum number of attempts to generate a unique token.
 * @returns A new token string.
 */
export const generateToken = async (
  modelName: string,
  fieldName: string,
  maxRetries = 5
) => {
  let token;
  let existingRecord;
  for (let i = 0; i < maxRetries; i++) {
    token = jwt.sign(
      { id: crypto.randomUUID() + Date.now() },
      process.env.APP_SECRET as string
    );
    existingRecord = await (db as any)[modelName].findFirst({
      where: { [fieldName]: token },
    });
    if (!existingRecord) break;
  }
  if (!token) throw new Error("Could not generate token");
  return token;
};

/**
 * Generates a new password reset token for the specified email address.
 *
 * @param email - The email address to generate the password reset token for.
 * @returns A new password reset token object.
 */
export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken;
};

/**
 * Generates a new email verification token for the given email address.
 *
 * @param email - The email address to generate the verification token for.
 * @returns A new verification token object containing the token string and its expiration date.
 */
export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationToken;
};

export default function generateOTP(length: number = 6): string {
  if (length <= 0) {
    throw new Error("OTP length must be greater than 0");
  }

  // Generate a random numeric OTP
  const digits = "0123456789";
  let otp = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    otp += digits[randomIndex];
  }

  return otp;
}




// Function to generate 6-digit code from UUID
/**
 * Generates a 6-digit code from a UUID token.
 *
 * This function takes a UUID string, removes the hyphens, and extracts the first 6 characters of the hexadecimal representation. It then converts the hexadecimal value to a decimal number and ensures the result is a 6-digit string by using modulo and padding.
 *
 * @param uuid - The UUID token to generate the 6-digit code from.
 * @returns A 6-digit code generated from the UUID token.
 */
export const generateSixDigitCodeToken = async (email: string) => {
  const expires = new Date(new Date().getTime() + 3600 * 1000);
 const otp =  generateOTP(6)
  const existingToken = await getVerificationOtpByEmail(email);

  if (existingToken) {
    await db.oTPConfirmation.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verificationToken = await db.oTPConfirmation.create({
    data: {
      email,
      otp,
      expires,
    },
  });

  return verificationToken;
};
