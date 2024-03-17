import 'reset-css';
import {GADGET_NAME_ORIGINAL, GADGET_VERSION} from '@constants/constants';
import React, {ShadowRoot} from 'jsx-dom';
import {mwConfig, refreshMwConfig} from '@constants/mwConfig';
import {mwUserInfo, refreshMwUserInfo} from '@methods/refreshMwUserInfo';
import App from './App';
import {CustomError} from '@utils/log';
import {globalConfig} from '@constants/globalConfig';
import {quickPreview} from '@modules/quickPreview/quickPreview';
import {waitReady} from '@utils/waitReady';

(async function startup(): Promise<void> {
	const {currentScript} = document;
	if (!currentScript || !(currentScript instanceof HTMLScriptElement)) {
		throw new CustomError('The gadget must be loaded by the `mw.loader.load` method.');
	}

	const configKey = `${GADGET_NAME_ORIGINAL}__inited`;
	if (mwConfig[configKey] === true) {
		throw new CustomError('The gadget has already been initialized.');
	}
	mw.config.set(configKey, true);
	refreshMwConfig();

	await mw.loader.using(['mediawiki.api', 'mediawiki.Title', 'mediawiki.util']);

	await refreshMwUserInfo();
	const {blockid, name} = mwUserInfo;
	if (blockid) {
		throw new CustomError(`The user "${name}" is blocked.`);
	}

	globalConfig.styleUrl = `${currentScript.src.replace(/\.js$/, '.css')}?_v=${GADGET_VERSION}`;

	await waitReady('DOMContentLoaded');

	quickPreview(mw.util.$content.find('.mw-parser-output'));

	if (mwConfig.debug === 0) {
		return;
	}
	mw.util.$content.append(
		<div className="gadget-nospace" id={GADGET_NAME_ORIGINAL} style={{all: 'revert'}}>
			<ShadowRoot mode="closed">
				<link rel="stylesheet" href={globalConfig.styleUrl} />
				<App />
			</ShadowRoot>
		</div>
	);
})();
