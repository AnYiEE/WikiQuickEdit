import * as OPTIONS from '~/src/i18n/options.json';
import type {I18nCandidates, I18nMethods} from './types';
import {WG_USER_LANGUAGE} from './constant';
import {generateDefaultFallbackList} from './utils/generateDefaultFallbackList';
import {isValidKey} from '@utils/isValidKey';

const initI18nMethods = (): I18nMethods => {
	const defaultFallbackList: string[] = generateDefaultFallbackList();

	const elect = (candidates: I18nCandidates, locale: string): string => {
		let fallbackList: string[] = defaultFallbackList;
		for (const key of [locale, ...fallbackList]) {
			if (isValidKey(OPTIONS.fallbackTable, key)) {
				fallbackList = OPTIONS.fallbackTable[key];
				break;
			}
		}

		for (const key of new Set([locale, ...fallbackList, ...defaultFallbackList])) {
			if (isValidKey(candidates, key)) {
				return candidates[key];
			}
		}

		return '';
	};

	const i18nMethods: I18nMethods = {
		localize: (candidates) => {
			return elect(candidates, WG_USER_LANGUAGE);
		},
	};

	return i18nMethods;
};

export {initI18nMethods};
