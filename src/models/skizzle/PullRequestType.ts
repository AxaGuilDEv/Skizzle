import type { CommentType } from './CommentType';
import type { CommonType } from './CommonType';
import type { ReviewType } from './ReviewType';

type UserType = {
	id: string;
	name: string;
	avatar?: string;
};

type LabelType = {
	name: string;
};

type PullRequestType = {
	title: string;
	description: string;
	date: string;
	isDraft: boolean;
	isConflict: boolean;
	isAutoComplete: boolean;
	user: UserType;
	owner?: string;
	labels: LabelType[];
	url: string;
	comments: CommentType[];
	reviewers: ReviewType;
	hasReviewed: boolean;
} & CommonType;

export type { UserType, LabelType, PullRequestType };
