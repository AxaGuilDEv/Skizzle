import type { IdentityType } from 'models/api/IdentityType';
import { ProviderEnum } from 'models/skizzle';

const API_VERSION = '6.1-preview';

export const config = {
	[ProviderEnum.AzureDevOps]: {
		get: {
			profile: (userId: string) =>
				`https://app.vssps.visualstudio.com/_apis/profile/profiles/${userId}?details=true&api-version=${API_VERSION}`,
			descriptor: (userId: IdentityType) =>
				`https://vssps.dev.azure.com/_apis/graph/descriptors/${userId}?api-version=${API_VERSION}`,
			avatar: (organization: string, descriptor: string) =>
				`https://vssps.dev.azure.com/${organization}/_apis/graph/Subjects/${descriptor}/avatars?size=large&api-version=${API_VERSION}`,
			organizations: (userId: IdentityType) =>
				`https://app.vssps.visualstudio.com/_apis/accounts?memberId=${userId}&api-version=${API_VERSION}`,
			projects: (organization: string) =>
				`https://dev.azure.com/${organization}/_apis/projects?$top=1000&api-version=${API_VERSION}`,
			repositories: (organization: string, project: IdentityType) =>
				`https://dev.azure.com/${organization}/${project}/_apis/git/repositories?includeLinks=true&api-version=${API_VERSION}`,
			pullRequests: (
				organization: string,
				project: IdentityType,
				repository: IdentityType
			) =>
				`https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repository}/pullRequests?searchCriteria.status=active&includeLinks=true&api-version=${API_VERSION}`,
			comments: (
				organization: string,
				project: IdentityType,
				repository: IdentityType,
				pullRequest: IdentityType
			) =>
				`https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repository}/pullRequests/${pullRequest}/threads?api-version=${API_VERSION}`,
			reviews: (
				organization: string,
				project: IdentityType,
				repository: IdentityType,
				pullRequest: IdentityType
			) =>
				`https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repository}/pullRequests/${pullRequest}/reviewers?api-version=${API_VERSION}`
		}
	},
	[ProviderEnum.Github]: {
		get: {
			profile: () => `https://api.github.com/user`,
			privateRepositories: () =>
				`https://api.github.com/user/repos?affiliation=owner,collaborator,organization_member&visibility=private`,
			repositories: (query: string) =>
				`https://api.github.com/search/repositories?q=${query}&sort=updated`,
			pullRequests: (owner: string, repository: string) =>
				`https://api.github.com/repos/${owner}/${repository}/pulls?state=open&sort=updated&direction=desc&per_page=20`,
			comments: (owner: string, repository: string, pullRequest: string) =>
				`https://api.github.com/repos/${owner}/${repository}/pulls/${pullRequest}/comments?sort=updated`,
			reviews: (owner: string, repository: string, pullRequest: string) =>
				`https://api.github.com/repos/${owner}/${repository}/pulls/${pullRequest}/reviews`
		}
	}
};
