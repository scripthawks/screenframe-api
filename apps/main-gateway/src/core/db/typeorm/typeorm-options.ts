import { envFileBasePaths } from '@app/core/config';
import { getTypeormBaseOptions } from '@app/core/db';

const envFilePaths = envFileBasePaths(__dirname);
console.log('typeormOptions: ', envFilePaths);
export const typeormOptions = getTypeormBaseOptions(envFilePaths);
