# Authentication System Usage Guide

## Overview
The authentication system provides centralized login/logout functionality with automatic route protection and redirects.

## Components Created

### 1. Storage Utility (`lib/storage.ts`)
Type-safe localStorage operations for auth data.

### 2. AuthProvider (`components/providers/AuthProvider.tsx`)
- Manages authentication state
- Handles login/logout
- Automatically protects routes
- Redirects unauthenticated users to login
- Redirects authenticated users away from login page

### 3. useAuth Hook
Access authentication state and functions from any component.

### 4. ProtectedRoute Component
Wrapper component for protecting routes that require authentication.

### 5. PublicRoute Component
Wrapper for public routes (like login) that redirects if already authenticated.

## Usage Examples

### Using useAuth Hook

```tsx
'use client';

import { useAuth } from '@/components/providers/AuthProvider';

export default function MyComponent() {
  const { user, token, isAuthenticated, isLoading, login, logout } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.name}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <p>Please login</p>
      )}
    </div>
  );
}
```

### Protecting a Route

```tsx
// app/(main)/dashboard/page.tsx
import ProtectedRoute from '@/components/ProtectedRoute';
import Dashboard from './Dashboard';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
```

### Public Route (Login Page)

```tsx
// app/(auth)/login/Login.tsx
import PublicRoute from '@/components/PublicRoute';

export default function Login() {
  return (
    <PublicRoute>
      {/* Login form */}
    </PublicRoute>
  );
}
```

### Login Function

```tsx
const { sendOTP, login } = useAuth();

// Step 1: Send OTP
const result = await sendOTP('9090909090');
if (result.success) {
  // Show OTP input
}

// Step 2: Verify OTP and login
const loginResult = await login('9090909090', '123456');
if (loginResult.success) {
  // User is logged in, redirect happens automatically
}
```

### Logout Function

```tsx
const { logout } = useAuth();

// Call logout - clears auth data and redirects to login
logout();
```

## Protected Routes

Routes automatically protected (defined in AuthProvider):
- `/dashboard`
- `/profile`
- `/favorites`
- `/my-listings`
- `/sell`
- `/sellCar`

## Public Routes

Routes that redirect to dashboard if already logged in:
- `/login`

## Features

1. **Automatic Route Protection**: Protected routes automatically redirect to login if not authenticated
2. **Centralized Auth State**: Single source of truth for authentication
3. **Automatic Redirects**: Handles redirects based on auth state
4. **401 Handling**: Axios interceptor automatically logs out on 401 errors
5. **Type Safety**: Full TypeScript support
6. **Loading States**: Built-in loading state management

## API

### useAuth Hook Returns

```typescript
{
  user: User | null;           // Current user data
  token: string | null;         // Auth token
  isAuthenticated: boolean;     // Whether user is logged in
  isLoading: boolean;          // Initial auth check loading state
  login: (contact: string, otp: string) => Promise<{success: boolean; error?: string}>;
  sendOTP: (contact: string) => Promise<{success: boolean; error?: string}>;
  logout: () => void;          // Logout and redirect to login
  checkAuth: () => boolean;    // Manually check auth state
}
```
