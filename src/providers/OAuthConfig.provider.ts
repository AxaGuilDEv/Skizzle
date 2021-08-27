import { get } from 'svelte/store';
import { client } from 'shared/stores/authentication.store';
import type { ProviderEnum } from 'models/skizzle';

export type OAuthConfigType = {
	current_date?: Date;
	access_token?: string;
	token_type?: string;
	expires_in?: string;
};

export abstract class OAuthConfig<T extends OAuthConfigType> {
	protected params: T;
	private readonly provider: ProviderEnum;

	constructor(provider: ProviderEnum) {
		this.params = get(client)[provider] as T;
		this.provider = provider;
	}

	public abstract getBody(): T | string;

	public getProvider(): string {
		return this.provider;
	}
}
