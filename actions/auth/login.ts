"use server";

import * as z from "zod";
// import { AuthAction } from "next-auth";

import { db } from "@/lib/db";
// import { signIn } from "@/auth";
import { getUserByEmail } from "@/utils/user";
import { getTwoFactorTokenByEmail } from "@/utils/two-factor-token";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import {
  generateVerificationToken,
  generateTwoFactorToken,
} from "@/lib/tokens";
import { getTwoFactorConfirmationByUserId } from "@/utils/two-factor-confirmation";
import { LoginSchema } from "@/schemas/auth";

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) => {
  console.log("Login function called with values:", values);

  const validatedFields = LoginSchema.safeParse(values);
  console.log("Validated fields:", validatedFields);

  if (!validatedFields.success) {
    console.log("Validation failed");
    return { error: validatedFields.error.errors.map(err=>`${err.path.join('.')}:${err.message}`).join(", ") };
  }

  const { email, password, code } = validatedFields.data;
  console.log("Extracted data:", { email, password, code });

  const existingUser = await getUserByEmail(email);
  console.log("Existing user:", existingUser);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    console.log("User not found or incomplete data");
    return { error: "Email does not exist!" };
  }

  if (!existingUser.emailVerified) {
    console.log("Email not verified, generating verification token");
    const verificationToken = await generateVerificationToken(existingUser.email);
    console.log("Verification token generated:", verificationToken);

    await sendVerificationEmail(verificationToken.email, verificationToken.token);
    console.log("Verification email sent");

    return { emailVerifing: "Confirmation email sent!" };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    console.log("Two-factor authentication enabled");
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken) {
        return { error: "Invalid code!" };
      }

      if (twoFactorToken.token !== code) {
        return { error: "Invalid code!" };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: "Code expired!" };
      }

      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

      return { twoFactor: true };
    }
  }

  if (existingUser) {
    console.log("Existing user found, checking if admin");

    if (existingUser.email === process.env.ADMIN_EMAIL) {
      console.log("Admin user detected, updating system flag");

      await db.user.update({
        where: { id: existingUser.id },
        data: {
          system: true
        },
      });
    }
    console.log("Login successful");

    return { success: "user is here" }
  }


  // try {
  //   await signIn("credentials", {
  //     email,
  //     password,
  //     redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
  //   });
  // } catch (error) {
  //   if (error) {
  //     // switch (error.type) {
  //     //   case "CredentialsSignin":
  //     //     return { error: "Invalid credentials!" };
  //     //   default:
  //     //     return { error: "Something went wrong!" };
  //     // }
  //     console.log({error});
  //     return { error: "Something went wrong!" };
  //   }

  //   throw error;
  // }
};
