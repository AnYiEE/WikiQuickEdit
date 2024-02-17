import * as PACKAGE from '~/package.json';
import {type BabelFileResult, type TransformOptions, transformAsync} from '@babel/core';
import {type BuildResult, type OutputFile, build as esbuild} from 'esbuild';
import {GADGET_DESCRIPTION, GADGET_NAME, GADGET_VERSION} from '@constants/constants';
import {type PathOrFileDescriptor, closeSync, fdatasyncSync, mkdirSync, openSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {__rootDir} from './general-util';
import {esbuildOptions} from '../build-esbuild_options';

type BuiltFiles = {
	path: string;
	text: string;
}[];

/**
 * Generate banner and footer
 *
 * @private
 * @return {Object} The banner and footer
 */
const generateBannerAndFooter = (): typeof code => {
	const header = `/**
* ${GADGET_NAME} - ${GADGET_VERSION}
*
* @description ${GADGET_DESCRIPTION}
* @license ${PACKAGE.license}
* @see {@link ${PACKAGE.homepage}}
*/` satisfies string;

	const banner = `${header}\n/* <nowiki> */\n` satisfies string;
	const footer = '\n/* </nowiki> */' satisfies string;

	const code = {
		banner: {
			css: banner,
			js: banner,
		},
		footer: {
			css: footer,
			js: footer,
		},
	} satisfies {
		banner: Record<string, string>;
		footer: Record<string, string>;
	};

	return code;
};

const bannerAndFooter = generateBannerAndFooter();

/**
 * @param {string} outputFilePath
 * @param {string} sourceCode
 */
const writeFile = (outputFilePath: string, sourceCode: string): void => {
	const outputDirectoryPath: string = dirname(outputFilePath);
	mkdirSync(outputDirectoryPath, {
		recursive: true,
	});

	const fileDescriptor: PathOrFileDescriptor = openSync(outputFilePath, 'w');
	writeFileSync(fileDescriptor, sourceCode);
	fdatasyncSync(fileDescriptor);
	closeSync(fileDescriptor);
};

/**
 * @param {string} inputFilePath
 * @param {string} outputFilePath
 * @return {Promise<BuiltFiles>}
 */
const build = async (inputFilePath: string, outputFilePath: string): Promise<BuiltFiles> => {
	const builtFiles: BuiltFiles = [];

	const buildResult: BuildResult = await esbuild({
		...esbuildOptions,
		...bannerAndFooter,
		entryPoints: [inputFilePath],
		outfile: outputFilePath,
		format: 'cjs',
	});

	const {outputFiles} = buildResult;
	if (!outputFiles) {
		return [];
	}

	for (const outputFile of outputFiles) {
		const {path, text} = outputFile;

		builtFiles.push({
			path,
			text,
		});
	}

	return builtFiles;
};

/**
 * @param {string} outputFilePath
 * @param {string} sourceCode
 * @return {Promise<string>}
 */
const bundle = async (outputFilePath: string, sourceCode: string): Promise<string> => {
	const buildResult: BuildResult = await esbuild({
		...esbuildOptions,
		...bannerAndFooter,
		stdin: {
			contents: sourceCode,
			resolveDir: __rootDir,
			sourcefile: outputFilePath,
		},
	});

	const {outputFiles} = buildResult;
	if (!outputFiles) {
		return '';
	}

	const {text} = outputFiles[0] as OutputFile;

	return text;
};

/**
 * @private
 * @return {TransformOptions}
 */
const generateTransformOptions = (): typeof options => {
	const options = {
		presets: [
			[
				'@babel/preset-env',
				{
					bugfixes: true, // FIXME: Remove when updating to Babel 8
					corejs: {
						version: PACKAGE.devDependencies['core-js'].match(/\d+(?:.\d+){0,2}/)?.[0] ?? '3.36',
					},
					exclude: ['web.dom-collections.for-each', 'web.dom-collections.iterator'],
					modules: 'commonjs',
					useBuiltIns: 'usage',
				},
			],
		],
		compact: false,
		plugins: [
			'@mrhenry/core-web',
			join(__rootDir, 'scripts/plugins/babel-plugin-convert-comments.ts'),
			join(__rootDir, 'scripts/plugins/babel-plugin-import-polyfills.ts'),
		],
	} as const satisfies TransformOptions;

	return options;
};

/**
 * @private
 */
const transformOptions = generateTransformOptions();

/**
 * @param {string} inputFilePath
 * @param {string} sourceCode
 * @return {Promise<string>}
 */
const transform = async (inputFilePath: string, sourceCode: string): Promise<string> => {
	const babelFileResult = (await transformAsync(sourceCode, {
		...transformOptions,
		cwd: __rootDir,
		filename: inputFilePath,
	})) as BabelFileResult;
	const {code: transformOutput} = babelFileResult;

	return transformOutput as string;
};

export {type BuiltFiles, writeFile, build, bundle, transform};
