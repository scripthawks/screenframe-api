import { config } from 'dotenv';
import { DataSourceOptions } from 'typeorm';
import { CustomNamingStrategy } from '../strategies';

export function getTypeormBaseOptions(envPaths: string[]): DataSourceOptions {
  config({ path: envPaths });
  const isDbSynchronized =
    process.env.IS_DB_SYNCHRONIZE === '1' ||
    process.env.IS_DB_SYNCHRONIZE === 'true' ||
    process.env.IS_DB_SYNCHRONIZE === 'enabled';
  const isDbLogging =
    process.env.IS_DB_LOGGING === '1' ||
    process.env.IS_DB_LOGGING === 'true' ||
    process.env.IS_DB_LOGGING === 'enabled';

  return {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    namingStrategy: new CustomNamingStrategy(),
    synchronize: isDbSynchronized,
    logging: isDbLogging,
  };
}
