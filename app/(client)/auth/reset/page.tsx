import { ResetForm } from "@/components/auth/reset-form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | LMS - Mahinda Rajapaksa College',
    default: 'Reset Password | LMS - Mahinda Rajapaksa College Matara',
    absolute: 'Reset Password | LMS - Mahinda Rajapaksa College',
  },
  description:
    'Securely reset your password for the LMS platform of Mahinda Rajapaksa College, Matara. Regain access to your e-learning account with our easy-to-use password reset tool.',
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
    'password recovery',
    'forgot password',
    'secure password reset',
    'LMS password reset',
    'Mahinda Rajapaksa College LMS',
    'e-learning account recovery',
  ],
};



const ResetPage = () => {
  return ( 
    <ResetForm />
  );
}
 
export default ResetPage;