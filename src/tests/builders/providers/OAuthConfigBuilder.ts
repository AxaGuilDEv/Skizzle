import type { OAuthConfigType } from '../../../providers/OAuthConfig.provider';

export class OAuthConfigBuilder {
	private config = {} as OAuthConfigType;

	withToken(token?: string): OAuthConfigBuilder {
		this.config = {
			access_token: token ?? 'token'
		};

		return this;
	}

	build(): OAuthConfigType {
		return this.config;
	}
}
