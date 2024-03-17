import type {I18nCandidatesKey} from '~/src/i18n/types';

type I18nCandidates = Partial<Record<I18nCandidatesKey, string>>;

interface I18nMethods {
	localize(candidates: I18nCandidates): string;
}

export type {I18nCandidates, I18nMethods};
