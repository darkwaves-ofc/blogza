"use server";
import { db } from "@/lib/db";
import { getRoleById, havePermission } from "@/utils/role";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { currentSession, currentUser } from "@/utils/auth";
import { getUserById } from "@/utils/user";
import { generateLinksBatch } from "@/lib/cdn";
import { PageType, PermissionType } from "@/lib/permission_manager";
import { getUserPages, getUserPermissions, havePage } from "@/utils/role";
import {
  getCurrentUserInfoSchema,
  getUserInfoSchema,
  searchUsersSchema,
} from "@/schemas/user";
import { synchronizePreferences } from "@/utils/preferences";
import { User } from "next-auth";
import {
  getUserImagesDataSchema,
  getUserPreferencesDataSchema,
  getUserProductViewsDataSchema,
  getUserSessionsDataSchema,
} from "@/schemas/shared-schemas";
// import { getProductInfoRAW, getProductsInfoRAW } from "../product/info";

// CORE Functions
export const getUsersImagesInfoCORE = async (
  user: User | undefined,
  usersData: { userId: string }[],
  data: z.infer<typeof getUserImagesDataSchema>
) => {
  const users = await db.user.findMany({
    where: { id: { in: usersData.map((u) => u.userId) } },
  });
  if (!users) throw new Error("No users found");

  const images = (
    await Promise.all(
      users.map(async (user) => {
        return await db.userImage.findMany({
          where: {
            userId: user.id,
            verified: { isSet: true },
            private: data.private,
          },
          skip: data.limit?.start,
          take: data.limit ? data.limit.end - data.limit.start : undefined,
        });
      })
    )
  ).flat();

  const cdnLinks = await generateLinksBatch(
    images.map((image) => image.cdnId as string)
  );

  let usersImagesInfo = [];
  for (const user of users) {
    const userImages = images.filter((img) => img.userId === user.id);
    const imagesWithCdnLink = userImages.map((image) => ({
      ...image,
      cdnLink: cdnLinks.find((link) => link.id === image.cdnId)?.link,
    }));

    let count: number | undefined = undefined;
    if (data.count) {
      count = await db.userImage.count({
        where: { userId: user.id, verified: { isSet: true } },
      });
    }

    usersImagesInfo.push({
      userId: user.id,
      images: imagesWithCdnLink,
      count,
    });
  }

  return usersImagesInfo;
};


export const getUsersSessionsInfoCORE = async (
  user: User | undefined,
  usersData: { userId: string }[],
  data: z.infer<typeof getUserSessionsDataSchema>
) => {
  const users = await db.user.findMany({
    where: { id: { in: usersData.map((u) => u.userId) } },
  });
  if (!users) throw new Error("No users found");

  const sessions = (
    await Promise.all(
      users.map(async (user) => {
        return await db.session.findMany({
          where: {
            userId: user.id,
            ...(data.active !== undefined
              ? { expires: { gte: new Date() } }
              : {}),
          },
          skip: data.limit?.start,
          take: data.limit ? data.limit.end - data.limit.start : undefined,
        });
      })
    )
  ).flat();

  let usersSessionsInfo = [];
  for (const user of users) {
    const userSessions = sessions.filter(
      (session) => session.userId === user.id
    );
    let count: number | undefined = undefined;
    if (data.count) {
      count = await db.session.count({
        where: {
          userId: user.id,
          ...(data.active !== undefined ? { isActive: data.active } : {}),
        },
      });
    }

    usersSessionsInfo.push({
      userId: user.id,
      sessions: userSessions,
      count,
    });
  }

  return usersSessionsInfo;
};
export const getUsersRoleInfoCORE = async (
  user: User | undefined,
  usersData: { userId: string }[],
  data: z.infer<typeof getUserPreferencesDataSchema>
) => {
  const users = await db.user.findMany({
    where: { id: { in: usersData.map((u) => u.userId) } },
  });
  if (!users) throw new Error("No users found");

  const roles = await db.userPreferences.findMany({
    where: { userId: { in: users.map((u) => u.id) } },
  });

  // return users.map((user) => ({
  //   userId: user.id,
  //   preferences: preferences.find((pref) => pref.userId === user.id),
  // }));
};
export const getUsersPreferencesInfoCORE = async (
  user: User | undefined,
  usersData: { userId: string }[],
  data: z.infer<typeof getUserPreferencesDataSchema>
) => {
  const users = await db.user.findMany({
    where: { id: { in: usersData.map((u) => u.userId) } },
  });
  if (!users) throw new Error("No users found");

  const preferences = await db.userPreferences.findMany({
    where: { userId: { in: users.map((u) => u.id) } },
  });

  return users.map((user) => ({
    userId: user.id,
    preferences: preferences.find((pref) => pref.userId === user.id),
  }));
};

// RAW Functions
export const getUsersInfoRAW = async (
  user: User | undefined,
  query: { userId: string }[],
  data: z.infer<typeof getUserInfoSchema>["data"]
) => {
  const users = await db.user.findMany({
    where: { id: { in: query.map((q) => q.userId) } },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      roleId: true,
      system: true,
      emailVerified: true,
      ...(data.role ? { role: true } : {}),
    },
  });
  if (!users) throw new Error("No users found");

  let imagesInfo;
  let sessionsInfo;
  let preferencesInfo;
  let role;
  let productViewsInfo;

  if (data.images) {
    imagesInfo = await getUsersImagesInfoCORE(user, query, data.images);
  }

  if (data.sessions) {
    sessionsInfo = await getUsersSessionsInfoCORE(user, query, data.sessions);
  }
  if (data.role) {
    // role = await getRoleInfoCor
  }

  if (data.preferences) {
    preferencesInfo = await getUsersPreferencesInfoCORE(
      user,
      query,
      data.preferences
    );
  }

  const usersInfo = [];
  for (const targetUser of users) {
    let images = imagesInfo?.find((i) => i.userId === targetUser.id);
    let sessions = sessionsInfo?.find((s) => s.userId === targetUser.id);
    let preferences = preferencesInfo?.find((p) => p.userId === targetUser.id);

    usersInfo.push({
      user: targetUser,
      images: images
        ? { images: images.images, count: images.count }
        : undefined,
      sessions: sessions
        ? { sessions: sessions.sessions, count: sessions.count }
        : undefined,
      preferences: preferences?.preferences,
    });
  }

  return usersInfo;
};

export const searchUsersInfoRAW = async (
  user: User | undefined,
  query: z.infer<typeof searchUsersSchema>["query"],
  filters: z.infer<typeof searchUsersSchema>["filters"],
  data: z.infer<typeof searchUsersSchema>["data"]
) => {
  const q = query ?? "";
  const searchQuery: Prisma.UserWhereInput = {
    OR: [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ],
    AND: [
      filters?.roleIds && filters.roleIds.length > 0
        ? {
            roleId: {
              in: filters.roleIds.filter(
                (id): id is string => id !== undefined
              ),
            },
          }
        : {},
    ],
  };

  let count: number | undefined = undefined;
  if (data.count) {
    count = await db.user.count({
      where: searchQuery,
    });
  }

  const users = await db.user.findMany({
    where: searchQuery,
    skip: data.limit?.start,
    take: data.limit ? data.limit.end - data.limit.start : undefined,
  });

  if (!users || users.length === 0) throw new Error("No users found");

  const usersInfo = await getUsersInfoRAW(
    user,
    users.map((user) => ({ userId: user.id })),
    data.users
  );

  return { users: usersInfo, count };
};
// Main Functions
export const userInfo = async () => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }
  return { user };
};

export const sessionInfo = async () => {
  return await currentSession();
};

export const getCurrentUserInfo = async (
  data: z.infer<typeof getCurrentUserInfoSchema>
) => {
  const user = await currentUser();
  if (!user) return { error: "Not authenticated" };

  const validatedFields = getCurrentUserInfoSchema.safeParse(data);
  if (!validatedFields.success) {
    return { error: validatedFields.error.toString() };
  }

  try {
    const userInfo = await getUsersInfoRAW(
      user,
      [{ userId: user.id }],
      validatedFields.data
    );
    return userInfo[0];
  } catch (error: any) {
    return { error: error.message };
  }
};

export const searchUsers = async (
  query: z.infer<typeof searchUsersSchema>["query"],
  data: z.infer<typeof searchUsersSchema>["data"],
  filters?: z.infer<typeof searchUsersSchema>["filters"]
) => {
  const user = await currentUser();
  const hasPermission = await havePermission(user?.id, "view_user");
  if (!hasPermission) {
    return { error: "Not authorized" };
  }

  // For regular users, remove confidential data access
  const publicData: z.infer<typeof searchUsersSchema>["data"] = {
    ...data,
    users: {
      ...data.users,
      images: { ...data.users.images, private: false },
      sessions: undefined,
      preferences: undefined,
    },
  };

  const validatedFields = searchUsersSchema.safeParse({
    query,
    filters,
    data: publicData,
  });
  if (!validatedFields.success) {
    return {
      error: validatedFields.error.errors
        .map((err) => `${err.path.join(".")}:${err.message}`)
        .join(", "),
    };
  }

  try {
    return await searchUsersInfoRAW(
      user,
      validatedFields.data.query,
      validatedFields.data.filters,
      validatedFields.data.data
    );
  } catch (error: any) {
    console.log(error);
    return { error: error.message };
  }
};

export const searchUsersConfidential = async (
  query: z.infer<typeof searchUsersSchema>["query"],
  filters: z.infer<typeof searchUsersSchema>["filters"],
  data: z.infer<typeof searchUsersSchema>["data"]
) => {
  const user = await currentUser();
  const hasPermission = await havePermission(
    user?.id,
    "view_user_confidential"
  );
  if (!hasPermission) {
    return { error: "Not authorized" };
  }

  const validatedFields = searchUsersSchema.safeParse({
    query,
    filters,
    data,
  });
  if (!validatedFields.success) {
    return {
      error: validatedFields.error.errors
        .map((err) => `${err.path.join(".")}:${err.message}`)
        .join(", "),
    };
  }

  try {
    return await searchUsersInfoRAW(
      user,
      validatedFields.data.query,
      validatedFields.data.filters,
      validatedFields.data.data
    );
  } catch (error: any) {
    return { error: error.message };
  }
};
// User Functions
export const getMySessionsInfo = async (
  data: z.infer<typeof getUserSessionsDataSchema>
) => {
  const user = await currentUser();
  if (!user) return { error: "Not authenticated" };

  const validatedFields = getUserSessionsDataSchema.safeParse(data);
  if (!validatedFields.success) {
    return {
      error: validatedFields.error.errors
        .map((err) => `${err.path.join(".")}:${err.message}`)
        .join(", "),
    };
  }

  try {
    const sessionsInfo = await getUsersSessionsInfoCORE(
      user,
      [{ userId: user.id }],
      validatedFields.data
    );
    return sessionsInfo[0];
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getMyPreferencesInfo = async (
  data: z.infer<typeof getUserPreferencesDataSchema>
) => {
  const user = await currentUser();
  if (!user) return { error: "Not authenticated" };
  const preferences = await synchronizePreferences(user);
  if (!preferences) {
    return { error: "No preferences found" };
  }
  const validatedFields = getUserPreferencesDataSchema.safeParse(data);
  if (!validatedFields.success) {
    return {
      error: validatedFields.error.errors
        .map((err) => `${err.path.join(".")}:${err.message}`)
        .join(", "),
    };
  }

  try {
    const preferencesInfo = await getUsersPreferencesInfoCORE(
      user,
      [{ userId: user.id }],
      validatedFields.data
    );
    const d = preferencesInfo[0];
    if (!d) throw new Error("No preferences found");
    if (!d.preferences) throw new Error("No preferences found");
    return { preferences: d.preferences };
  } catch (error: any) {
    return { error: error.message };
  }
};
export const getMyImagesInfo = async (
  data: z.infer<typeof getUserImagesDataSchema>
) => {
  const user = await currentUser();
  if (!user) return { error: "Not authenticated" };

  const validatedFields = getUserImagesDataSchema.safeParse(data);
  if (!validatedFields.success) {
    return {
      error: validatedFields.error.errors
        .map((err) => `${err.path.join(".")}:${err.message}`)
        .join(", "),
    };
  }

  try {
    const imagesInfo = await getUsersImagesInfoCORE(
      user,
      [{ userId: user.id }],
      validatedFields.data
    );
    return imagesInfo[0];
  } catch (error: any) {
    return { error: error.message };
  }
};

// Admin Functions
export const getUserImagesInfo = async (
  userId: string,
  data: z.infer<typeof getUserImagesDataSchema>
) => {
  const user = await currentUser();
  const hasPermission = await havePermission(user?.id, "view_user");
  if (!hasPermission) {
    return { error: "Not authorized" };
  }

  const validatedFields = getUserImagesDataSchema.safeParse(data);
  if (!validatedFields.success) {
    return {
      error: validatedFields.error.errors
        .map((err) => `${err.path.join(".")}:${err.message}`)
        .join(", "),
    };
  }

  try {
    const imagesInfo = await getUsersImagesInfoCORE(
      user,
      [{ userId }],
      validatedFields.data
    );
    return imagesInfo[0];
  } catch (error: any) {
    return { error: error.message };
  }
};
export const getUserSessionsInfo = async (
  userId: string,
  data: z.infer<typeof getUserSessionsDataSchema>
) => {
  const user = await currentUser();
  const hasPermission = await havePermission(
    user?.id,
    "view_user_confidential"
  );
  if (!hasPermission) {
    return { error: "Not authorized" };
  }

  const validatedFields = getUserSessionsDataSchema.safeParse(data);
  if (!validatedFields.success) {
    return {
      error: validatedFields.error.errors
        .map((err) => `${err.path.join(".")}:${err.message}`)
        .join(", "),
    };
  }

  try {
    const sessionsInfo = await getUsersSessionsInfoCORE(
      user,
      [{ userId }],
      validatedFields.data
    );
    return sessionsInfo[0];
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getUserPreferencesInfo = async (
  userId: string,
  data: z.infer<typeof getUserPreferencesDataSchema>
) => {
  const user = await currentUser();
  const hasPermission = await havePermission(
    user?.id,
    "view_user_confidential"
  );
  if (!hasPermission) {
    return { error: "Not authorized" };
  }

  const validatedFields = getUserPreferencesDataSchema.safeParse(data);
  if (!validatedFields.success) {
    return {
      error: validatedFields.error.errors
        .map((err) => `${err.path.join(".")}:${err.message}`)
        .join(", "),
    };
  }

  try {
    const preferencesInfo = await getUsersPreferencesInfoCORE(
      user,
      [{ userId }],
      validatedFields.data
    );
    const d = preferencesInfo[0];
    if (!d) throw new Error("No preferences found");
    if (!d.preferences) throw new Error("No preferences found");
    return { preferences: d.preferences };
  } catch (error: any) {
    return { error: error.message };
  }
};
export const getUserInfo = async (
  userId: string,
  data: z.infer<typeof getUserInfoSchema>["data"]
) => {
  const user = await currentUser();
  const hasPermission = await havePermission(user?.id, "view_user");
  if (!hasPermission) {
    return { error: "Not authorized" };
  }

  // For regular users, remove confidential data access
  const publicData: z.infer<typeof getUserInfoSchema>["data"] = {
    ...data,
    images: { ...data.images, private: false },
    sessions: undefined,
    preferences: undefined,
  };

  const validatedFields = getUserInfoSchema.safeParse({ data: publicData });
  if (!validatedFields.success) {
    return {
      error: validatedFields.error.errors
        .map((err) => `${err.path.join(".")}:${err.message}`)
        .join(", "),
    };
  }

  try {
    const userInfo = await getUsersInfoRAW(
      user,
      [{ userId }],
      validatedFields.data.data
    );
    return userInfo[0];
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getUserInfoConfidential = async (
  userId: string,
  data: z.infer<typeof getUserInfoSchema>["data"]
) => {
  const user = await currentUser();
  const hasPermission = await havePermission(
    user?.id,
    "view_user_confidential"
  );
  if (!hasPermission) {
    return { error: "Not authorized" };
  }

  const validatedFields = getUserInfoSchema.safeParse({ data });
  if (!validatedFields.success) {
    return {
      error: validatedFields.error.errors
        .map((err) => `${err.path.join(".")}:${err.message}`)
        .join(", "),
    };
  }

  try {
    const userInfo = await getUsersInfoRAW(
      user,
      [{ userId }],
      validatedFields.data.data
    );
    return userInfo[0];
  } catch (error: any) {
    return { error: error.message };
  }
};

// Permission and Page Functions
export const currentPages = async () => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const pages = await getUserPages(user.id);
  return { pages };
};

export const checkCurrentPage = async (page: PageType) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }
  const check = await havePage(user.id, page);
  return { check };
};

export const currentPermissions = async () => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const permissions = await getUserPermissions(user.id);
  return { permissions };
};

export const checkCurrentPermission = async (permission: PermissionType) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const check = await havePermission(user.id, permission);
  return { check };
};
