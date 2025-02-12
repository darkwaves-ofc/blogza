import {
  checkFileInfo,
  createUploadToken,
  generateLink,
  generateLinksBatch,
  registerFile,
  uploadByLink,
} from "@/lib/cdn";
import { db } from "@/lib/db";
import { User } from "next-auth";
import { Upload } from "lucide-react";

/**
 * Retrieves a user by their email address.
 *
 * @param email - The email address of the user to retrieve.
 * @returns The user object if found, or `null` if not found.
 */
export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({ where: { email } });
    console.log({ user });
    return user;
  } catch (err) {
    console.log(err);
    return null;
  }
};

/**
 * Retrieves a user by their unique identifier.
 *
 * @param id - The unique identifier of the user to retrieve.
 * @returns The user object if found, or `null` if not found.
 */
export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id },
      include: {
        UserPreferences: {
          select: {
            currency: true,
            language: true,
          },
        },
      },
    });

    return user;
  } catch {
    return null;
  }
};

/**
 * Creates a new user image token for a given user.
 *
 * @param userId - The unique identifier of the user to create the image token for.
 * @param data - An object containing the details of the image, including the extension, name, size, and whether it is private.
 * @returns The created upload token if successful, or `null` if an error occurs.
 */
export const createUserImageToken = async (
  userId: string,
  data: { extension: string; name: string; size: number; private: boolean }
) => {
  try {
    const user = await getUserById(userId);
    if (!user) throw new Error("Cannot find the user");

    const maxImageSize = 1024 * 1024 * 10;
    if (data.size > maxImageSize) {
      throw new Error("Image size too large");
    }
    if (data.extension !== "jpg" && data.extension !== "png") {
      throw new Error("Image extension is not supported.");
    }
    const uploadToken = await createUploadToken(1, {
      name: data.name,
      size: data.size,
      extension: data.extension,
    });

    await db.userImage.create({
      data: {
        token: uploadToken.token,
        userId: userId,
        private: data.private,
      },
    });
    return uploadToken;
  } catch (error) {
    return null;
  }
};
/**
 * Completes the process of uploading a user image by registering the file with the CDN and updating the database record.
 *
 * @param userId - The unique identifier of the user who is uploading the image.
 * @param token - The upload token associated with the image being uploaded.
 * @returns The updated user image record if successful, or `null` if an error occurs.
 */
export const finishUserImage = async (userId: string, token: string) => {
  try {
    const user = await getUserById(userId);
    if (!user) throw new Error("Cannot find the user");
    const userImage = await db.userImage.findUnique({
      where: {
        userId: user.id,
        token: token,
        verified: { isSet: false },
      },
    });
    if (!userImage) throw new Error("Cannot find the image token");
    const registerFileOutput = await registerFile(token);
    if (!registerFileOutput) {
      return { error: "Something went wrong" };
    }
    const fileSchema = await checkFileInfo(
      undefined,
      userImage.token as string
    ).catch(() => {});

    if (!fileSchema) {
      throw new Error("File not found on the cdn");
    }
    const upload = await db.userImage.update({
      where: {
        id: userImage.id,
      },
      data: {
        cdnId: fileSchema.id,
        name: fileSchema.name,
        size: fileSchema.size,
        extension: fileSchema.extension,
        verified: new Date(),
      },
    });
    return upload;
  } catch (error) {
    return null;
  }
};
/**
 * Uploads a user image by providing a URL to the image, and registers the file with the CDN.
 *
 * @param userId - The unique identifier of the user who is uploading the image.
 * @param data - An object containing the URL of the image to upload and a boolean indicating whether the image is private.
 * @returns The uploaded image data if successful, or `null` if an error occurs.
 */
export const createUserImageByUrl = async (
  userId: string,
  data: { url: string; private: boolean }
) => {
  try {
    const user = await getUserById(userId);
    if (!user) throw new Error("Cannot find the user");
    const upload = await uploadByLink(data.url);
    if (!upload) {
      throw new Error("Something went wrong");
    }
    const registerFileOutput = await registerFile(upload.uploadToken.token);
    if (!registerFileOutput) {
      return { error: "Something went wrong" };
    }
    const fileSchema = await checkFileInfo(
      undefined,
      upload.uploadToken.token as string
    ).catch(() => {});

    if (!fileSchema) {
      throw new Error("File not found on the cdn");
    }
    await db.userImage.create({
      data: {
        userId: userId,
        private: data.private,
        cdnId: upload.id,
        extension: upload.extension,
        size: upload.size,
        name: upload.name,
        verified: new Date(),
        token: upload.uploadToken.token,
      },
    });
    return upload;
  } catch (error) {
    return null;
  }
};

/**
 * Retrieves a session by its token.
 *
 * @param sessionToken - The token of the session to retrieve.
 * @returns The session if found, or null if not found.
 */
export const getSessionByToken = async (sessionToken: string) => {
  try {
    const session = await db.session.findUnique({
      where: {
        sessionToken: sessionToken,
        expires: { gte: new Date() },
      },
    });
    if (!session) throw new Error("Cannot find the session");

    return session;
  } catch (error) {
    return null;
  }
};
/**
 * Retrieves a session by its unique identifier.
 *
 * @param id - The unique identifier of the session to retrieve.
 * @returns The session object if found, or `null` if not found.
 */

/**
 * Retrieves a login attempt by its unique identifier.
 *
 * @param id - The unique identifier of the login attempt to retrieve.
 * @returns The login attempt if found, or null if not found.
 */

/**
 * Retrieves a login attempt by its unique token.
 *
 * @param token - The unique token of the login attempt to retrieve.
 * @returns The login attempt object if found, or `null` if not found.
 */
export const getLoginAttemptByToken = async (token: string) => {
  try {
    const loginAttempt = await db.loginAttempt.findUnique({
      where: {
        token: token,
      },
    });
    if (!loginAttempt) throw new Error("Cannot find the login attempt");
    return loginAttempt;
  } catch (error) {
    return null;
  }
};
/**
 * Retrieves an account by the user's unique identifier.
 *
 * @param userId - The unique identifier of the user whose account to retrieve.
 * @returns The account object if found, or `null` if not found.
 */
export const getAccountByUserId = async (userId: string) => {
  try {
    const account = await db.account.findFirst({
      where: { userId },
    });

    return account;
  } catch {
    return null;
  }
};

/**
 * Retrieves an account by the provider and provider account ID.
 *
 * @param provider - The provider of the account, such as "google" or "github".
 * @param providerId - The unique identifier of the account for the given provider.
 * @returns The account object if found, or `null` if not found.
 */
export const getAccountByProvider = async (
  provider: string,
  providerId: string
) => {
  try {
    const account = await db.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId: providerId,
        },
      },
    });
    return account;
  } catch (error) {
    return null;
  }
};

/**
 * Retrieves a login attempt by the user's ID, location, and IP address.
 *
 * @param userId - The unique identifier of the user whose login attempt to retrieve.
 * @param location - The location of the login attempt.
 * @param ip - The IP address of the login attempt.
 * @returns The login attempt object if found, or `null` if not found.
 */
export const getLoginAttemptByData = async (
  userId: string,
  location: string,
  ip: string
) => {
  try {
    const loginAttempt = await db.loginAttempt.findFirst({
      where: {
        location: location,
        ip: ip,
        userId: userId,
      },
    });
    if (!loginAttempt) throw new Error("Cannot find the login attempt");
    return loginAttempt;
  } catch (error) {
    return null;
  }
};

/**
 * Deletes a user session by the provided session token.
 *
 * @param sessionToken - The session token to delete.
 * @returns The deleted session object, or `null` if the session could not be found.
 */
export const deleteSession = async (sessionToken: string) => {
  try {
    const session = await db.session.delete({
      where: {
        sessionToken: sessionToken,
      },
    });
    if (!session) throw new Error("Cannot delete the session");
    return session;
  } catch (error) {
    return null;
  }
};

/**
 * Creates a new user in the database with the provided data.
 *
 * @param data - An object containing the user data to create.
 * @param data.email - The email address of the user.
 * @param data.password - The password of the user (optional).
 * @param data.name - The name of the user.
 * @param data.emailVerified - The date the user's email was verified (optional).
 * @returns The created user object, or `null` if the creation failed.
 */
export const createUser = async (data: {
  email: string;
  password?: string;
  name: string;
  emailVerified?: Date;
}) => {
  try {
    const user = await db.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
        system: data.email === process.env.ADMIN_EMAIL,
        emailVerified: data.emailVerified,
      },
    });
    return user;
  } catch (error) {
    return null;
  }
};

/**
 * Deletes a user from the database.
 *
 * @param userId - The ID of the user to delete.
 * @returns The deleted user object, or `null` if the deletion failed.
 */
export const deleteUser = async (userId: string) => {
  try {
    const user = await db.user.delete({
      where: {
        id: userId,
      },
    });
    if (!user) throw new Error("Cannot delete the user");
    return user;
  } catch (error) {
    return null;
  }
};

/**
 * Retrieves a list of billing details based on the provided billing detail IDs and user IDs.
 *
 * @param _billingDetails - An array of objects containing the billing detail ID and user ID for each billing detail to retrieve.
 * @returns An array of billing detail objects, or `null` if an error occurs.
 */