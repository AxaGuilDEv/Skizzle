import { get } from 'svelte/store';
import type { OAuthConfigType } from 'providers';
import { ProviderEnum } from 'models/skizzle';
import {
	OAuthAzureDevOpsConfig,
	OAuthAzureDevOpsConfigType
} from 'providers/OAuthAzureDevOpsConfig.provider';
import { getToken } from 'shared/token';
import {
	OAuthGithubConfig,
	OAuthGithubConfigType
} from 'providers/OAuthGithubConfig.provider';
import { createStore } from './store';
import type { Dictionary } from 'shared/utils';

/**
 * Authentication
 */
export const client = createStore<Dictionary<OAuthConfigType>>(
	{},
	{ key: 'clientToken' }
);
export const clientHasProvider = (provider: ProviderEnum): boolean => {
	const value = get(client) as Dictionary<OAuthConfigType>;

	return value && value.hasOwnProperty(provider);
};

export const clientAuthenticated = createStore(
	{
		isGithubAuthenticated: false,
		isAzureDevOpsAuthenticated: false
	},
	{}
);

const timer: Dictionary<NodeJS.Timeout> = {};

const createIntervalRefresh = (key: string, element: OAuthConfigType) => {
	let interval = setInterval(async () => {
		const diffSecondes = Math.abs(
			(new Date(element.current_date).getTime() - new Date().getTime()) / 1000
		);

		const expires_in = parseInt(element.expires_in);

		if (diffSecondes > expires_in) {
			switch (key) {
				case ProviderEnum.AzureDevOps:
					await getToken<OAuthAzureDevOpsConfigType>(new OAuthAzureDevOpsConfig());
					break;
				case ProviderEnum.Github:
					await getToken<OAuthGithubConfigType>(new OAuthGithubConfig());
					break;
			}
		}
	}, 10000);

	timer[key] = interval;
};

const authentication = async (client: Dictionary<OAuthConfigType>) => {
	const configs = Object.entries(client);

	configs.forEach(([key, value]) => {
		const exist = !!client[key] && Object.getOwnPropertyNames(client[key]).length >= 1;
		switch (key) {
			case ProviderEnum.Github:
				clientAuthenticated.update(x => ({
					...x,
					isGithubAuthenticated: exist && value && !!value.access_token
				}));
				break;
			case ProviderEnum.AzureDevOps:
				clientAuthenticated.update(x => ({
					...x,
					isAzureDevOpsAuthenticated: exist && value && !!value.access_token
				}));
				break;
		}
	});

	for (const [key, value] of configs.filter(
		([key, _]) => !!client[key] && Object.getOwnPropertyNames(client[key]).length >= 1
	)) {
		const interval = timer[key];

		if (value && value.current_date && !interval) {
			createIntervalRefresh(key, value);
		}

		if (value && !value.access_token) {
			switch (key) {
				case ProviderEnum.AzureDevOps:
					await getToken<OAuthAzureDevOpsConfigType>(new OAuthAzureDevOpsConfig());
					break;
				case ProviderEnum.Github:
					await getToken<OAuthGithubConfigType>(new OAuthGithubConfig());
					break;
			}
		}
	}
};

client.subscribe(authentication);
