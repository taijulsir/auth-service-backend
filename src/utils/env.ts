// Minimal environment validation to fail fast if required variables are missing.
const requiredEnv = [
  'DATABASE_URI',
  'ACCESS_TOKEN_SECRET',
  'REFRESH_TOKEN_SECRET',
];

export function validateEnv() {
  const missing = requiredEnv.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

export default validateEnv;
