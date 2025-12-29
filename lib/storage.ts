const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  CITY: 'city',
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

export function clearAuthData(): boolean {
  removeStorageItem(STORAGE_KEYS.TOKEN);
  removeStorageItem(STORAGE_KEYS.USER);
  removeStorageItem(STORAGE_KEYS.CITY);
  return true;
}

export { STORAGE_KEYS };
