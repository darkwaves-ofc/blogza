"use server";
import { db } from "@/lib/db";
import { getRoleById, havePermission } from "@/utils/role";
import { User } from "next-auth";
import { z } from "zod";
import { currentUser } from "@/utils/auth";
import { getUserById } from "@/utils/user";
import {
  updateUserBaseSchema,
  updateUserImageSchema,
  updateUserPreferencesSchema,
  updateUserSessionSchema,
} from "@/schemas/user";
import { lockSchema } from "@/lib/lockSchema";
import { getUsersInfoRAW } from "./info";
import { hash } from "@/utils/password";

// // Schema definitions
// const updateUserBaseSchema = z.object({
//   name: z.string().min(1).optional(),
//   email: z.string().email().optional(),
//   roleId: z.string().optional(),
//   isActive: z.boolean().optional(),
// });

// const updateUserImageSchema = z.object({
//   userId: z.string(),
//   imageId: z.string(),
//   data: z.object({
//     verified: z.boolean().optional(),
//     isProfileImage: z.boolean().optional(),
//   }),
// });

// const updateUserSchema = z.object({
//   userId: z.string(),
//   data: z.object({
//     base: updateUserBaseSchema.optional(),
//     image: z.object({
//       verified: z.boolean().optional(),
//       isProfileImage: z.boolean().optional(),
//     }).optional(),
//   }),
// });

// // Raw update functions
// export const updateUserRAW = async (
//   reqUser: User | undefined,
//   userId: string,
//   data: z.infer<typeof updateUserSchema>["data"]
// ) => {
//   const user = await getUserById(userId);
//   if (!user) throw new Error("User not found");

//   let updatedUser = user;
//   let updatedImage = null;

//   // Update base user information
//   if (data.base) {
//     updatedUser = await db.user.update({
//       where: { id: userId },
//       data: {
//         ...(data.base.name && { name: data.base.name }),
//         ...(data.base.email && { email: data.base.email }),
//         ...(data.base.roleId && { roleId: data.base.roleId }),
//         ...(typeof data.base.isActive !== 'undefined' && { isActive: data.base.isActive }),
//       },
//     });
//   }

//   // Update user image if provided
//   if (data.image) {
//     const currentProfileImage = await db.userImage.findFirst({
//       where: { userId, isProfileImage: true },
//     });

//     if (currentProfileImage && data.image.isProfileImage) {
//       // Remove current profile image status if setting a new one
//       await db.userImage.update({
//         where: { id: currentProfileImage.id },
//         data: { isProfileImage: false },
//       });
//     }

//     updatedImage = await db.userImage.updateMany({
//       where: { userId },
//       data: {
//         ...(typeof data.image.verified !== 'undefined' && { verified: data.image.verified }),
//         ...(typeof data.image.isProfileImage !== 'undefined' && { isProfileImage: data.image.isProfileImage }),
//       },
//     });
//   }

//   let role = null;
//   if (updatedUser.roleId) {
//     role = await getRoleById(updatedUser.roleId);
//   }

//   return {
//     user: updatedUser,
//     image: updatedImage,
//     role,
//   };
// };

// export const updateUserImageRAW = async (
//   userId: string,
//   imageId: string,
//   data: z.infer<typeof updateUserImageSchema>["data"]
// ) => {
//   const user = await getUserById(userId);
//   if (!user) throw new Error("User not found");

//   const image = await db.userImage.findUnique({
//     where: { id: imageId, userId },
//   });

//   if (!image) throw new Error("Image not found");

//   if (data.isProfileImage) {
//     // Remove current profile image status if setting a new one
//     await db.userImage.updateMany({
//       where: { userId, isProfileImage: true },
//       data: { isProfileImage: false },
//     });
//   }

//   const updatedImage = await db.userImage.update({
//     where: { id: imageId },
//     data: {
//       ...(typeof data.verified !== 'undefined' && { verified: data.verified }),
//       ...(typeof data.isProfileImage !== 'undefined' && { isProfileImage: data.isProfileImage }),
//     },
//   });

//   return { image: updatedImage };
// };

// // Main update functions with permission checks
// export const updateUser = async (
//   _userId: string,
//   _data: z.infer<typeof updateUserSchema>["data"]
// ): Promise<{ error: string } | Awaited<ReturnType<typeof updateUserRAW>>> => {
//   const user = await currentUser();

//   const check = await havePermission(user?.id, "update_user");
//   if (!check) {
//     return { error: "You don't have permission" };
//   }

//   const validatedFields = updateUserSchema.safeParse({
//     userId: _userId,
//     data: _data,
//   });

//   if (!validatedFields.success) {
//     return { error: validatedFields.error.errors.map(err=>`${err.path.join('.')}:${err.message}`).join(", ") };
//   }

//   try {
//     const d = await updateUserRAW(user, validatedFields.data.userId, validatedFields.data.data);
//     return d;
//   } catch (error: any) {
//     return { error: error.message as string };
//   }
// };

// export const updateUserImage = async (
//   _userId: string,
//   _imageId: string,
//   _data: z.infer<typeof updateUserImageSchema>["data"]
// ): Promise<{ error: string } | Awaited<ReturnType<typeof updateUserImageRAW>>> => {
//   const user = await currentUser();

//   const check = await havePermission(user?.id, "update_user");
//   if (!check) {
//     return { error: "You don't have permission" };
//   }

//   const validatedFields = updateUserImageSchema.safeParse({
//     userId: _userId,
//     imageId: _imageId,
//     data: _data,
//   });

//   if (!validatedFields.success) {
//     return { error: validatedFields.error.errors.map(err=>`${err.path.join('.')}:${err.message}`).join(", ") };
//   }

//   try {
//     const d = await updateUserImageRAW(
//       validatedFields.data.userId,
//       validatedFields.data.imageId,
//       validatedFields.data.data
//     );
//     return d;
//   } catch (error: any) {
//     return { error: error.message as string };
//   }
// };

// export const updateCurrentUser = async (
//   _data: z.infer<typeof updateUserSchema>["data"]
// ) => {
//   const user = await currentUser();
//   if (!user) {
//     return { error: "Unauthorized" };
//   }

//   const validatedFields = updateUserSchema.safeParse({
//     userId: user.id,
//     data: _data,
//   });

//   if (!validatedFields.success) {
//     return { error: validatedFields.error.errors.map(err=>`${err.path.join('.')}:${err.message}`).join(", ") };
//   }

//   try {
//     const d = await updateUserRAW(user, user.id, validatedFields.data.data);
//     return d;
//   } catch (error: any) {
//     return { error: error.message as string };
//   }
// };

// RAW Functions
export const updateUserDetailsRAW = async (
  reqUser: User | undefined,
  userId: string,
  data: z.infer<typeof updateUserBaseSchema>,
  password?: string
) => {
  const user = await getUserById(userId);
  if (!user) throw new Error("User not found");

  const updatedUser = await lockSchema(`user-${userId}`, async () =>
    db.user.update({
      where: { id: userId },
      data: {
        ...{
          name: data.name,
          email: data.email,
          system: data.system,
          roleId: data.roleId,
        },
        ...(password ? { password: await hash(password) } : {}),
      },
      select: {
        system: true,
        email: true,
        name: true,
        id: true,
      },
    })
  );

  return { user: updatedUser };
};

export const updateUserPreferencesRAW = async (
  reqUser: User | undefined,
  userId: string,
  data: z.infer<typeof updateUserPreferencesSchema>
) => {
  const user = await getUserById(userId);
  if (!user) throw new Error("User not found");

  const updatedPreferences = await lockSchema(`user-${userId}`, () =>
    db.userPreferences.upsert({
      where: { userId },
      create: { ...data, userId },
      update: data,
    })
  );

  return { preferences: updatedPreferences };
};

export const updateUserImageRAW = async (
  reqUser: User | undefined,
  userId: string,
  imageId: string,
  data: z.infer<typeof updateUserImageSchema>["data"]
) => {
  const user = await getUserById(userId);
  if (!user) throw new Error("User not found");

  const image = await lockSchema(`userImage-${imageId}`, () =>
    db.userImage.findUnique({
      where: { id: imageId, userId },
    })
  );
  if (!image) throw new Error("Image not found");

  const updatedImage = await db.userImage.update({
    where: { id: imageId, userId },
    data: data,
  });

  return { image: updatedImage };
};

export const updateUserSessionRAW = async (
  reqUser: User | undefined,
  userId: string,
  sessionId: string,
  data: z.infer<typeof updateUserSessionSchema>["data"]
) => {
  const user = await getUserById(userId);
  if (!user) throw new Error("User not found");

  const updatedSession = await lockSchema(`session-${sessionId}`, () =>
    db.session.update({
      where: { id: sessionId, userId },
      data: data,
    })
  );

  return { session: updatedSession };
};

// Main Functions
export const updateMyUserDetails = async (
  data: z.infer<typeof updateUserBaseSchema>
) => {
  const user = await currentUser();
  if (!user) return { error: "Not authenticated" };

  const validatedFields = updateUserBaseSchema.safeParse(data);
  if (!validatedFields.success) {
    return { error: validatedFields.error.errors.map(err=>`${err.path.join('.')}:${err.message}`).join(", ") };
  }

  try {
    return await updateUserDetailsRAW(user, user.id, validatedFields.data);
  } catch (error: any) {
    return { error: error.message };
  }
};

export const updateUserDetails = async (
  userId: string,
  data: z.infer<typeof updateUserBaseSchema>,
  password?: string
) => {
  const user = await currentUser();
  if (!user) return { error: "Not authenticated" };
  const hasPermission = await havePermission(user?.id, "edit_user");
  if (!hasPermission) {
    return { error: "Not authorized" };
  }

  const validatedFields = updateUserBaseSchema.safeParse(data);
  if (!validatedFields.success) {
    return { error: validatedFields.error.errors.map(err=>`${err.path.join('.')}:${err.message}`).join(", ") };
  }

  try {
    return await updateUserDetailsRAW(
      user,
      userId,
      validatedFields.data,
      password
    );
  } catch (error: any) {
    return { error: error.message };
  }
};

export const updateUserPreferences = async (
  userId: string,
  data: z.infer<typeof updateUserPreferencesSchema>
) => {
  const user = await currentUser();
  if (!user) return { error: "Not authenticated" };
  const hasPermission = await havePermission(user?.id, "edit_user");
  if (!hasPermission && user?.id !== userId) {
    return { error: "Not authorized" };
  }

  const validatedFields = updateUserPreferencesSchema.safeParse(data);
  if (!validatedFields.success) {
    return { error: validatedFields.error.errors.map(err=>`${err.path.join('.')}:${err.message}`).join(", ") };
  }

  try {
    return await updateUserPreferencesRAW(user, userId, validatedFields.data);
  } catch (error: any) {
    return { error: error.message };
  }
};

export const updateUserImage = async (
  userId: string,
  imageId: string,
  data: z.infer<typeof updateUserImageSchema>["data"]
) => {
  const user = await currentUser();
  if (!user) return { error: "Not authenticated" };
  const hasPermission = await havePermission(user?.id, "edit_user");
  if (!hasPermission && user?.id !== userId) {
    return { error: "Not authorized" };
  }

  const validatedFields = updateUserImageSchema.safeParse({ imageId, data });
  if (!validatedFields.success) {
    return { error: validatedFields.error.errors.map(err=>`${err.path.join('.')}:${err.message}`).join(", ") };
  }

  try {
    return await updateUserImageRAW(
      user,
      userId,
      imageId,
      validatedFields.data.data
    );
  } catch (error: any) {
    return { error: error.message };
  }
};

export const updateUserSession = async (
  userId: string,
  sessionId: string,
  data: z.infer<typeof updateUserSessionSchema>["data"]
) => {
  const user = await currentUser();
  if (!user) return { error: "Not authenticated" };
  const hasPermission = await havePermission(user?.id, "edit_user");
  if (!hasPermission && user?.id !== userId) {
    return { error: "Not authorized" };
  }

  const validatedFields = updateUserSessionSchema.safeParse({
    sessionId,
    data,
  });
  if (!validatedFields.success) {
    return { error: validatedFields.error.errors.map(err=>`${err.path.join('.')}:${err.message}`).join(", ") };
  }

  try {
    return await updateUserSessionRAW(
      user,
      userId,
      sessionId,
      validatedFields.data.data
    );
  } catch (error: any) {
    return { error: error.message };
  }
};
export const updateMyPreferences = async (
  data: z.infer<typeof updateUserPreferencesSchema>
) => {
  const user = await currentUser();
  if (!user) return { error: "Not authenticated" };

  const validatedFields = updateUserPreferencesSchema.safeParse(data);
  if (!validatedFields.success) {
    return { error: validatedFields.error.errors.map(err=>`${err.path.join('.')}:${err.message}`).join(", ") };
  }

  try {
    return await updateUserPreferencesRAW(user, user.id, validatedFields.data);
  } catch (error: any) {
    return { error: error.message };
  }
};

export const updateMySession = async (
  sessionId: string,
  data: z.infer<typeof updateUserSessionSchema>["data"]
) => {
  const user = await currentUser();
  if (!user) return { error: "Not authenticated" };

  const validatedFields = updateUserSessionSchema.safeParse({
    sessionId,
    data,
  });
  if (!validatedFields.success) {
    return { error: validatedFields.error.errors.map(err=>`${err.path.join('.')}:${err.message}`).join(", ") };
  }

  try {
    return await updateUserSessionRAW(
      user,
      user.id,
      sessionId,
      validatedFields.data.data
    );
  } catch (error: any) {
    return { error: error.message };
  }
};
