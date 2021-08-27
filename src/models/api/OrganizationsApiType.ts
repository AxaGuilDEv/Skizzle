import type { IdentityType } from './IdentityType';

type OrganizationsApiType = {};

type AzureDevOpsOrganizationApiType = {
	accountId?: string;
	accountName?: string;
};

type GithubOrganizationApiType = {
	login?: string;
	id?: IdentityType;
};

type AzureDevOpsOrganizationsApiType = {
	count: number;
	value: Array<AzureDevOpsOrganizationApiType> & OrganizationsApiType;
};

type GithubOrganizationsApiType = Array<GithubOrganizationApiType> & OrganizationsApiType;

export type {
	OrganizationsApiType,
	AzureDevOpsOrganizationApiType,
	GithubOrganizationApiType,
	AzureDevOpsOrganizationsApiType,
	GithubOrganizationsApiType
};
