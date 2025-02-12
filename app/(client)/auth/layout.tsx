import { authOptions } from "@/auth";
import { NextAuthProvider } from "@/providers/NextAuthProvider";
import { currentSession } from "@/utils/auth";
import { getServerSession } from "next-auth";

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | LMS - Mahinda Rajapaksa College',
    default: 'Authentication | LMS - Mahinda Rajapaksa College Matara',
    absolute: 'Authentication | LMS - Mahinda Rajapaksa College',
  },
  description:
    'Access the LMS platform of Mahinda Rajapaksa College, Matara. Manage your authentication and securely log in or sign up to continue your online education journey.',
  keywords: [
    // Base keywords (keep these)
    'LMS',
    'Mahinda Rajapaksa College',
    'Matara',
    'online education',
    'distance learning',
    'e-learning platform',

    // Page-specific keywords
    'authentication',
    'login',
    'signup',
    'secure login',
    'student portal',
    'teacher portal',
    'LMS login',
    'LMS signup',
    'educational platform',
  ],
};

const AuthLayout = async (props: {
  children: React.ReactNode;
  searchParams: Promise<{ callbackUrl: string }>;
}) => {
  const searchParams = await props.searchParams;
  console.log(searchParams);
  const session = await currentSession();
  return (
    <NextAuthProvider session={session} type="auth">
      <div className="flex items-center justify-center min-h-screen py-16">
        {props.children}
      </div>
    </NextAuthProvider>
  );
};

export default AuthLayout;
