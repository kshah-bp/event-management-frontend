'use client';

import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';
import { useEffect } from 'react';
import { authService } from '@/services/auth/auth.service';
import { useRouter } from 'next/navigation';
import { login, signup, logout } from '@/features/auth/authSlice';

export function useAppDispatch() {
  return useDispatch<AppDispatch>();
}

export function useAppSelector<TSelected = unknown>(
  selector: (state: RootState) => TSelected
) {
  return useSelector(selector);
}

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, token, loading } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const handleLogin = async (credentials: { email: string; password: string }) => {
    return dispatch(login(credentials)).unwrap();
  };

  const handleSignup = async (credentials: { name: string; email: string; password: string }) => {
    return dispatch(signup(credentials)).unwrap();
  };

  const handleLogout = () => {
    authService.logout();
    dispatch(logout());
    router.push('/login');
  };

  return { user, isAuthenticated, token, loading, login: handleLogin, signup: handleSignup, logout: handleLogout };
}

export function useRequireAuth(redirectTo = '/login') {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated && typeof window !== 'undefined') {
      router.push(redirectTo);
    }
  }, [isAuthenticated, loading, redirectTo, router]);

  return { isAuthenticated, loading };
}

export function useRequireAdmin() {
  const { isAuthenticated, loading } = useAuth();
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated && typeof window !== 'undefined') {
      router.push('/login');
    } else if (!loading && isAuthenticated && user?.role !== 'ADMIN' && typeof window !== 'undefined') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, user, router]);

  return { isAuthenticated, isAdmin: user?.role === 'ADMIN', loading };
}
