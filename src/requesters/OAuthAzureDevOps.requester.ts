import { config } from 'config';
import type {
	AzureDevOpsAvatarApiType,
	AzureDevOpsDescriptorApiType,
	AzureDevOpsCommentApiType,
	AzureDevOpsCommentsApiType,
	AzureDevOpsProfileApiType,
	AzureDevOpsOrganizationApiType,
	AzureDevOpsOrganizationsApiType,
	AzureDevOpsProjectApiType,
	AzureDevOpsProjectsApiType,
	AzureDevOpsPullRequestApiType,
	AzureDevOpsPullRequestsApiType,
	AzureDevOpsRepositoriesApiType,
	AzureDevOpsRepositoryApiType,
	AzureDevOpsReviewApiType,
	AzureDevOpsReviewsApiType,
	IdentityType
} from 'models/api';
import type { HeaderType } from 'models/skizzle';
import type { OAuthAzureDevOpsConfigType } from 'providers/OAuthAzureDevOpsConfig.provider';
import { Requester } from './Requester';

export class OAuthAzureDevOpsRequester extends Requester<OAuthAzureDevOpsConfigType> {
	public getHeader(config: OAuthAzureDevOpsConfigType): HeaderType {
		return {
			'content-type': 'application/json',
			authorization: config.access_token
		};
	}

	public async getProfile(userId: string): Promise<AzureDevOpsProfileApiType> {
		return super.fetch(config.AzureDevOps.get.profile(userId));
	}

	public async getDescriptor(userId: IdentityType): Promise<string> {
		return (
			await super.fetch<AzureDevOpsDescriptorApiType>(
				config.AzureDevOps.get.descriptor(userId)
			)
		).value;
	}

	public async getAvatar(descriptor: string, organizationName: string): Promise<string> {
		return (
			await super.fetch<AzureDevOpsAvatarApiType>(
				config.AzureDevOps.get.avatar(organizationName, descriptor)
			)
		).value;
	}

	public async getOrganizations(
		userId?: string
	): Promise<AzureDevOpsOrganizationApiType[]> {
		return (
			await super.fetch<AzureDevOpsOrganizationsApiType>(
				config.AzureDevOps.get.organizations(userId)
			)
		).value;
	}

	public async getProjects(organization?: string): Promise<AzureDevOpsProjectApiType[]> {
		try {
			const projects = (
				await super.fetch<AzureDevOpsProjectsApiType>(
					config.AzureDevOps.get.projects(organization)
				)
			)?.value;

			return projects || [];
		} catch (err) {
			console.error(err);
			return [];
		}
	}

	public async getRepositories(
		organization?: string,
		project?: string
	): Promise<AzureDevOpsRepositoryApiType[]> {
		try {
			const repositories = (
				await super.fetch<AzureDevOpsRepositoriesApiType>(
					config.AzureDevOps.get.repositories(organization, project)
				)
			).value;

			return repositories;
		} catch (err) {
			console.error(err);
			return [];
		}
	}

	public async getPullRequests(
		organization?: string,
		project?: string,
		repository?: string
	): Promise<AzureDevOpsPullRequestApiType[]> {
		const pullRequests = (
			await super.fetch<AzureDevOpsPullRequestsApiType>(
				config.AzureDevOps.get.pullRequests(organization, project, repository)
			)
		).value;

		return pullRequests
			.sort((a, b) => Date.parse(a.creationDate) - Date.parse(b.creationDate))
			.slice(0, 20);
	}

	public async getComments(
		organization?: string,
		project?: string,
		repository?: string,
		pullRequest?: string
	): Promise<AzureDevOpsCommentApiType[]> {
		return (
			await super.fetch<AzureDevOpsCommentsApiType>(
				config.AzureDevOps.get.comments(organization, project, repository, pullRequest)
			)
		).value;
	}

	public async getReviews(
		organization?: string,
		project?: string,
		repository?: string,
		pullRequest?: string
	): Promise<AzureDevOpsReviewApiType[]> {
		return (
			await super.fetch<AzureDevOpsReviewsApiType>(
				config.AzureDevOps.get.reviews(organization, project, repository, pullRequest)
			)
		).value;
	}
}
