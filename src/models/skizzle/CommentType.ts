import type { ProviderEnum } from './ProviderEnum';

type AuthorType = {
	displayName: string;
	avatar: string;
};

export type CommentType = {
	text: string;
	date: string;
	author: AuthorType;
	provider: ProviderEnum;
	organizationName?: string;
};
