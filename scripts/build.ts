import {type BuiltFiles, build, bundle, transform, writeFile} from './utils/build-util';
import {dirname, extname, join} from 'node:path';
import {GADGET_NAME_NOSPACE} from '@constants/constants';
import {__rootDir} from './utils/general-util';
import {existsSync} from 'node:fs';
import {exit} from 'node:process';
import {rimraf} from 'rimraf';

const inputFilePath: string = join(__rootDir, 'src/index.tsx');
const outputFilePath: string = join(__rootDir, `dist/${GADGET_NAME_NOSPACE}.js`);

const outputDirectoryPath: string = dirname(outputFilePath);
await rimraf(outputDirectoryPath);

if (!existsSync(inputFilePath)) {
	console.log('\x1B[31m%s\x1B[0m', 'The entry file does not exist.');
	exit(1);
}

const builtFiles: BuiltFiles = await build(inputFilePath, outputFilePath);
for (const builtFile of builtFiles) {
	const {path, text} = builtFile;

	const fileExt: string = extname(path);
	switch (fileExt) {
		case '.css':
			writeFile(path, text);
			break;
		case '.js': {
			const transformOutput: string = await transform(inputFilePath, text);
			const bundleOutput: string = await bundle(outputFilePath, transformOutput);
			if (!bundleOutput) {
				continue;
			}
			writeFile(path, bundleOutput);
			break;
		}
	}
}
