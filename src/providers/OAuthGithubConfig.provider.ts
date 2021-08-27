import { OAuthConfig, OAuthConfigType } from './OAuthConfig.provider';
import { ProviderEnum } from 'models/skizzle';

export type OAuthGithubConfigType = {
	client_id?: string;
	client_secret?: string;
	code?: string;
} & OAuthConfigType;

export class OAuthGithubConfig extends OAuthConfig<OAuthGithubConfigType> {
	private readonly bodyKeys = ['code', 'client_secret', 'client_id'];

	constructor() {
		super(ProviderEnum.Github);
	}

	public getBody(): OAuthGithubConfigType {
		const condition = new Set(this.bodyKeys);

		return Object.entries(this.params).reduce((acc, [key, val]) => {
			if (condition.has(key)) {
				acc[key] = val;
			}
			return acc;
		}, {});
	}
}
