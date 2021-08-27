import { v4 } from 'uuid';
import type {
	AzureDevOpsOrganizationsApiType,
	AzureDevOpsOrganizationApiType,
	GithubOrganizationsApiType,
	GithubOrganizationApiType
} from 'models/api/OrganizationsApiType';

class AzureDevOpsOrganizationBuilder {
	private organization = {} as AzureDevOpsOrganizationApiType;

	constructor() {
		this.organization.accountId = v4();
	}

	withOrganizationName(name: string): AzureDevOpsOrganizationBuilder {
		this.organization.accountName = name;

		return this;
	}

	build(): AzureDevOpsOrganizationApiType {
		return this.organization;
	}
}

class GithubOrganizationBuilder {
	private organization = {} as GithubOrganizationApiType;

	constructor() {
		this.organization.id = v4();
	}

	withOrganizationName(name: string): GithubOrganizationBuilder {
		this.organization.login = name;

		return this;
	}

	build(): GithubOrganizationApiType {
		return this.organization;
	}
}

class AzureDevOpsOrganizationsBuilder {
	private organizations = {} as AzureDevOpsOrganizationsApiType;

	withOrganizations(
		...organizations: AzureDevOpsOrganizationApiType[]
	): AzureDevOpsOrganizationsBuilder {
		this.organizations.value = organizations;
		this.organizations.count = organizations.length;

		return this;
	}

	build(): AzureDevOpsOrganizationsApiType {
		return this.organizations;
	}
}

class GithubOrganizationsBuilder {
	private organizations = [] as GithubOrganizationsApiType;

	withOrganizations(
		...organizations: GithubOrganizationApiType[]
	): GithubOrganizationsBuilder {
		this.organizations = [...organizations];

		return this;
	}

	build(): GithubOrganizationsApiType {
		return this.organizations;
	}
}

export {
	AzureDevOpsOrganizationsBuilder,
	AzureDevOpsOrganizationBuilder,
	GithubOrganizationsBuilder,
	GithubOrganizationBuilder
};
