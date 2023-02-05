const env = {
  nodeEnv: process.env.NODE_ENV as string,
  bucketName: process.env.BUCKET_NAME as string,
  clientEmail: process.env.CLIENT_EMAIL as string,
  clientId: process.env.CLIENT_ID as string,
  databaseUri: process.env.DATABASE_URL as string,
  openAiApiKey: process.env.OPEN_AI_API_KEY as string,
  openAiBaseUrl: process.env.OPEN_AI_BASE_URL as string,
  privateKey: process.env.PRIVATE_KEY as string,
  projectId: process.env.PROJECT_ID as string,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY as string,
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

export const NODE_ENV = env.nodeEnv;
export const BUCKET_NAME = env.bucketName;
export const CLIENT_EMAIL = env.clientEmail;
export const CLIENT_ID = env.clientId;
export const DATABASE_URL = env.databaseUri;
export const OPEN_AI_API_KEY = env.openAiApiKey;
export const OPEN_AI_BASE_URL = env.openAiBaseUrl;
export const PRIVATE_KEY = env.privateKey;
export const PROJECT_ID = env.projectId;
export const STRIPE_SECRET_KEY = env.stripeSecretKey;
