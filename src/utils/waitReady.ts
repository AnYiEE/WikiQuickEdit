import {delay} from '@utils/delay';

type ExpectEvent = 'DOMContentLoaded' | 'load';

const _waitReady = (event: ExpectEvent): Promise<boolean> => {
	const condition: DocumentReadyState[] = ['complete', 'interactive'];
	if (event === 'load') {
		condition.pop();
	}

	const checkReady = (): boolean => {
		return condition.includes(document.readyState);
	};

	return new Promise<boolean>((resolve) => {
		if (checkReady()) {
			resolve(true);
		} else {
			document.addEventListener('readystatechange', () => {
				if (checkReady()) {
					resolve(true);
				}
			});
		}
	});
};

const waitReady = async (event: ExpectEvent | 'delayLoad' = 'DOMContentLoaded'): Promise<void> => {
	switch (event) {
		case 'DOMContentLoaded':
			await _waitReady('DOMContentLoaded');
			break;
		case 'load':
			await _waitReady('load');
			break;
		case 'delayLoad':
			await _waitReady('load');
			await delay(3 * 1000);
	}
};

export {waitReady};
