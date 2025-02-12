"use server";
import { db } from "@/lib/db";
import { checkFileInfo, registerFile } from "@/lib/cdn";
import { currentUser } from "@/utils/auth";
import { havePermission } from "@/utils/role";
import { z } from "zod";
import {
  createUserCombinedSchema,
  createUserImageSchema,
  createUserSchema,
} from "@/schemas/user";
import { User } from "next-auth";
import { getFilesByids } from "@/lib/cdn";
import { getUserById, createUser as _createUser } from "@/utils/user";
import bcrypt from "bcryptjs";
// RAW Functions
export const createUserRAW = async (
  user: z.infer<typeof createUserCombinedSchema>["user"],
  files: z.infer<typeof createUserCombinedSchema>["files"]
) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);

  const d = await _createUser({ ...user, password: hashedPassword });
  if (!d) throw new Error("User creation failed");
  if (files) {
    await createUserImagesRAW(d, files);
  }
  return { user: d };
};
export const createUserImagesRAW = async (
  user: User,
  images: z.infer<typeof createUserImageSchema>
) => {
  const createdFiles = await Promise.all(
    images.map(async (fileData) => {
      const registerFileOutput = await registerFile(fileData.token);
      if (!registerFileOutput) throw new Error("File registration failed");

      const fileInfo = await checkFileInfo(undefined, fileData.token);
      if (!fileInfo) throw new Error("File not found");

      const productFile = await db.userImage.create({
        data: {
          userId: user.id,
          name: fileInfo.name,
          token: fileInfo.uploadToken.token,
          cdnId: fileInfo.id,
          size: fileInfo.size,
          extension: fileInfo.extension,
          private: fileData.private ?? false,
          verified: fileInfo.registerdAt,
        },
        select: { id: true },
      });
      return productFile;
    })
  );
  const fileData = await getFilesByids(createdFiles.map((file) => file.id));
  if (!fileData) throw new Error("File not found");
  return { images: fileData };
};

// Main Functions
export const createUser = async (
  _user: z.infer<typeof createUserCombinedSchema>["user"],
  _files: z.infer<typeof createUserCombinedSchema>["files"]
) => {
  const user = await currentUser();
  const hasPermission = await havePermission(user?.id, "create_user");
  if (!hasPermission) {
    return { error: "Not authorized" };
  }

  const validatedFields = createUserCombinedSchema.safeParse({
    user: _user,
    files: _files,
  });
  if (!validatedFields.success) {
    return {
      error: validatedFields.error.errors
        .map((err) => `${err.path.join(".")}:${err.message}`)
        .join(", "),
    };
  }

  const { user: _cUser, files } = validatedFields.data;
  try {
    return await createUserRAW(_cUser, files);
  } catch (error: any) {
    return { error: error.message };
  }
};

export const createMyUserImage = async (
  data: z.infer<typeof createUserImageSchema>
) => {
  const user = await currentUser();
  if (!user) return { error: "Not authenticated" };

  const validatedFields = createUserImageSchema.safeParse(data);
  if (!validatedFields.success) {
    return {
      error: validatedFields.error.errors
        .map((err) => `${err.path.join(".")}:${err.message}`)
        .join(", "),
    };
  }

  try {
    return await createUserImagesRAW(user, validatedFields.data);
  } catch (error: any) {
    return { error: error.message };
  }
};
export const createUserImage = async (
  userId: string,
  data: z.infer<typeof createUserImageSchema>
) => {
  const user = await currentUser();
  const hasPermission = await havePermission(user?.id, "create_user");
  if (!hasPermission) {
    return { error: "Not authorized" };
  }

  const validatedFields = createUserImageSchema.safeParse(data);
  if (!validatedFields.success) {
    return {
      error: validatedFields.error.errors
        .map((err) => `${err.path.join(".")}:${err.message}`)
        .join(", "),
    };
  }
  const targetUser = await getUserById(userId);
  if (!targetUser) {
    return { error: "User not found" };
  }
  try {
    return await createUserImagesRAW(targetUser, validatedFields.data);
  } catch (error: any) {
    return { error: error.message };
  }
};
