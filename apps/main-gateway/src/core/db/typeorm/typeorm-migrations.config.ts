import { envFileBasePaths } from '@app/core/config';
import { getTypeormBaseOptions } from '@app/core/db';
import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import { User } from '../../../user-accounts/users/domain/user.entity';

const baseDir = join(__dirname, '..', '..', '..');
const envFilePaths = envFileBasePaths(baseDir);
const dbOptions = getTypeormBaseOptions(envFilePaths);
const migrationsConfig: DataSourceOptions = {
  ...dbOptions,
  migrations: [
    join(baseDir, 'core', 'db', 'typeorm', 'migrations', '**', '*.ts'),
  ],
  entities: [User],
};
export default new DataSource(migrationsConfig);
