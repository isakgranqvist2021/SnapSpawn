import 'dotenv/config';

const env = {
  NODE_ENV: process.env.NODE_ENV as string,

  MONGO_DB_DATABASE_URL: process.env.MONGO_DB_DATABASE_URL as string,
  AUTH0_BASE_URL: process.env.AUTH0_BASE_URL as string,
  AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET as string,
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID as string,
  AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL as string,
  AUTH0_SECRET: process.env.AUTH0_SECRET as string,

  GCP_BUCKET_NAME: process.env.GCP_BUCKET_NAME as string,
  GCP_CLIENT_EMAIL: process.env.GCP_CLIENT_EMAIL as string,
  GCP_CLIENT_ID: process.env.GCP_CLIENT_ID as string,
  GCP_PRIVATE_KEY: process.env.GCP_PRIVATE_KEY as string,
  GCP_PROJECT_ID: process.env.GCP_PROJECT_ID as string,

  OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY as string,
  OPEN_AI_BASE_URL: process.env.OPEN_AI_BASE_URL as string,

  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
};

const errors = [];

for (const k in env) {
  if (!env[k as keyof typeof env]) {
    errors.push(`Missing env variable: ${k}\n`);
  }
}

if (errors.length) {
  throw new Error(errors.join(''));
}

export const NODE_ENV = env.NODE_ENV;

export const MONGO_DB_DATABASE_URL = env.MONGO_DB_DATABASE_URL;

export const GCP_BUCKET_NAME = env.GCP_BUCKET_NAME;
export const GCP_CLIENT_EMAIL = env.GCP_CLIENT_EMAIL;
export const GCP_CLIENT_ID = env.GCP_CLIENT_ID;
export const GCP_PRIVATE_KEY = env.GCP_PRIVATE_KEY;
export const GCP_PROJECT_ID = env.GCP_PROJECT_ID;

export const OPEN_AI_API_KEY = env.OPEN_AI_API_KEY;
export const OPEN_AI_BASE_URL = env.OPEN_AI_BASE_URL;

export const STRIPE_SECRET_KEY = env.STRIPE_SECRET_KEY;
