import type { IdentityType } from './IdentityType';

type ProjectsApiType = {};

type AzureDevOpsProjectApiType = {
	id?: IdentityType;
	name?: string;
};

type GithubProjectApiType = {
	name?: string;
	id?: IdentityType;
};

type AzureDevOpsProjectsApiType = {
	count: number;
	value: Array<AzureDevOpsProjectApiType> & ProjectsApiType;
};

type GithubProjectsApiType = Array<GithubProjectApiType> & ProjectsApiType;

export type {
	ProjectsApiType,
	AzureDevOpsProjectApiType,
	GithubProjectApiType,
	AzureDevOpsProjectsApiType,
	GithubProjectsApiType
};
