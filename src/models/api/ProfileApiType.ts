import type { IdentityType } from './IdentityType';

type ProfileApiType = {};

type ValueType = {
	value: string;
};

type AvatarType = {
	value: ValueType;
};

type CoreAttributesType = {
	Avatar: AvatarType;
};

type AzureDevOpsProfileApiType = {
	displayName?: string;
	emailAddress?: string;
	id?: IdentityType;
	coreAttributes?: CoreAttributesType;
} & ProfileApiType;

type GithubProfileApiType = {
	name?: string;
	email?: string;
	id?: IdentityType;
	avatar_url?: string;
} & ProfileApiType;

export type { ProfileApiType, AzureDevOpsProfileApiType, GithubProfileApiType };
