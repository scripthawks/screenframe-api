import { envFileBasePaths } from '@app/core/config';
import { getTypeormBaseOptions } from '@app/core/db';

// TODO: WHY? DELETE OPTIONS AND DOUBLE IMPORT CONFIG
const envFilePaths = envFileBasePaths(__dirname);
export const typeormOptions = getTypeormBaseOptions(envFilePaths);
