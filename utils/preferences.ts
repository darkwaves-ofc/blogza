"use server";
import { db } from "@/lib/db";
import { getUserById } from "./user";
import { getProductById } from "./product";
import { cookies } from "next/headers";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { User } from "next-auth";

export const synchronizePreferences = async (user: User) => {
  if (user) {
    let userPreferences = await db.userPreferences.findUnique({
      where: { userId: user.id },
    });

    if (!userPreferences) {
      // Create a new preferences for the user if they don't have one
      userPreferences = await db.userPreferences.create({
        data: {
          userId: user.id,
          language: "en",
          currency: "USD",
          communication: ["email"],
        },
      });
    }

    return userPreferences;
  }
};
