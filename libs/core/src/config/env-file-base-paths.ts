import { join } from 'path';

export function envFileBasePaths(baseDir: string) {
  if (!process.env.NODE_ENV) {
    throw new Error('NODE_ENV environment is missing');
  }

  const envFilePaths = [
    process.env.ENV_FILE_PATH?.trim() || '',
    join(baseDir, 'env', `.env.${process.env.NODE_ENV}.local`),
    join(baseDir, 'env', `.env.${process.env.NODE_ENV}`),
    join(baseDir, 'env', '.env.production'),
  ];
  return envFilePaths;
}
