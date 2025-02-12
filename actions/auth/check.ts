import { DEFAULT_AUTH_REDIRECT, DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { currentSession } from "@/utils/auth";
import { redirect } from "next/dist/server/api-utils";
import { NextResponse } from "next/server";

export const authCheck = async (
    type: "private" | "auth" | "public",
    callback?: string,
) => {
    try {
        const session = await currentSession();
        
        if (type === "private") {
            if (!session || !session.user) {
                return {
                    error: "Unauthorized access"
                };
            }
            return {
                session,
                isAuthenticated: true
            };
        } 
        
        if (type === "auth") {
            if (session && session.user) {
                return {
                    session,
                    isAuthenticated: true
                };
            }
        }
        
        return {
            session,
            isAuthenticated: !!session?.user
        };
    } catch (error) {
        return {
            error: "Authentication check failed"
        };
    }
};