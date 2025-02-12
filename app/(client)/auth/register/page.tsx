import { RegisterForm } from "@/components/auth/register-form";

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | LMS - Mahinda Rajapaksa College',
    default: 'Register | LMS - Mahinda Rajapaksa College Matara',
    absolute: 'Register | LMS - Mahinda Rajapaksa College',
  },
  description:
    'Create an account on the LMS platform of Mahinda Rajapaksa College, Matara. Sign up to access online education, distance learning resources, and e-learning tools tailored for students and educators.',
  keywords: [
    // Base keywords
    'LMS',
    'Mahinda Rajapaksa College',
    'Matara',
    'online education',
    'distance learning',
    'e-learning platform',

    // Page-specific keywords
    'register',
    'create account',
    'sign up',
    'LMS registration',
    'student registration',
    'online learning platform',
    'educational resources',
  ],
};


const RegisterPage = () => {
  return ( 
    <RegisterForm />
  );
}
 
export default RegisterPage;