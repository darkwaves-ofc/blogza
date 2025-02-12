import type { Metadata } from 'next';
import { NewVerificationForm } from "@/components/auth/new-verification-form";

export const metadata: Metadata = {
  title: {
    template: '%s | LMS - Mahinda Rajapaksa College',
    default: 'Verify | LMS - Mahinda Rajapaksa College Matara',
    absolute: 'Verify | LMS - Mahinda Rajapaksa College',
  },
  description:
    'Verify your email address to access the Learning Management System (LMS) of Mahinda Rajapaksa College, Matara. Complete the email verification process to securely use our e-learning platform.',
  keywords: [
    // Base keywords (keep these)
    'LMS',
    'Mahinda Rajapaksa College',
    'Matara',
    'online education',
    'distance learning',
    'e-learning platform',

    // Page-specific keywords
    'email verification',
    'verify email',
    'account verification',
    'secure login',
    'authentication',
    'LMS verification',
  ],
};
const NewVerificationPage = () => {
  return ( 
    <NewVerificationForm />
   );
}
 
export default NewVerificationPage;
