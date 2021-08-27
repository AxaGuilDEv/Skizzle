import type { SettingsType } from '../models/skizzle/SettingsType';
import type { HeaderType } from '../models/skizzle/HeaderType';
import { error } from 'electron-log';

var superagent = require('superagent');
require('superagent-proxy')(superagent);

export const requester = async (
	url: string,
	headers?: HeaderType,
	settings?: SettingsType
) => {
	try {
		//info('Begin', { url, headers, settings });
		const result = await superagent
			.get(url)
			.proxy(settings.proxy)
			.set('User-Agent', headers['user-agent'])
			.auth(headers?.authorization, { type: 'bearer' });
		//info('End', { result });

		return result.body;
	} catch (err) {
		error('Error', { err });
		throw new Error(err);
	}
};
