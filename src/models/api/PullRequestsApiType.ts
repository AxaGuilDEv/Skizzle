import type { AzureDevOpsCommentApiType, GithubCommentApiType } from './CommentsApiType';
import type { AzureDevOpsRepositoryApiType } from './RepositoriesApiType';
import type { AzureDevOpsReviewApiType, GithubReviewApiType } from './ReviewsApiType';

type PullRequestsApiType = {};

type CreatedByApiType = {
	id?: string;
	displayName?: string;
	descriptor?: string;
};

type AzureDevOpsLabelsApiType = {
	name?: string;
	active?: boolean;
};

type AzureDevOpsPullRequestApiType = {
	pullRequestId?: string;
	title?: string;
	description?: string;
	creationDate?: string;
	isDraft?: boolean;
	mergeStatus?: string;
	autoCompleteSetBy?: any;
	reviewers?: AzureDevOpsReviewApiType[];
	createdBy?: CreatedByApiType;
	repository?: AzureDevOpsRepositoryApiType;
	labels?: AzureDevOpsLabelsApiType[];
	comments?: AzureDevOpsCommentApiType[];
};

type UserApiType = {
	id?: number;
	login?: string;
	avatar_url?: string;
};

type GithubLabelsApiType = {
	name?: string;
};

type GithubOwnerBaseApiType = {
	login?: string;
	type?: string;
};

type GithubRepoBaseApiType = {
	owner?: GithubOwnerBaseApiType;
};

type GithubBaseApiType = {
	repo?: GithubRepoBaseApiType;
};

type GithubPullRequestApiType = {
	title?: string;
	body?: string;
	user?: UserApiType;
	updated_at?: string;
	number?: number;
	draft?: boolean;
	labels?: GithubLabelsApiType[];
	base?: GithubBaseApiType;
	html_url?: string;
	reviewers?: GithubReviewApiType[];
	comments?: GithubCommentApiType[];
};

type AzureDevOpsPullRequestsApiType = {
	count: number;
	value: Array<AzureDevOpsPullRequestApiType> & PullRequestsApiType;
};

type GithubPullRequestsApiType = Array<GithubPullRequestApiType> & PullRequestsApiType;

export type {
	PullRequestsApiType,
	AzureDevOpsPullRequestApiType,
	GithubPullRequestApiType,
	AzureDevOpsPullRequestsApiType,
	GithubPullRequestsApiType
};
