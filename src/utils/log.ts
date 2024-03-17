import {GADGET_NAME_NOSPACE} from '@constants/constants';

class CustomError extends Error {
	constructor(message?: string, options?: ErrorOptions) {
		super(message, options);
		// eslint-disable-next-line unicorn/custom-error-definition
		this.name = GADGET_NAME_NOSPACE;
	}
}

const log = (...messages: unknown[]): void => {
	console.log(`[${GADGET_NAME_NOSPACE}]:`, ...messages);
};

export {CustomError, log};
