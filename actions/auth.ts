"use server";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

export async function checkAdminAuth() {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const jwtSecret = process.env.JWT_SECRET_KEY;
  if (!adminUsername || !adminPassword || !jwtSecret) {
    return { success: false, error: "Environments are not setup!" };
  }

  const token = cookies().get("adminToken");

  if (!token) {
    return { isAuthenticated: false };
  }
  try {
    const { payload } = await jwtVerify(
      token.value,
      new TextEncoder().encode(jwtSecret)
    );

    if (payload.username === adminUsername) {
      return { isAuthenticated: true };
    }

    return { isAuthenticated: false };
  } catch (error) {
    return { isAuthenticated: false };
  }
}

export async function handleAdminLogin({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  try {
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET_KEY;
    if (!adminUsername || !adminPassword || !jwtSecret) {
      return { success: false, error: "Environments are not setup!" };
    }

    if (!username || !password) {
      return { success: false, error: "Username and password are required!" };
    }

    if (username === adminUsername && password === adminPassword) {
      const token = await new SignJWT({
        username,
        role: "admin",
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(new TextEncoder().encode(jwtSecret));

      cookies().set("adminToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24 hours
      });

      return { success: true };
    }

    return { success: false, error: "Invalid credentials" };
  } catch (error) {
    console.error("Error in handleAdminLogin:", error);
    return { success: false, error: "An error occurred" };
  }
}
