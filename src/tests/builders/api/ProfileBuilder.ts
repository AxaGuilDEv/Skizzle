import type {
	AzureDevOpsProfileApiType,
	GithubProfileApiType
} from 'models/api/ProfileApiType';
import { v4 } from 'uuid';

class AzureDevOpsProfileBuilder {
	private profile = {} as AzureDevOpsProfileApiType;

	constructor() {
		this.profile.id = v4();
		this.profile.coreAttributes = {
			Avatar: {
				value: {
					value:
						'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII='
				}
			}
		};
	}

	withDisplayName(displayName: string): AzureDevOpsProfileBuilder {
		this.profile.displayName = displayName;

		return this;
	}

	withEmailAddress(emailAddress: string): AzureDevOpsProfileBuilder {
		this.profile.emailAddress = emailAddress;

		return this;
	}

	build(): AzureDevOpsProfileApiType {
		return this.profile;
	}
}

class GithubProfileBuilder {
	private profile = {} as GithubProfileApiType;

	constructor() {
		this.profile.id = v4();
		this.profile.avatar_url = '';
	}

	withName(name: string): GithubProfileBuilder {
		this.profile.name = name;

		return this;
	}

	withEmail(email: string): GithubProfileBuilder {
		this.profile.email = email;

		return this;
	}

	build(): GithubProfileApiType {
		return this.profile;
	}
}

export { AzureDevOpsProfileBuilder, GithubProfileBuilder };
