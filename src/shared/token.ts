import { get } from 'svelte/store';
import type { OAuthConfig, OAuthConfigType } from 'providers';
import { isLoading, settings } from './stores/default.store';
import { remote } from './remote';
import { client } from './stores/authentication.store';

const getToken = async <T extends OAuthConfigType>(config: OAuthConfig<T>) => {
	const provider = config.getProvider();

	const body = config.getBody();

	const result = await remote.invoke('token', {
		key: provider,
		body,
		settings: get(settings)
	});

	if (result.message) {
		console.error({ message: result.message });

		client.update(n => ({
			...n,
			[provider]: {}
		}));
	} else {
		if (result.access_token) {
			client.update(n => ({
				...n,
				[provider]: {
					...n[provider],
					...result,
					current_date: new Date()
				}
			}));
		}
	}
	isLoading.set(false);
};

export { getToken };
