import type { CommonType } from './CommonType';

export type RepositoryType = {
	name: string;
	fullName?: string;
	owner?: string;
	gitUrl?: string;
} & CommonType;
