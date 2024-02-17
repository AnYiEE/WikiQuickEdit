/* eslint-disable @typescript-eslint/no-unsafe-call */
import {type Targets, browserslistToTargets} from 'lightningcss';
import {type BuildOptions} from 'esbuild';
// @ts-expect-error TS7016
import LessPluginPresetEnv from 'less-plugin-preset-env';
import browserslist from 'browserslist';
import esbuildPluginCssModules from 'esbuild-css-modules-plugin';
import {lessLoader as esbuildPluginLess} from 'esbuild-plugin-less';
import esbuildPluginPostcss from 'esbuild-postcss';

/**
 * @summary Do not forget to declare these file extensions in `src/global.d.ts`
 * @see {@link https://esbuild.github.io/api/#loader}
 */
const loader = {
	'.gif': 'dataurl',
	'.ico': 'dataurl',
	'.jpg': 'dataurl',
	'.jpeg': 'dataurl',
	'.png': 'dataurl',
	'.svg': 'text',
} as const satisfies BuildOptions['loader'];

const lessOptions: Less.Options = {
	plugins: [new LessPluginPresetEnv() as unknown as Less.Plugin],
};
const targets: Targets = browserslistToTargets(browserslist());

/**
 * @see {@link https://esbuild.github.io/api/#general-options}
 */
const esbuildOptions = {
	loader,
	bundle: true,
	charset: 'utf8',
	define: {
		'process.env.NODE_ENV': '"production"',
	},
	legalComments: 'inline',
	plugins: [
		esbuildPluginCssModules({
			targets,
			filter: /\.module\.(?:css|less)$/i,
			namedExports: true,
		}),
		esbuildPluginPostcss(),
		esbuildPluginLess(lessOptions),
	],
	treeShaking: true,
	write: false,
} as const satisfies BuildOptions;

export {esbuildOptions};
