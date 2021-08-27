import { CommentMapper } from './Comment.mapper';
import { ReviewMapper, ReviewMapperType } from './Review.mapper';
import {
	AzureDevOpsPullRequestApiType,
	AzureDevOpsVoteEnum,
	GithubPullRequestApiType,
	GithubVoteEnum
} from 'models/api';
import type { PullRequestType } from 'models/skizzle';
import { From, Mapper } from './Mapper';
import { get } from 'svelte/store';
import { profiles } from 'shared/stores/default.store';

export type PullRequestMapperType = From<
	AzureDevOpsPullRequestApiType,
	GithubPullRequestApiType
>;

export class PullRequestMapper extends Mapper<PullRequestMapperType, PullRequestType> {
	public to(data: PullRequestMapperType[], params: any): PullRequestType[] {
		return data.map(value => {
			const date = new Date(value.creationDate || value.updated_at);

			const labels =
				value.labels &&
				value.labels.map((x: any) => {
					if (x.hasOwnProperty('active') && x.active === false) {
						return;
					}

					return {
						name: x.name
					};
				});

			if (
				value.base?.repo?.owner?.type === 'Organization' &&
				value.base?.repo?.owner?.login
			) {
				params.projectName = value.base?.repo?.owner?.login;
			}

			const result: PullRequestType = {
				pullRequestId: value.pullRequestId || value.number,
				title: value.title,
				description: value.description || value.body,
				date: value.creationDate || value.updated_at,
				labels,
				user: {
					id: value.createdBy?.id || value.user?.id?.toString(),
					name: value.createdBy?.displayName || value.user?.login,
					avatar: value.createdBy?.descriptor || value.user?.avatar_url
				},
				url:
					value.html_url ||
					`https://dev.azure.com/${params.organizationName}/${params.projectName}/_git/${params.repositoryName}/pullrequest/${value.pullRequestId}`,
				isDraft: value.isDraft || value.draft,
				isConflict: value.mergeStatus && value.mergeStatus === 'conflicts',
				isAutoComplete: !!value.autoCompleteSetBy,
				...params
			};

			if (value.comments) {
				result.comments = new CommentMapper().to(value.comments, params);
			}

			if (value.reviewers) {
				result.hasReviewed = value.reviewers.some((x: ReviewMapperType) => {
					const profile = get(profiles).find(({ provider }) => provider === params.provider);
					var key = x.vote || x.state || '';
					return (
						profile.id === x.id.toString() &&
						(`${key}` === AzureDevOpsVoteEnum.Approved.toString() ||
							`${key}` === GithubVoteEnum.Approved)
					);
				});
				result.reviewers = new ReviewMapper().to(value.reviewers);
			}

			return result;
		});
	}
}
