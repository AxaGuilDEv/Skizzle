import type { IdentityType } from './IdentityType';

type ReviewsApiType = {};

enum AzureDevOpsVoteEnum {
	Approved = 10,
	ApproveWithSuggestions = 5,
	NoVote = 0,
	WaitingForAuthor = -5,
	Rejected = -10
}

enum GithubVoteEnum {
	Approved = 'APPROVED',
	RequestChange = 'CHANGES_REQUESTED',
	Pending = 'PENDING',
	Comment = 'COMMENTED'
}

type AzureDevOpsReviewApiType = {
	vote?: AzureDevOpsVoteEnum;
	id?: IdentityType;
};

type GithubReviewApiType = {
	id?: IdentityType;
	state?: GithubVoteEnum;
};

type AzureDevOpsReviewsApiType = {
	count: number;
	value: Array<AzureDevOpsReviewApiType> & ReviewsApiType;
};

type GithubReviewsApiType = Array<GithubReviewApiType> & ReviewsApiType;

export type {
	AzureDevOpsReviewApiType,
	AzureDevOpsReviewsApiType,
	GithubReviewApiType,
	GithubReviewsApiType
};

export { AzureDevOpsVoteEnum, GithubVoteEnum };
