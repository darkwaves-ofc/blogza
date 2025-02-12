import type { Metadata } from "next";
import { ErrorCard } from "@/components/auth/error-card";

export const metadata: Metadata = {
  title: {
    template: "%s | LMS - Mahinda Rajapaksa College",
    default: "Authentication Error | LMS - Mahinda Rajapaksa College Matara",
    absolute: "Authentication Error | LMS - Mahinda Rajapaksa College",
  },
  description:
    "Handle authentication errors securely with the LMS platform at Mahinda Rajapaksa College Matara. Get assistance for login issues and unauthorized access.",
  keywords: [
    // Base keywords (keep these)
    "LMS",
    "Mahinda Rajapaksa College",
    "Matara",
    "online education",
    "distance learning",
    "e-learning platform",

    // Add page-specific keywords below
    "authentication error",
    "login error",
    "unauthorized access",
    "error handling",
    "secure login",
    "LMS error page",
  ],
};
const AuthErrorPage = () => {
  return <ErrorCard />;
};
export default AuthErrorPage;
