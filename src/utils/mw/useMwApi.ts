import * as PACKAGE from '~/package.json';
import {GADGET_NAME_NOSPACE, GADGET_VERSION} from '@constants/constants';
import type {ApiOptions} from 'types-mediawiki-renovate/mw/Api';
import {mwConfig} from '@constants/mwConfig';

const useMwApi = (parameters: ApiOptions['parameters'] = {}): mw.Api => {
	return new mw.Api({
		parameters: {
			format: 'json',
			formatversion: 2,
			...parameters,
		},
		ajax: {
			headers: {
				'Api-User-Agent': `${GADGET_NAME_NOSPACE}/${GADGET_VERSION}@${mwConfig.wgDBname} (${PACKAGE.homepage})`,
			},
		},
	});
};

export {useMwApi};
