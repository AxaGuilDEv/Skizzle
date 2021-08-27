import type { ProviderEnum } from 'models/skizzle/ProviderEnum';
import type { OAuthConfigType } from 'providers/OAuthConfig.provider';
import { client } from 'shared/stores/authentication.store';

export const connectWith = (provider: ProviderEnum, config: OAuthConfigType): void => {
	client.update(n => ({
		...n,
		[provider]: {
			...n[provider],
			...config
		}
	}));
};
