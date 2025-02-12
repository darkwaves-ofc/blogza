
"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/utils/auth";
import { havePermission } from "@/utils/role";
import { z } from "zod";
import { getUserById, deleteUser as _deleteUser } from "@/utils/user";

// RAW Functions
export const deleteUserRAW = async (userId: string) => {
  const d = await _deleteUser(userId);
  if (!d) throw new Error("User deletion failed");
  return { success: true };
};

// Main Functions
export const deleteUser = async (userId: string) => {
  const user = await currentUser();
  const hasPermission = await havePermission(user?.id, "delete_user");
  if (!hasPermission) {
    return { error: "Not authorized" };
  }

  if (!userId || typeof userId !== 'string') {
    return { error: "Invalid user ID" };
  }

  const targetUser = await getUserById(userId);
  if (!targetUser) {
    return { error: "User not found" };
  }

  try {
    return await deleteUserRAW(userId);
  } catch (error: any) {
    return { error: error.message };
  }
};

export const deleteMyAccount = async () => {
  const user = await currentUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  try {
    return await deleteUserRAW(user.id);
  } catch (error: any) {
    return { error: error.message };
  }
};
