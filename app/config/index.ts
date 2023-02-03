export const env = {
  openAiBaseUrl: process.env.OPEN_AI_BASE_URL as string,
  openAiApiKey: process.env.OPEN_AI_API_KEY as string,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET as string,
  bucketName: process.env.BUCKET_NAME as string,
  clientEmail: process.env.CLIENT_EMAIL as string,
  privateKey: process.env.PRIVATE_KEY as string,
  projectId: process.env.PROJECT_ID as string,
  clientId: process.env.CLIENT_ID as string,
};
