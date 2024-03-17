import {initI18nMethods} from './modules/initI18nMethods';

const i18nMethods: ReturnType<typeof initI18nMethods> = initI18nMethods();

// eslint-disable-next-line @typescript-eslint/unbound-method
export const {localize} = i18nMethods;
