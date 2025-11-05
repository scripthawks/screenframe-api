import { config } from 'dotenv';
import { DataSourceOptions } from 'typeorm';
import { envFilePaths } from '../config';

config({ path: envFilePaths });

const isDbSynchronized =
  process.env.IS_DB_SYNCHRONIZE === '1' ||
  process.env.IS_DB_SYNCHRONIZE === 'true' ||
  process.env.IS_DB_SYNCHRONIZE === 'enabled';
const isDbLogging =
  process.env.IS_DB_LOGGING === '1' ||
  process.env.IS_DB_LOGGING === 'true' ||
  process.env.IS_DB_LOGGING === 'enabled';

export const dbBaseOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: isDbSynchronized,
  logging: isDbLogging,
};
