import {resolve} from 'node:path';

/**
 * @private
 * @return {string}
 */
const getRootDir = (): string => {
	const rootDir: string = resolve();

	return rootDir;
};

/**
 * The root directory of the project
 */
const __rootDir: string = getRootDir();

export {__rootDir};
