import { Metadata } from 'next';
import Login from '@/app/auth/login/Login';

export const metadata: Metadata = {
  title: 'Login - AutoMarket',
  description: 'Login or sign up to AutoMarket to buy and sell cars. Secure authentication with OTP verification.',
};

export default function LoginPage() {
  return <Login />;
}
