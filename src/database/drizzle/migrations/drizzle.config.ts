import { defineConfig } from 'drizzle-kit';

const nodeEnv = process.env.NODE_ENV || 'development';

const url = process.env.TURSO_CONNECTION_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

// Validate required environment variables for production
if (nodeEnv === 'production') {
  if (!url) {
    throw new Error('TURSO_CONNECTION_URL is required in production');
  }
  if (!authToken) {
    throw new Error('TURSO_AUTH_TOKEN is required in production');
  }
}

export default defineConfig({
  schema: './src/database/drizzle/schema.ts',
  out: './src/database/drizzle/migrations',
  verbose: true,
  strict: true,
  
  // Use conditional configuration based on environment
  ...(nodeEnv === 'development' 
    ? {
        dialect: 'sqlite' as const,
        dbCredentials: {
          url: 'file:./local.db',
        },
      }
    : {
        dialect: 'turso' as const,
        dbCredentials: {
          url: url!,
          authToken: authToken!,
        },
      }
  ),
});