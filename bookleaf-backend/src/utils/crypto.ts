import crypto from 'crypto';

/**
 * Generates an entropy-secure random hex string token
 */
export const generateSecureToken = (bytes = 32): string => {
  return crypto.randomBytes(bytes).toString('hex');
};

/**
 * Computes a standardized SHA256 string hash signature
 */
export const computeHash = (data: string): string => {
  return crypto.createHash('sha256').update(data).digest('hex');
};