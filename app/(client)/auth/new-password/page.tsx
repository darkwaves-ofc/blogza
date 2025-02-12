import type { Metadata } from 'next';
import { NewPasswordForm } from "@/components/auth/new-password-form";

export const metadata: Metadata = {
  title: {
    template: '%s | LMS - Mahinda Rajapaksa College',
    default: 'Reset Password | LMS - Mahinda Rajapaksa College Matara',
    absolute: 'Reset Password | LMS - Mahinda Rajapaksa College',
  },
  description:
    'Reset your password securely on the LMS platform of Mahinda Rajapaksa College, Matara. Enter and confirm your new password to regain access to your account.',
  keywords: [
    // Base keywords (keep these)
    'LMS',
    'Mahinda Rajapaksa College',
    'Matara',
    'online education',
    'distance learning',
    'e-learning platform',

    // Add page-specific keywords below
    'reset password',
    'new password',
    'password recovery',
    'secure password reset',
    'LMS account access',
    'Mahinda Rajapaksa College LMS',
  ],
};
const NewPasswordPage = () => {
  return ( 
    <NewPasswordForm />
   );
}
 
export default NewPasswordPage;
