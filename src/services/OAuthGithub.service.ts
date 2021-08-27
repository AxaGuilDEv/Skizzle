import { ProfileMapper, PullRequestMapper, RepositoryMapper } from 'mappers';
import type { ProfileType, PullRequestType, RepositoryType } from 'models/skizzle';
import { ProviderEnum } from 'models/skizzle';
import { OAuthGithubRequester } from 'requesters/OAuthGithub.requester';
import { clientAuthenticated } from 'shared/stores/authentication.store';
import { get } from 'svelte/store';
import type { IService, ServiceParams } from './Service';

export class OAuthGithubService implements IService {
	private requester: OAuthGithubRequester;
	private readonly provider = ProviderEnum.Github;
	private static instance: OAuthGithubService;

	private constructor() {
		this.requester = new OAuthGithubRequester(this.provider);
	}

	public static getInstance(): OAuthGithubService {
		if (!OAuthGithubService.instance) {
			OAuthGithubService.instance = new OAuthGithubService();
		}

		return OAuthGithubService.instance;
	}

	public isLogged(): boolean {
		return get(clientAuthenticated).isGithubAuthenticated;
	}

	public async getProfile(): Promise<ProfileType> {
		const result = await this.requester.getProfile();

		const mapper = new ProfileMapper();

		return mapper.to(result, { provider: this.provider });
	}

	public async getAvatar(avatar: string): Promise<string> {
		return avatar;
	}

	public async getRepositories(params: ServiceParams): Promise<RepositoryType[]> {
		const { query } = params;

		if (!query) {
			return [];
		}

		const result = await this.requester.getRepositories(query, true);

		const mapper = new RepositoryMapper();

		return mapper.to(result, { provider: this.provider });
	}

	public async getPullRequests({ repository }: ServiceParams): Promise<PullRequestType[]> {
		const { name, repositoryId, owner } = repository;

		let result = await this.requester.getPullRequests(owner, name);

		result = await Promise.all(
			result.map(async pullRequest => {
				let comments = await this.requester.getComments(
					owner,
					name,
					pullRequest.number.toString()
				);

				let reviewers = await this.requester.getReviews(
					owner,
					name,
					pullRequest.number.toString()
				);

				pullRequest.comments = comments;
				pullRequest.reviewers = reviewers;

				return pullRequest;
			})
		);

		return new PullRequestMapper().to(result, {
			owner,
			repositoryId,
			repositoryName: name,
			provider: this.provider
		});
	}
}
