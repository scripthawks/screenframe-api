import { envFileBasePaths } from '@app/core/config';
import { getTypeormBaseOptions } from '@app/core/db';

const envFilePaths = envFileBasePaths(__dirname);
export const typeormOptions = getTypeormBaseOptions(envFilePaths);
