import type { IdentityType } from './IdentityType';
import type { AzureDevOpsProjectApiType } from './ProjectsApiType';

type RepositoriesApiType = {};

type OwnerApiType = {
	login: string;
};

type AzureDevOpsRepositoryApiType = {
	id?: IdentityType;
	name?: string;
	projects?: AzureDevOpsProjectApiType;
};

type GithubRepositoryApiType = {
	name?: string;
	full_name?: string;
	clone_url?: string;
	id?: IdentityType;
	owner?: OwnerApiType;
};

type AzureDevOpsRepositoriesApiType = {
	count: number;
	value: Array<AzureDevOpsRepositoryApiType> & RepositoriesApiType;
};

type GithubRepositoriesApiType = Array<GithubRepositoryApiType> & RepositoriesApiType;
type GithubSeachRepositoriesApiType = {
	items: Array<GithubRepositoryApiType> & RepositoriesApiType;
};

export type {
	RepositoriesApiType,
	AzureDevOpsRepositoryApiType,
	GithubRepositoryApiType,
	AzureDevOpsRepositoriesApiType,
	GithubRepositoriesApiType,
	GithubSeachRepositoriesApiType
};
