import type { Metadata } from 'next';
import { DEFAULT_AUTH_REDIRECT } from "@/routes";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: {
    template: '%s | LMS - Mahinda Rajapaksa College',
    default: 'Authentication | LMS - Mahinda Rajapaksa College Matara',
    absolute: 'Authentication | LMS - Mahinda Rajapaksa College',
  },
  description:
    "Access the authentication system for Mahinda Rajapaksa College's LMS. Log in or sign up to continue your online learning journey.",
  keywords: [
    // Base keywords (keep these)
    'LMS',
    'Mahinda Rajapaksa College',
    'Matara',
    'online education',
    'distance learning',
    'e-learning platform',

    // Add page-specific keywords below
    'authentication',
    'login',
    'sign up',
    'user access',
    'secure login',
    'education portal',
  ],
};

export default function Auth() {
  redirect(DEFAULT_AUTH_REDIRECT);
}

