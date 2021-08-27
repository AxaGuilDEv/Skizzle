import { config } from 'config';
import type {
	GithubCommentApiType,
	GithubCommentsApiType,
	GithubProfileApiType,
	GithubPullRequestApiType,
	GithubPullRequestsApiType,
	GithubRepositoriesApiType,
	GithubRepositoryApiType,
	GithubSeachRepositoriesApiType,
	GithubReviewApiType,
	GithubReviewsApiType
} from 'models/api';
import type { HeaderType } from 'models/skizzle';
import type { OAuthGithubConfigType } from 'providers/OAuthGithubConfig.provider';
import { Requester } from './Requester';

export class OAuthGithubRequester extends Requester<OAuthGithubConfigType> {
	public getHeader(config: OAuthGithubConfigType): HeaderType {
		return {
			accept: 'application/vnd.github.v3+json',
			authorization: config.access_token
		};
	}

	public async getProfile(): Promise<GithubProfileApiType> {
		return super.fetch(config.Github.get.profile());
	}

	public async getRepositories(
		query?: string,
		searchPrivateRepositories?: boolean
	): Promise<GithubRepositoryApiType[]> {
		let repos: GithubRepositoryApiType[] = [];

		if (searchPrivateRepositories) {
			repos.push(
				...((
					await super.fetch<GithubRepositoriesApiType>(config.Github.get.privateRepositories())
				).filter(({ name, full_name }) => {
					return (
						name.toLowerCase().includes(query.toLowerCase()) ||
						full_name.toLowerCase().includes(query.toLowerCase())
					);
				}) || [])
			);
		}

		repos.push(
			...(
				await super.fetch<GithubSeachRepositoriesApiType>(
					config.Github.get.repositories(query)
				)
			).items
		);

		return repos;
	}

	public async getPullRequests(
		owner?: string,
		repository?: string
	): Promise<GithubPullRequestApiType[]> {
		return await super.fetch<GithubPullRequestsApiType>(
			config.Github.get.pullRequests(owner, repository)
		);
	}

	public async getComments(
		owner?: string,
		repository?: string,
		pullRequest?: string
	): Promise<GithubCommentApiType[]> {
		return super.fetch<GithubCommentsApiType>(
			config.Github.get.comments(owner, repository, pullRequest)
		);
	}

	public async getReviews(
		owner?: string,
		repository?: string,
		pullRequest?: string
	): Promise<GithubReviewApiType[]> {
		return super.fetch<GithubReviewsApiType>(
			config.Github.get.reviews(owner, repository, pullRequest)
		);
	}
}
