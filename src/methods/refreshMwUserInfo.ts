import {CustomError, log} from '@utils/log';
import {mwConfig} from '@constants/mwConfig';
import {useMwApi} from '@utils/mw/useMwApi';

interface MwUserInfo {
	blockid: number;
	id: number;
	name: string;
	rights: string[];
}

let mwUserInfo: MwUserInfo = {
	blockid: 1,
	id: 0,
	name: '',
	rights: [],
};

const errorMsg = 'Failed to query user information.' satisfies string;

const refreshMwUserInfo = async (retryCount: number = 3): Promise<void> => {
	if (!retryCount) {
		throw new CustomError(`${errorMsg} (retried maximum times)`);
	}

	const {wgUserName} = mwConfig;
	if (!wgUserName) {
		throw new CustomError('Can only query information of logged-in users.');
	}

	let response: Awaited<ReturnType<mw.Api['get']>> | undefined;
	try {
		response = await useMwApi().get({
			action: 'query',
			list: 'users',
			meta: 'userinfo',
			uiprop: 'rights',
			usprop: 'blockinfo',
			ususers: wgUserName,
		});
	} catch (error) {
		log(errorMsg, error);
		return refreshMwUserInfo(--retryCount);
	}

	if (!response) {
		throw new CustomError(`${errorMsg} (response is empty)`);
	}

	const {
		userinfo: {id, name, rights},
		users,
	} = response['query'] as {
		userinfo: {
			id: number;
			name: string;
			rights: string[];
		};
		users: {
			blockid?: number;
			name: string;
			userid: number;
		}[];
	};
	const {blockid} = users[0]!;

	mwUserInfo = {
		id,
		name,
		rights,
		blockid: blockid ?? 0,
	};
};

export {mwUserInfo, refreshMwUserInfo};
