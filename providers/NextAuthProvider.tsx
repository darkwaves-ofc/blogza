"use client";
import { SessionProvider } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Session } from "next-auth";
import { DEFAULT_AUTH_REDIRECT, DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { Loader2 } from "lucide-react";

/**
 * Provides a NextAuth.js session provider for the application.
 * This component wraps the application with the NextAuth.js session provider,
 * handling authentication and authorization logic.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered.
 * @param {'private' | 'auth'} props.type - The type of the page, either 'private' or 'auth'.
 * @param {Session | null} props.session - The current NextAuth.js session.
 * @returns {React.ReactElement} - The NextAuth.js session provider component.
 */
export const NextAuthProvider = ({
  children,
  type,
  session,
}: {
  children: React.ReactNode;
  type: "private" | "auth";
  session: Session | null;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const currentPath = pathname || "/";
      const queryString = searchParams?.toString() || "";
      const callbackUrl = queryString
        ? `${currentPath}?${queryString}`
        : currentPath;
      console.log(callbackUrl);
      if (type === "private" && !session?.user) {
        router.push(
          `${DEFAULT_AUTH_REDIRECT}?callbackUrl=${encodeURIComponent(
            callbackUrl
          )}`
        );
      } else if (type === "auth" && session?.user) {
        router.push(DEFAULT_LOGIN_REDIRECT);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Navigation error:", error);
      setIsLoading(false);
    }
  }, [session, type, router, pathname, searchParams]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <SessionProvider>{children}</SessionProvider>;
};
