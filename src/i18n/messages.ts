import type {I18nCandidates} from '@utils/i18n/modules/types';

const messages = {
	'place-holder': {
		en: 'Hello, World!',
	},
	test: {
		en: 'Test{{element}}',
		zh: '测试{{element}}',
	},
} satisfies Record<string, I18nCandidates>;

export {messages};
