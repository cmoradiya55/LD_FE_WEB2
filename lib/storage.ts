const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
} as const;

export function getStorageItem(key: string): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Error getting item from localStorage: ${error}`);
    return null;
  }
}

export function setStorageItem(key: string, value: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Error setting item in localStorage: ${error}`);
    return false;
  }
}

export function removeStorageItem(key: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing item from localStorage: ${error}`);
    return false;
  }
}

export function clearStorage(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error(`Error clearing localStorage: ${error}`);
    return false;
  }
}

export function getToken(): string | null {
  return getStorageItem(STORAGE_KEYS.TOKEN);
}

export function setToken(token: string): boolean {
  return setStorageItem(STORAGE_KEYS.TOKEN, token);
}

export function removeToken(): boolean {
  return removeStorageItem(STORAGE_KEYS.TOKEN);
}

export function getUser(): any | null {
  const userStr = getStorageItem(STORAGE_KEYS.USER);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
}

export function setUser(user: any): boolean {
  try {
    const userStr = JSON.stringify(user);
    return setStorageItem(STORAGE_KEYS.USER, userStr);
  } catch (error) {
    console.error('Error stringifying user data:', error);
    return false;
  }
}

export function removeUser(): boolean {
  return removeStorageItem(STORAGE_KEYS.USER);
}

export function clearAuthData(): boolean {
  removeToken();
  removeUser();
  return true;
}

export { STORAGE_KEYS };
