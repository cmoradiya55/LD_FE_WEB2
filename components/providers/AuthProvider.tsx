'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { clearAuthData, setStorageItem, getStorageItem } from '@/lib/storage';
import { sendOtp, verifyOtp } from '@/lib/auth';
import { generateUUID } from '@/lib/uuid';

interface User {
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (contact: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  sendOTP: (contact: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Protected routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/favorites',
  '/my-listings',
  '/sell',
  '/sellCar',
];

// Public routes that should redirect to dashboard if already logged in
const PUBLIC_ROUTES = ['/login'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedToken = getStorageItem('token');
        const storedUser = JSON.parse(getStorageItem('user') || '{}');

        if (storedToken && storedUser) {
          setTokenState(storedToken);
          setUserState(storedUser);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for logout events from axios interceptor
    const handleLogout = () => {
      clearAuthData();
      setTokenState(null);
      setUserState(null);
      if (pathname !== '/login') {
        router.push('/login');
      }
    };

    window.addEventListener('auth:logout', handleLogout);

    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, [router, pathname]);

  // Route protection logic
  useEffect(() => {
    if (isLoading) return;

    const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
      pathname?.startsWith(route)
    );
    const isPublicRoute = PUBLIC_ROUTES.some((route) =>
      pathname?.startsWith(route)
    );

    // If user is not authenticated and tries to access protected route
    if (isProtectedRoute && !token) {
      router.push('/login');
      return;
    }

    // If user is authenticated and tries to access public route (like login)
    if (isPublicRoute && token) {
      router.push('/dashboard');
      return;
    }
  }, [pathname, token, isLoading, router]);

  const sendOTP = useCallback(async (contact: string) => {
    try {
      const payload = {
        country_code: '91',
        mobile_no: contact,
      };
      const res = await sendOtp(payload);
      
      if (res.code === 200) {
        return { success: true };
      } else {
        return { success: false, error: res.message || 'Failed to send OTP' };
      }
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      return { success: false, error: error.message || 'Failed to send OTP' };
    }
  }, []);

  const login = useCallback(async (contact: string, otp: string) => {
    try {
      const payload = {
        country_code: '91',
        mobile_no: contact,
        otp: otp,
        device_id: generateUUID(),
        device_type: 3,
      };
      
      const res = await verifyOtp(payload);
      
      if (res.code === 200 && res.data?.accessToken) {
        console.log('res.data', res.data);
        
        const accessToken = res.data.accessToken;
        const userData = res.data;
        const city = userData.cityId;

        // If cityId is null or undefined, set a flag to show the location modal after login
        // If cityId exists, it will be saved directly with userData
        if (
          typeof window !== 'undefined' &&
          userData &&
          (userData.cityId === null || userData.cityId === undefined || userData.cityId === '')
        ) {
          window.localStorage.setItem('SHOW_LOCATION_MODAL_AFTER_LOGIN', 'true');
        } else {
          // If cityId exists, remove the flag (in case it was set before)
          window.localStorage.removeItem('SHOW_LOCATION_MODAL_AFTER_LOGIN');
        }

        // Store in localStorage
        setStorageItem('user', JSON.stringify(userData));
        setStorageItem('token', accessToken);
        setStorageItem('city', city);

        // Update state
        setTokenState(accessToken);
        setUserState(userData);

        // Redirect to dashboard
        router.push('/dashboard');
        
        return { success: true };
      } else {
        return { success: false, error: res.message || 'Invalid OTP' };
      }
    } catch (error: any) {
      console.error('Error during login:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  }, [router]);

  const logout = useCallback(() => {
    // Clear localStorage
    clearAuthData();
    
    // Clear state
    setTokenState(null);
    setUserState(null);
    
    // Redirect to login
    router.push('/login');
  }, [router]);

  const checkAuth = useCallback(() => {
    const storedToken = getStorageItem('token');
    const storedUser = JSON.parse(getStorageItem('user') || '{}');

    if (storedToken && storedUser) {
      setTokenState(storedToken);
      setUserState(storedUser);
      return true;
    }
    
    return false;
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    sendOTP,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 * @throws Error if used outside AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
