import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from the .env file
dotenv.config();

// Define the required structure of your environment variables
const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string().optional(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CLAUDE_API_KEY: z.string().optional(),
});

// Validate the current process.env against the schema
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.format());
  process.exit(1); // Stop the server if variables are missing
}

// Export the validated configuration
export const config = parsedEnv.data;