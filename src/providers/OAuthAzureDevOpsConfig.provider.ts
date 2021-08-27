import { OAuthConfig, OAuthConfigType } from './OAuthConfig.provider';
import { ProviderEnum } from 'models/skizzle';

export type OAuthAzureDevOpsConfigType = {
	redirect_uri?: string;
	client_assertion?: string;
	code?: string;
	refresh_token?: string;
	client_assertion_type?: string;
	grant_type?: string;
	assertion?: string;
} & OAuthConfigType;

export class OAuthAzureDevOpsConfig extends OAuthConfig<OAuthAzureDevOpsConfigType> {
	private readonly bodyKeys = [
		'client_assertion_type',
		'client_assertion',
		'grant_type',
		'assertion',
		'redirect_uri'
	];

	constructor() {
		super(ProviderEnum.AzureDevOps);

		const assertion = this.params.refresh_token || this.params.code;

		this.params = {
			...this.params,
			client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
			grant_type: this.params.refresh_token
				? 'refresh_token'
				: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
			assertion
		};
	}

	public getBody(): string {
		return Object.entries(this.params)
			.filter(([key, _]) => this.bodyKeys.some(x => x === key))
			.map(([key, value]) => `${key}=${value}`)
			.join('&');
	}
}
