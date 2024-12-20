import { S3Client } from '@aws-sdk/client-s3';

if (!process.env.DO_SPACES_KEY || !process.env.DO_SPACES_SECRET || !process.env.DO_SPACES_ENDPOINT) {
  throw new Error('DigitalOcean Spaces credentials are not properly configured');
}

export const s3Client = new S3Client({
  region: process.env.DO_SPACES_REGION || 'nyc3',
  endpoint: `https://${process.env.DO_SPACES_ENDPOINT}`,
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  },
});