import type { IdentityType } from './IdentityType';

type CommentsApiType = {};

enum AzureDevOpsCommentApiEnum {
	Text = 'text',
	System = 'system',
	CodeChange = 'codeChange',
	Unknown = 'unknown'
}

enum AzureDevOpsCommentStatusApiEnum {
	Active = 'active',
	ByDesign = 'byDesign',
	Closed = 'closed',
	Fixed = 'fixed',
	Pending = 'pending',
	Unknown = 'unknown',
	WontFix = 'wontFix'
}

type AzureDevOpsCommentAuthorApiType = {
	displayName: string;
	id: IdentityType;
	uniqueName: string;
	descriptor: string;
};

type AzureDevOpsCommentType = {
	id?: IdentityType;
	content?: string;
	lastUpdatedDate?: string;
	commentType?: AzureDevOpsCommentApiEnum;
	author?: AzureDevOpsCommentAuthorApiType;
};

type AzureDevOpsCommentApiType = {
	id?: IdentityType;
	lastUpdatedDate?: string;
	isDeleted?: boolean;
	status?: AzureDevOpsCommentStatusApiEnum;
	comments?: AzureDevOpsCommentType[];
};

enum GithubUserEnum {
	User = 'User',
	Bot = 'Bot'
}

type GithubCommentUserApiType = {
	login: string;
	avatar_url: string;
	type: GithubUserEnum;
};

type GithubCommentApiType = {
	body?: string;
	id?: IdentityType;
	user?: GithubCommentUserApiType;
	updated_at?: string;
};

type AzureDevOpsCommentsApiType = {
	count: number;
	value: Array<AzureDevOpsCommentApiType> & CommentsApiType;
};

type GithubCommentsApiType = Array<GithubCommentApiType> & CommentsApiType;

export type {
	CommentsApiType,
	AzureDevOpsCommentApiType,
	GithubCommentApiType,
	AzureDevOpsCommentsApiType,
	GithubCommentsApiType,
	AzureDevOpsCommentType
};

export { AzureDevOpsCommentStatusApiEnum, AzureDevOpsCommentApiEnum, GithubUserEnum };
