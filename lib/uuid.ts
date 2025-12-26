import { v4 as uuidv4, v1 as uuidv1 } from 'uuid';

/**
 * Generate a random UUID (version 4)
 * This is the most commonly used UUID type - completely random
 * @returns A random UUID string (e.g., "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d")
 */
export function generateUUID(): string {
  return uuidv4();
}

/**
 * Generate a time-based UUID (version 1)
 * Based on timestamp and MAC address
 * @returns A time-based UUID string
 */
export function generateTimeBasedUUID(): string {
  return uuidv1();
}

/**
 * Generate multiple UUIDs at once
 * @param count Number of UUIDs to generate
 * @returns Array of UUID strings
 */
export function generateMultipleUUIDs(count: number): string[] {
  return Array.from({ length: count }, () => uuidv4());
}

/**
 * Validate if a string is a valid UUID
 * @param uuid String to validate
 * @returns true if valid UUID, false otherwise
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// Default export for convenience
export default generateUUID;
