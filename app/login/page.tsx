'use client';

import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ROUTES } from '@/routes';

const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, user, isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);
const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'ADMIN') {
        router.push(ROUTES.ADMIN_DASHBOARD);
      } else {
        router.push(ROUTES.USER_DASHBOARD);
      }
    }
  }, [isAuthenticated, user, router]);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        setError(null);
        await login(values);
      } catch (err: any) {
        setError(err.message || 'Login failed');
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...formik.getFieldProps('email')}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm">{formik.errors.email}</div>
              )}
            </div>
            <div className="space-y-2">
  <Label htmlFor="password">Password</Label>

  <div className="relative">
    <Input
      id="password"
      type={showPassword ? 'text' : 'password'}
      placeholder="••••••••"
      {...formik.getFieldProps('password')}
      className="pr-10"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
    >
      {showPassword ? (
        // Eye OFF icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-7-9-7a17.958 17.958 0 014.27-5.573M6.53 6.53A9.953 9.953 0 0112 5c5 0 9 7 9 7a17.94 17.94 0 01-2.04 3.055M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 6L3 3"
          />
        </svg>
      ) : (
        // Eye icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7.938 0A10.05 10.05 0 0021 12c-5 0-9-7-9-7S3 12 3 12s4 7 9 7c1.057 0 2.07-.164 3.062-.468"
          />
        </svg>
      )}
    </button>
  </div>

  {formik.touched.password && formik.errors.password && (
    <div className="text-red-500 text-sm">{formik.errors.password}</div>
  )}
</div>
            <Button type="submit" className="w-full" isLoading={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{' '}
            <Link href={ROUTES.SIGNUP} className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
