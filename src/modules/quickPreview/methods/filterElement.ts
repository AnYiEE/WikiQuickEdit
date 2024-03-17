import {mwConfig} from '@constants/mwConfig';

const {wgArticlePath, wgServerName} = mwConfig;
const articlePath: string = wgArticlePath.replace('$1', '');

const filterElement = (element: HTMLAnchorElement): boolean => {
	const {classList, href} = element;
	if (!href) {
		return false;
	}

	if (classList.length && !classList.contains('mw-redirect')) {
		return false;
	}

	let urlInstance: URL;
	try {
		urlInstance = new URL(href);
	} catch {
		return false;
	}

	const {hash, host, pathname} = urlInstance;
	if (hash || host !== wgServerName || !pathname.startsWith(articlePath)) {
		return false;
	}

	let titleInstance: mw.Title;
	try {
		const title: string = decodeURIComponent(pathname).replace(articlePath, '');
		titleInstance = new mw.Title(title);
	} catch {
		return false;
	}

	if (titleInstance.getNamespaceId() !== 0 && titleInstance.getNamespacePrefix() !== 'Help:') {
		return false;
	}

	return true;
};

export {filterElement};
