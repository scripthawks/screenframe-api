import { join } from 'path';

export function envFileBasePaths(baseDir: string) {
  if (!process.env.NODE_ENV) {
    throw new Error('NODE_ENV environment is missing');
  }
  const projectRoot =
    process.env.NODE_ENV === 'test'
      ? join(baseDir, '..', '..', '..')
      : join(baseDir);

  return [
    process.env.ENV_FILE_PATH?.trim() || '',
    join(projectRoot, 'env', `.env.${process.env.NODE_ENV}.local`),
    join(projectRoot, 'env', `.env.${process.env.NODE_ENV}`),
    join(projectRoot, 'env', '.env.production'),
  ];
}
