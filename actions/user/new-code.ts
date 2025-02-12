"use server";

import { db } from "@/lib/db";
import { generateSixDigitCodeToken } from "@/lib/tokens";
import { sendCodeEmail, sendVerificationEmail } from "@/lib/mail";
import { currentUser } from "@/utils/auth";
import { error } from "console";

export const sendVerificationCode = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return { error: "User Not Found" };
    }

    if (!user.email) {
      return { error: "Email Not Found" };
    }

    const verificationToken = await generateSixDigitCodeToken(user.email);

    await sendCodeEmail(verificationToken.email, verificationToken.otp);

    return { success: "Verification code sent!" };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong!" };
  }
};

export const verifyToken = async (otp: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { error: "User Not Found" };
    }

    if (!user.email) {
      return { error: "Email Not Found" };
    }

    const existingToken = await db.oTPConfirmation.findUnique({
      where: {
        otp: otp,
        email: user.email,
      },
    });

    if (!existingToken) {
      return { error: "Token does not exist!" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return { error: "Token has expired!" };
    }

    return { success: "Token verified successfully!" };
  } catch (error) {
    return { error: "Something went wrong!" };
  }
};

export async function getTokenFromOTP(otp: string) {}
