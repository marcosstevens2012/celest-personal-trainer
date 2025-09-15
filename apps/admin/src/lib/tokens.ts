import crypto from 'crypto';

/**
 * Generate a unique public token for plan sharing
 * Format: 8 chars random + timestamp + 4 chars random = ~20 chars
 */
export function generatePublicToken(): string {
  const randomPart1 = crypto.randomBytes(4).toString('hex'); // 8 chars
  const timestamp = Date.now().toString(36); // timestamp in base36
  const randomPart2 = crypto.randomBytes(2).toString('hex'); // 4 chars
  
  return `${randomPart1}${timestamp}${randomPart2}`;
}

/**
 * Generate a shorter token for QR codes (12 chars)
 */
export function generateShortToken(): string {
  return crypto.randomBytes(6).toString('hex');
}

/**
 * Validate token format
 */
export function isValidTokenFormat(token: string): boolean {
  return /^[a-f0-9]{12,24}$/.test(token);
}