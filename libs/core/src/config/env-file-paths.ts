import { join } from 'path';

if (!process.env.NODE_ENV) {
  throw new Error('NODE_ENV environment is missing');
}

const serviceRoot = __dirname;
export const envFilePaths = [
  process.env.ENV_FILE_PATH?.trim() || '',
  join(serviceRoot, 'env', `.env.${process.env.NODE_ENV}.local`),
  join(serviceRoot, 'env', `.env.${process.env.NODE_ENV}`),
  join(serviceRoot, 'env', '.env.production'),
];
