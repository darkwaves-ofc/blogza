import type { Metadata } from 'next';
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: {
    template: '%s | LMS - Mahinda Rajapaksa College',
    default: 'Login | LMS - Mahinda Rajapaksa College Matara',
    absolute: 'Login | LMS - Mahinda Rajapaksa College',
  },
  description:
    'Log in to your account on the Learning Management System (LMS) of Mahinda Rajapaksa College, Matara. Access your courses, assignments, and resources with ease.',
  keywords: [
    // Base keywords (keep these)
    'LMS',
    'Mahinda Rajapaksa College',
    'Matara',
    'online education',
    'distance learning',
    'e-learning platform',

    // Page-specific keywords
    'login',
    'LMS login',
    'student login',
    'teacher login',
    'account access',
    'authentication',
    'secure login',
  ],
};
const LoginPage = () => {
  return ( 
    <LoginForm />
  );
}
 
export default LoginPage;
