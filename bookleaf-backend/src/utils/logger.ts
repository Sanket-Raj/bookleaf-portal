/**
 * Application system diagnostics console wrapper interface
 */
export const logger = {
  info: (msg: string, ...meta: any[]) => {
    console.log(`[INFO] [${new Date().toISOString()}] ℹ️ ${msg}`, ...meta);
  },
  warn: (msg: string, ...meta: any[]) => {
    console.warn(`[WARN] [${new Date().toISOString()}] ⚠️ ${msg}`, ...meta);
  },
  error: (msg: string, fault?: any) => {
    console.error(`[ERROR] [${new Date().toISOString()}] ❌ ${msg}`, fault || '');
  }
};